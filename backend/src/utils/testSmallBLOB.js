import duckdb from "duckdb";
import fs from "fs";
import path from "path";

console.log("Starting testSmallBLOB.js...");
const dbDir = "C:\\Users\\patel\\knowly";
const dbFile = path.join(dbDir, "testDB.duckdb");

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
conn.exec(`CREATE TABLE test (id VARCHAR, data BLOB)`, (err) => {
  if (err) {
    console.error("Table creation error:", err);
    process.exit(1);
  }
  console.log("Table created ✅");
});

const smallBuffer = Buffer.from(new Float32Array([1, 2, 3, 4, 5]).buffer);
console.log("Small buffer length:", smallBuffer.length, "Sample:", Array.from(smallBuffer.slice(0, 16)));

console.log("Preparing statement for insertion...");
const stmt = conn.prepare(`INSERT INTO test VALUES (?, ?)`, (err) => {
  if (err) {
    console.error("Prepare error:", err);
    process.exit(1);
  }
  console.log("Statement prepared ✅");
  console.log("Executing statement for insertion...");
  stmt.run("test1", smallBuffer, (err) => {
    if (err) {
      console.error("Insert error:", err);
      process.exit(1);
    }
    console.log("Inserted ✅");
  });
  console.log("stmt.run called for insertion");
  console.log("Finalizing statement...");
  stmt.finalize((err) => {
    if (err) {
      console.error("Finalize error:", err);
      process.exit(1);
    }
    console.log("Statement finalized ✅");
  });
});
console.log("conn.prepare called for insertion");

console.log("Querying table...");
conn.all(`SELECT * FROM test`, (err, res) => {
  if (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
  console.log("Rows:", JSON.stringify(res, null, 2));
  res.forEach((row) => {
    console.log("Parsed BLOB data:", Array.from(row.data));
  });
  console.log("Closing DuckDB connection...");
  conn.close();
  db.close();
});
console.log("conn.all called for query");