import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
