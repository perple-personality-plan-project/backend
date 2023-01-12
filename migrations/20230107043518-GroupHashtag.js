'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupHashtag', {
      groupHashtagId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      groupId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Group',
          key: 'groupId',
        },
        onDelete: 'cascade',
      },
      groupFeedId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'GroupFeed',
          key: 'groupFeedId',
        },
        onDelete: 'cascade',
      },
      hashtagId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Hashtag',
          key: 'hashtagId',
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
    await queryInterface.dropTable('GroupHashtag');
  },
};
