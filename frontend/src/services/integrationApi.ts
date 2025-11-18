// src/services/integrationsApi.ts

export interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  connected: boolean;
  apiKey?: string;
  status?: "connected" | "error" | "disconnected";
}

export interface IntegrationStatus {
  service: string;
  connected: boolean;
}

// Mock data for development
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
  {
    id: "3",
    name: "Slack",
    description: "Team communication and notification system",
    type: "communication",
    connected: true,
    apiKey: "slack-key-67890",
    status: "connected"
  },
  {
    id: "4",
    name: "HubSpot",
    description: "Marketing automation and lead management",
    type: "marketing",
    connected: false,
    status: "disconnected"
  }
];

const mockStatus: IntegrationStatus[] = [
  { service: "Salesforce", connected: true },
  { service: "Zendesk", connected: false },
  { service: "Slack", connected: true },
  { service: "HubSpot", connected: false }
];

// API functions
export const integrationsApi = {
  // Get all integrations
  async list(): Promise<Integration[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockIntegrations;
  },

  // Get integration status
  async getStatus(): Promise<IntegrationStatus[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockStatus;
  },

  // Connect an integration
  async connect(id: string): Promise<Integration> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const integration = mockIntegrations.find(i => i.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    // Update integration status
    integration.connected = true;
    integration.status = "connected";
    
    return integration;
  },

  // Disconnect an integration
  async disconnect(id: string): Promise<Integration> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const integration = mockIntegrations.find(i => i.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    // Update integration status
    integration.connected = false;
    integration.status = "disconnected";
    
    return integration;
  },

  // Create new integration
  async create(integration: Omit<Integration, 'id'>): Promise<Integration> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newIntegration: Integration = {
      ...integration,
      id: Math.random().toString(36).substr(2, 9) // Generate random ID
    };

    mockIntegrations.push(newIntegration);
    return newIntegration;
  },

  // Delete integration
  async delete(id: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error(`Integration with id ${id} not found`);
    }

    mockIntegrations.splice(index, 1);
  }
};

export default integrationsApi;