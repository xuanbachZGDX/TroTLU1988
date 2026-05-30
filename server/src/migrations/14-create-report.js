"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reports", {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      postId: {
        type: Sequelize.STRING,
        references: { model: "Posts", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: Sequelize.STRING,
        references: { model: "Users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      reason: { type: Sequelize.STRING },
      content: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING, defaultValue: "pending" },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reports");
  },
};
