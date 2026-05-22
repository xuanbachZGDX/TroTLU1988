'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostHistories', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      postId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: { model: 'Posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      editorId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      oldTitle: { type: Sequelize.STRING, allowNull: true },
      newTitle: { type: Sequelize.STRING, allowNull: true },
      oldPrice: { type: Sequelize.DOUBLE, allowNull: true },
      newPrice: { type: Sequelize.DOUBLE, allowNull: true },
      oldArea: { type: Sequelize.DOUBLE, allowNull: true },
      newArea: { type: Sequelize.DOUBLE, allowNull: true },
      oldDescription: { type: Sequelize.TEXT, allowNull: true },
      newDescription: { type: Sequelize.TEXT, allowNull: true },
      oldAddress: { type: Sequelize.TEXT, allowNull: true },
      newAddress: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('PostHistories');
  },
};
