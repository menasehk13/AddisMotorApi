import { DB_HOST, DB_NAME, DB_PWD, db_uri, DB_USER } from "./constants";
import mysql from "mysql2";

export default function connectDB() {
  // const db = mysql.createPool({
  //   host: DB_HOST,
  //   user: DB_USER,
  //   password: DB_PWD,
  //   database: DB_NAME,
  // });

  const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
  });

  db.connect(function (err) {
    if (err) return console.log(err, err.message);
    console.log("db connected 🔥🔥🔥");
  });

  return db;
}

export const DB = connectDB();
