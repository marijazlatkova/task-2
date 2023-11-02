const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config.env` });

require("./pkg/db");3

const auth = require("./handlers/auth");
const a = require("./handlers/academies");
const c = require("./handlers/courses");

const app = express();
app.use(express.json());

app.use(
  jwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    getToken: (req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      }
      if (req.cookies.jwt) {
        return req.cookies.jwt;
      }
      return null;
    },
  }).unless({
    path: [
      "/api/v1/auth/register", 
      "/api/v1/auth/login",
      "/api/v1/auth/refreshToken",
      "/api/v1/auth/forgotPassword",
      "/api/v1/auth/resetPassword"
    ],
  })
);

app.post("/api/v1/auth/register", auth.register);
app.post("/api/v1/auth/login", auth.login);
app.post("/api/v1/auth/refreshToken", auth.refreshToken);
app.post("/api/v1/auth/forgotPassword", auth.forgotPassword);
app.post("/api/v1/auth/resetPassword", auth.resetPassword);

app.get("/academies", a.getAll);
app.post("/academies", a.create);

app.get("/courses", c.getAll);
app.get("/courses/:id", c.getOne);
app.post("/courses", auth.protect, c.create);
app.put("/courses/:id", auth.protect, c.update);
app.delete("/courses/:id", auth.protect, c.remove);

app.listen(process.env.PORT, (err) => {
  err 
  ? console.log(err)
  : console.log(`Server started successfully at port ${process.env.PORT}`);
});