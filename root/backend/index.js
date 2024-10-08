require("dotenv").config();
const fs = require('fs');

const app = require('./express/app');
const db = require('./db/models/index');

async function assertDatabaseConnectionOk() {
	console.log(`Verificando conexão com o Banco de Dados...`);
	try {
		await db.sequelize.authenticate({logging: false});
		console.log('Conexão com o Banco de Dados OK!');
		await db.sequelize.sync({logging: false});
		console.log('Modelos do Banco de Dados OK!');
	} catch (error) {
		console.log('Não foi possível conectar com o Banco de Dados: ');
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