'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Indexes cho các cột thường xuyên lọc trên bảng Posts
    await queryInterface.addIndex('Posts', ['status']);
    await queryInterface.addIndex('Posts', ['provinceCode']);
    await queryInterface.addIndex('Posts', ['districtCode']);
    await queryInterface.addIndex('Posts', ['priceNumber']);
    await queryInterface.addIndex('Posts', ['areaNumber']);
    await queryInterface.addIndex('Posts', ['userId']);
    await queryInterface.addIndex('Posts', ['star']);
    await queryInterface.addIndex('Posts', ['createdAt']);
    
    // Composite index cho việc tìm kiếm trạng thái + sắp xếp theo độ VIP & ngày đăng
    await queryInterface.addIndex('Posts', ['status', 'star', 'createdAt']);

    // Indexes cho bảng Users phục vụ đăng nhập
    await queryInterface.addIndex('Users', ['phone']);
    await queryInterface.addIndex('Users', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Posts', ['status']);
    await queryInterface.removeIndex('Posts', ['provinceCode']);
    await queryInterface.removeIndex('Posts', ['districtCode']);
    await queryInterface.removeIndex('Posts', ['priceNumber']);
    await queryInterface.removeIndex('Posts', ['areaNumber']);
    await queryInterface.removeIndex('Posts', ['userId']);
    await queryInterface.removeIndex('Posts', ['star']);
    await queryInterface.removeIndex('Posts', ['createdAt']);
    await queryInterface.removeIndex('Posts', ['status', 'star', 'createdAt']);
    
    await queryInterface.removeIndex('Users', ['phone']);
    await queryInterface.removeIndex('Users', ['email']);
  }
};
