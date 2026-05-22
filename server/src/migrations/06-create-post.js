'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      star: { type: Sequelize.STRING, defaultValue: '0' },
      address: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      categoryCode: { type: Sequelize.STRING },
      provinceCode: { type: Sequelize.STRING },
      districtCode: { type: Sequelize.STRING },
      priceCode: { type: Sequelize.STRING },
      areaCode: { type: Sequelize.STRING },
      priceNumber: { type: Sequelize.FLOAT },
      areaNumber: { type: Sequelize.FLOAT },
      status: { type: Sequelize.STRING, defaultValue: 'pending' },
      userId: { type: Sequelize.STRING },
      note: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Posts'); }
};
