const db = require('../models');
const axios = require('axios');

const migrate = async () => {
  try {
    console.log('--- Bắt đầu di chuyển dữ liệu sang mã chuẩn API ---');
    
    // 1. Lấy danh sách tỉnh từ API công khai
    const response = await axios.get('https://provinces.open-api.vn/api/p/');
    const publicProvinces = response.data;

    await db.sequelize.transaction(async (t) => {
      for (const pub of publicProvinces) {
        const provinceName = pub.name.replace('Tỉnh ', '').replace('Thành phố ', '').trim();
        
        // Tìm tỉnh trong DB của mình bằng tên
        const localProvince = await db.Province.findOne({
          where: {
            value: { [db.Sequelize.Op.like]: `%${provinceName}%` }
          },
          transaction: t
        });

        if (localProvince) {
          const oldCode = localProvince.code;
          const newCode = String(pub.code);

          console.log(`Đang chuyển: ${localProvince.value} (${oldCode} -> ${newCode})`);

          // Cập nhật mã trong bảng Posts
          await db.Post.update(
            { provinceCode: newCode },
            { where: { provinceCode: oldCode }, transaction: t }
          );

          await db.District.update(
            { provinceCode: newCode },
            { where: { provinceCode: oldCode }, transaction: t }
          );

          await db.Province.update(
            { id: newCode, code: newCode },
            { where: { id: localProvince.id }, transaction: t }
          );
        }
      }
    });

    console.log('--- Di chuyển dữ liệu THÀNH CÔNG! ---');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi di chuyển dữ liệu:', error);
    process.exit(1);
  }
};

migrate();
