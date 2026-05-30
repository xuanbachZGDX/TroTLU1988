"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Dọn dẹp các bản ghi mồ côi (orphaned records) để tránh lỗi ràng buộc khóa ngoại (Foreign Key Violation)
    await queryInterface.sequelize.query(
      `DELETE FROM Posts WHERE userId NOT IN (SELECT id FROM Users)`,
    );
    await queryInterface.sequelize.query(
      `UPDATE Posts SET categoryCode = NULL WHERE categoryCode IS NOT NULL AND categoryCode NOT IN (SELECT code FROM Categories)`,
    );
    await queryInterface.sequelize.query(
      `UPDATE Posts SET provinceCode = NULL WHERE provinceCode IS NOT NULL AND provinceCode NOT IN (SELECT code FROM Provinces)`,
    );
    await queryInterface.sequelize.query(
      `UPDATE Posts SET districtCode = NULL WHERE districtCode IS NOT NULL AND districtCode NOT IN (SELECT code FROM Districts)`,
    );

    // 2. Chuẩn hóa kiểu dữ liệu
    // Chuyển cột star từ STRING sang INTEGER
    await queryInterface.changeColumn("Posts", "star", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });

    // Chuyển cột balance của Users sang BIGINT đề phòng tràn số
    await queryInterface.changeColumn("Users", "balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });

    // 3. Thiết lập các ràng buộc khóa ngoại (Foreign Key Constraints)
    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "posts_userId_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Posts", {
      fields: ["categoryCode"],
      type: "foreign key",
      name: "posts_categoryCode_fk",
      references: {
        table: "Categories",
        field: "code",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Posts", {
      fields: ["provinceCode"],
      type: "foreign key",
      name: "posts_provinceCode_fk",
      references: {
        table: "Provinces",
        field: "code",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Posts", {
      fields: ["districtCode"],
      type: "foreign key",
      name: "posts_districtCode_fk",
      references: {
        table: "Districts",
        field: "code",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // 4. Tạo thêm Composite Index phục vụ tối ưu bộ lọc tìm kiếm phổ biến
    await queryInterface.addIndex(
      "Posts",
      ["status", "provinceCode", "priceNumber", "areaNumber"],
      {
        name: "posts_search_filter_idx",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    // Gỡ các ràng buộc khóa ngoại
    await queryInterface.removeConstraint("Posts", "posts_userId_fk");
    await queryInterface.removeConstraint("Posts", "posts_categoryCode_fk");
    await queryInterface.removeConstraint("Posts", "posts_provinceCode_fk");
    await queryInterface.removeConstraint("Posts", "posts_districtCode_fk");

    // Gỡ index
    await queryInterface.removeIndex("Posts", "posts_search_filter_idx");

    // Khôi phục kiểu dữ liệu ban đầu
    await queryInterface.changeColumn("Posts", "star", {
      type: Sequelize.STRING,
      defaultValue: "0",
    });

    await queryInterface.changeColumn("Users", "balance", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
};
