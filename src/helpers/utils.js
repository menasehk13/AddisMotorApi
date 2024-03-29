import express from "express";
import jwt from "jsonwebtoken";
import { JWTExpiresIn, JWTSecretKey, STATIC_FILES_URL } from "./constants";

export function appConfig(app) {
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  app.use("/static", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

export const signToken = (id) => {
  return jwt.sign({ id }, JWTSecretKey, {
    expiresIn: JWTExpiresIn,
  });
};

export const createSendToken = (user, results, statusCode, res) => {
  const token = signToken(user.id);
  const id = results.insertId;
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  return res.status(statusCode).json({
    status: "success",
    message: "user registered successfully",
    id,
    token,
    user,
  });
};

export function simpleGetUser(req, value) {
  const type = req.params.type || "driver";
  return `SELECT * FROM ${type} WHERE id='${value}'`;
}

export function staticFilePath(filename) {
  // /static/data/uploads/imagename.png
  return STATIC_FILES_URL + filename.replace(" ", "%20");
}
