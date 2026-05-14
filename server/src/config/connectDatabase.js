const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('phongtro123', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00'
});

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });

        console.log('Database synced!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDb
