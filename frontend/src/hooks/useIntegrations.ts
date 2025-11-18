// hooks/useIntegrations.ts
import { useState, useEffect } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  connected: boolean;
  apiKey?: string;
  status?: "connected" | "error" | "disconnected";
}

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Properly typed as string | null

  const mockIntegrations: Integration[] = [
    {
      id: "1",
      name: "Salesforce",
      description: "CRM integration for customer data synchronization and management",
      type: "crm",
      connected: true,
      apiKey: "sf-key-12345",
      status: "connected"
    },
    {
      id: "2",
      name: "Zendesk",
      description: "Support ticket management and customer service platform",
      type: "support",
      connected: false,
      status: "disconnected"
    },
    // ... more integrations
  ];

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIntegrations(mockIntegrations);
      } catch (err) {
        setError("Failed to load integrations. Please try again."); // Set as string
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const toggleIntegration = async (id: string) => {
    try {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id 
            ? { 
                ...integration, 
                connected: !integration.connected,
                status: !integration.connected ? "connected" : "disconnected"
              }
            : integration
        )
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError("Failed to toggle integration"); // Set as string
    }
  };

  return {
    integrations,
    toggleIntegration,
    loading,
    error
  };
};