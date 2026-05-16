const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('phongtro123', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

const updateDatabase = async () => {
    try {
        await sequelize.query("ALTER TABLE Contacts ADD COLUMN response TEXT AFTER content;");
        console.log("SUCCESS: Đã thêm cột 'response' vào bảng Contacts thành công!");
    } catch (error) {
        if (error.original && error.original.errno === 1060) {
            console.log("INFO: Cột 'response' đã tồn tại trong database rồi.");
        } else {
            console.error("ERROR: Lỗi khi cập nhật database:", error.message);
        }
    } finally {
        await sequelize.close();
    }
};

updateDatabase();
