import duckdb from "duckdb";
import fs from "fs";
import path from "path";

console.log("Starting testMinimalBLOB.js...");
const dbDir = "C:\\Users\\patel\\knowly";
const dbFile = path.join(dbDir, "testMinimalDB.duckdb");

if (!fs.existsSync(dbDir)) {
  console.log(`Creating directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
} else {
  console.log(`Directory exists: ${dbDir}`);
}

if (fs.existsSync(dbFile)) {
  console.log("Removing existing test database file...");
  fs.unlinkSync(dbFile);
}

console.log("Initializing DuckDB...");
const db = new duckdb.Database(dbFile);
const conn = db.connect();

console.log("Creating table...");
conn.exec(`CREATE TABLE test (data BLOB)`, (err) => {
  if (err) {
    console.error("Table creation error:", err);
    process.exit(1);
  }
  console.log("Table created ✅");
});

const tinyBuffer = Buffer.from([1, 2, 3]);
console.log("Tiny buffer length:", tinyBuffer.length, "Sample:", Array.from(tinyBuffer));

console.log("Executing conn.run for insertion...");
conn.run(`INSERT INTO test VALUES (?)`, tinyBuffer, (err) => {
  if (err) {
    console.error("Insert error:", err);
    process.exit(1);
  }
  console.log("Inserted ✅");
});
console.log("conn.run called for insertion");

console.log("Querying table...");
conn.all(`SELECT * FROM test`, (err, res) => {
  if (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
  console.log("Rows:", JSON.stringify(res, null, 2));
  console.log("Closing DuckDB connection...");
  conn.close();
  db.close();
});
console.log("conn.all called for query");