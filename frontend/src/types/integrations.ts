export interface Integration {
  connected: boolean;
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
}

export interface IntegrationConfig {
  apiKey?: string;
  endpoint?: string;
}
