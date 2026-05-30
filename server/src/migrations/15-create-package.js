"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Packages", {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      name: { type: Sequelize.STRING, allowNull: false },
      star: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      color: { type: Sequelize.STRING, defaultValue: "text-gray-600" },
      benefit: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Packages");
  },
};
