import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "16120302Ad!",
  database: "cafeteria_app",
});

export default db;
