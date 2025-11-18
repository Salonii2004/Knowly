// src/migrations/20251002-alter-documents.js
import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    // Add metadata column
    await queryInterface.addColumn('documents', 'metadata', {
      type: DataTypes.JSON,
      allowNull: true,
    });
    // Make title nullable
    await queryInterface.changeColumn('documents', 'title', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    // Change id to STRING and remove autoIncrement
    await queryInterface.changeColumn('documents', 'id', {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.sequelize.query('ALTER TABLE documents ALTER COLUMN id DROP DEFAULT;');
    await queryInterface.sequelize.query('DROP SEQUENCE IF EXISTS documents_id_seq;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'metadata');
    await queryInterface.changeColumn('documents', 'title', {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('documents', 'id', {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    });
  },
};