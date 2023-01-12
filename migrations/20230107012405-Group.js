'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Group', {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      groupName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      thumbnail: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId',
        },
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Group');
  },
};
