import { db_uri } from "./constants";
import mysql from "mysql2";
import dotenv from "dotenv";

export default function connectDB() {
  dotenv.config();

  // FIXME:
  //sotenv not working
  const db = mysql.createConnection({
    host: "192.168.5.8",
    user: "Wedetadmin",
    password: "p@55w0rd",
    database: "Driver",
  });
  db.connect((err) => {
    if (err) return err;
    console.log("db connected 🔥");
  });

  return db;
}
