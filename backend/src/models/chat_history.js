const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatHistory = sequelize.define('ChatHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    message: DataTypes.TEXT,
    role: DataTypes.STRING,
  });

  ChatHistory.associate = (models) => {
    ChatHistory.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ChatHistory;
};