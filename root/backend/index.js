require("dotenv").config();
const fs = require('fs');

const app = require('./express/app');
const db = require('./db/models/index');

const options = { // .pem is outside of project for safety
	key: fs.readFileSync('../../../localhost-key.pem', 'utf-8'),
	cert: fs.readFileSync('../../../localhost.pem', 'utf-8')
}
const https = require('https');
const server = https.createServer(options, app);

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await db.sequelize.authenticate();
		console.log('Database connection OK!');
		//await db.sequelize.sync();
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

	server.listen(process.env.PORT);

	console.log(`App escutando em https://localhost:${process.env.PORT}`);
}

init();