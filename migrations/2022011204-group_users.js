'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_users', {
      group_user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      group_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'groups',
          key: 'group_id',
        },
        onDelete: 'cascade',
      },
      user_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'cascade',
      },
      admin_flag: {
        allowNull: true,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_users');
  },
};
