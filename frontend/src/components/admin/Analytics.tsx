import { useEffect, useState } from "react";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalQueries: 0,
    activeUsers: 0,
    integrations: 0,
  });

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setStats({ totalQueries: 1250, activeUsers: 87, integrations: 5 });
    }, 500);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-700">Total Queries</h3>
        <p className="text-2xl font-bold">{stats.totalQueries}</p>
      </div>

      <div className="bg-green-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-green-700">Active Users</h3>
        <p className="text-2xl font-bold">{stats.activeUsers}</p>
      </div>

      <div className="bg-purple-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-purple-700">Integrations</h3>
        <p className="text-2xl font-bold">{stats.integrations}</p>
      </div>
    </div>
  );
}
