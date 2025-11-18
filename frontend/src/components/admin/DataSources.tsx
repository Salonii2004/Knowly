import { useState } from "react";

export default function DataSources() {
  const [sources, setSources] = useState([
    { id: 1, name: "Google Drive", status: "active" },
    { id: 2, name: "Slack", status: "inactive" },
    { id: 3, name: "Confluence", status: "active" },
  ]);

  const toggleStatus = (id: number) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
      )
    );
  };

  return (
    <div>
      <ul className="space-y-3">
        {sources.map((s) => (
          <li
            key={s.id}
            className="flex justify-between items-center border rounded-lg px-4 py-2"
          >
            <span>{s.name}</span>
            <button
              onClick={() => toggleStatus(s.id)}
              className={`px-3 py-1 rounded-lg text-sm ${
                s.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {s.status === "active" ? "Active" : "Inactive"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
