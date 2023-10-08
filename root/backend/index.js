require("dotenv").config();

const app = require('./express/app');
const db = require('./db/models/index');

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await db.sequelize.authenticate();
		console.log('Database connection OK!');
		await db.sequelize.sync();
		console.log('Database models OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();

	console.log(`Inicializando app na porta ${process.env.PORT}...`);

	app.listen(process.env.PORT, () => {
        console.log(`App escutando em http://localhost:${process.env.PORT}`);
    });
}

init();