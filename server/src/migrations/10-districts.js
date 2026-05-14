'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Districts', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      code: { type: Sequelize.STRING, unique: true },
      value: { type: Sequelize.STRING },
      provinceCode: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Districts'); }
};
