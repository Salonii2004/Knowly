import { Sequelize } from "sequelize";
import UserModel from "./User.js";
import DocumentModel from "./Document.js";
import { RefreshToken } from "./RefreshToken.js";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);
// Initialize models
const User = UserModel(sequelize);
const Document = DocumentModel(sequelize);

// Define associations
User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

// Group models for cleaner imports
export const models = {
  User,
  Document,
  RefreshToken,
};

// Database sync function
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database synced ✅");
  } catch (err) {
    console.error("Database sync failed:", err);
    throw err;
  }
};

// Export sequelize and models (no duplicates)
export { sequelize };
