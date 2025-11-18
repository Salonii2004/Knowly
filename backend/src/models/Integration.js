
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Integration = sequelize.define(
    'Integration',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apiKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'integrations',
      timestamps: true,
    }
  );

  Integration.associate = (models) => {
    Integration.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Integration;
};
