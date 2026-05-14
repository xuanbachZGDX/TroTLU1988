'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Overviews', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.STRING },
      postId: { type: Sequelize.STRING },
      code: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      target: { type: Sequelize.STRING },
      bonus: { type: Sequelize.STRING },
      published: { type: Sequelize.STRING },
      expired: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Overviews'); }
};
