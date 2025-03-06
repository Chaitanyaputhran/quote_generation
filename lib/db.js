import mysql from "mysql2/promise";

export async function connectToDB() {
  const connection = await mysql.createConnection({
    host: "192.168.1.10", // Ensure this is the correct IP
    user: "company", // Ensure it's a valid username
    password: "Ukshati@123!", // Ensure password is correct
    database: "company_db", // Ensure database exists
  });
  return connection;
}
