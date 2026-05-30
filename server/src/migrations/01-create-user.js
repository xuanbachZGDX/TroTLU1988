"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      zalo: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      avatar: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING, defaultValue: "user" },
      balance: { type: Sequelize.INTEGER, defaultValue: 0 },
      otp: { type: Sequelize.STRING, allowNull: true },
      passwordResetExpires: { type: Sequelize.DATE, allowNull: true },
      status: { type: Sequelize.STRING, defaultValue: "active" },
      cccdNumber: { type: Sequelize.STRING },
      cccdFront: { type: Sequelize.STRING },
      cccdBack: { type: Sequelize.STRING },
      kycStatus: { type: Sequelize.STRING, defaultValue: "unverified" },
      kycNote: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
