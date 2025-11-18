// src/api/api.d.ts
import { User } from "../contexts/AuthContext"; // Adjust path if needed

export declare function login(email: string, password: string): Promise<User>;
export declare function refreshToken(): Promise<string>;
export declare function sendChatMessage(message: string, token: string): Promise<string>;