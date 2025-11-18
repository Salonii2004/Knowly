import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Document = sequelize.define("Document", {
    title: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    metadata: { type: DataTypes.JSONB, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "new" },
    file: { type: DataTypes.BLOB, allowNull: true },
  });

  return Document;
};
