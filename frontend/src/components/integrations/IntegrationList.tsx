import { useEffect, useState } from "react";
import { integrationsApi, Integration } from "../../services/integrationApi";

const IntegrationList = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch integrations on mount
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await integrationsApi.list();
        setIntegrations(data);
      } catch {
        setError("Failed to load integrations");
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  // Connect integration
  const handleConnect = async (id: string) => {
    try {
      await integrationsApi.connect(id);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: true } : i))
      );
    } catch {
      setError(`Failed to connect integration ${id}`);
    }
  };

  if (loading) return <p>Loading integrations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {integrations.map((integration) => (
        <div
          key={integration.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <span>{integration.name}</span>
          {integration.connected ? (
            <span style={{ color: "green", fontWeight: "bold" }}>Connected</span>
          ) : (
            <button onClick={() => handleConnect(integration.id)}>Connect</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default IntegrationList;
