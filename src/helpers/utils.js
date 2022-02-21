import express from "express";

export function appConfig(app) {
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  app.use("/static", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
