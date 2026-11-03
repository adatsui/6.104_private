import { Database } from "bun:sqlite";

const db = new Database(":memory:");
db.run("CREATE TABLE users (username TEXT, password TEXT)");
db.run("INSERT INTO users VALUES ('alice', 'wonderland'), ('admin', 'x7Qp!n9zRv')");

const [username, password] = process.argv.slice(2);

const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
console.log("SQL:", sql, [username, password]);

try {
  const user = db.query(sql).get(username, password) as { username: string } | null;
  console.log(user ? `Logged in as ${user.username}` : "Login failed");
} catch (e: any) {
  console.log("Error:", e.message);
}