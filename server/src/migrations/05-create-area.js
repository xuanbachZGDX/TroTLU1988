'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Areas', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      order: { type: Sequelize.INTEGER },
      code: { type: Sequelize.STRING, unique: true },
      value: { type: Sequelize.STRING },
      min: { type: Sequelize.FLOAT },
      max: { type: Sequelize.FLOAT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Areas'); }
};
