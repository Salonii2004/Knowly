import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,       // Knowly_db
  process.env.DB_USER,       // your postgres username
  process.env.DB_PASSWORD,   // your postgres password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);
