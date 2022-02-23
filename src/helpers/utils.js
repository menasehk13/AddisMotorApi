import express from "express";

export function appConfig(app) {
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  app.use("/static", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export function simpleGetUser(req, value) {
  const type = req.params.type || "user";
  return `SELECT * FROM ${type} WHERE id=${value}`;
}
