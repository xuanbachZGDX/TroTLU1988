'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostFeatures', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      postId: { type: Sequelize.STRING },
      featureId: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('PostFeatures'); }
};
