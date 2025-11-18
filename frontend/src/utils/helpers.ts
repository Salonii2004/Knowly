// Delay function (useful for simulating latency in dev)
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random ID
export const generateId = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// Check if string is empty or whitespace
export const isEmpty = (str: string) => !str || str.trim().length === 0;
