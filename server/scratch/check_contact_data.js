const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('phongtro123', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

const checkData = async () => {
    try {
        const [results] = await sequelize.query("SELECT id, name, status, response FROM Contacts LIMIT 5;");
        console.log("DATA_CHECK:", JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("ERROR:", error.message);
    } finally {
        await sequelize.close();
    }
};

checkData();
