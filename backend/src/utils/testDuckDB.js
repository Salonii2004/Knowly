// testDuckDB.js
import duckdb from "duckdb";
const db = new duckdb.Database(":memory:");
const conn = db.connect();
conn.exec(`CREATE TABLE test (id VARCHAR, text VARCHAR, data BLOB, meta VARCHAR)`, (err) => {
  if (err) console.error("Table creation error:", err);
  else console.log("Table created");
});
conn.run(
  `INSERT INTO test VALUES (?, ?, ?, ?)`,
  "test1",
  "Hello",
  Buffer.from([1, 2, 3]),
  '{"key":"value"}',
  (err) => console.log(err ? `Insert error: ${err}` : "Inserted")
);
conn.all(`SELECT * FROM test`, [], (err, res) => {
  console.log(err ? `Query error: ${err}` : `Rows: ${JSON.stringify(res)}`);
  conn.close();
  db.close();
});