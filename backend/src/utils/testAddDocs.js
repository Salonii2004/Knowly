// src/utils/testAddDocs.js
import { addDocuments, queryDocuments } from "./vectorDB.js";

async function main() {
  try {
    console.log("Adding documents...");
    const docs = [
      { id: "1", text: "CRM contains customer tickets.", metadata: { source: "CRM" } },
      { id: "2", text: "Knowledge base stores all company guides.", metadata: { source: "KB" } },
    ];

    await addDocuments(docs);
    console.log("✅ Documents added successfully!");

    console.log("Querying documents...");
    const results = await queryDocuments("Where are support tickets?");
    console.log("Query results:", JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("❌ Error in main:", err);
    process.exit(1);
  }
}

main();