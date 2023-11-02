const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../pkg/accounts");
const { sendPasswordResetEmail } = require("../pkg/mailer");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Account.findOne({ email });
    if (exists) {
      return res.status(400).send("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await Account.create({
      name,
      email,
      password: hashedPassword
    });
    return res.status(201).send(newUser);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).send("Account not found!");
    }
    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).send("Incorrect password!");
    }
    const payload = {
      name: account.name,
      email: account.email,
      id: account._id,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true
    });
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const refreshToken = async (req, res) => {
  try {
    const payload = {
      ...req.auth,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).send(token);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).send("Account not found");
    }
    const resetToken = jwt.sign(
      { accountId: account._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    account.resetToken = resetToken;
    await account.save();
    const resetLink = `${process.env.RESET_PASSWORD_LINK}?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);
    return res.status(200).send("Password reset link has been sent to your email");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { old_password, new_password, email } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).send("Account not found!");
    }
    if (!bcrypt.compareSync(old_password, account.password)) {
      return res.status(400).send("Incorrect old password!");
    }
    if (old_password === new_password) {
      return res.status(400).send("New password cannot be the same as the old password");
    }
    account.password = bcrypt.hashSync(new_password);
    await account.save();
    return res.status(200).send("Password reset successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).send("You are not logged in! Please log in");
    }
    const decodedToken = await verifyToken(token);
    req.auth = decodedToken;
    next();
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        reject(new Error("Token verification failed"));
      } else {
        resolve(decodedToken);
      }
    });
  });
};

module.exports = { 
  register, 
  login, 
  refreshToken,
  forgotPassword, 
  resetPassword,
  protect 
};