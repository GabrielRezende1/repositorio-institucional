const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

global.__basedir = __dirname;
corsOptions = {
	origin: 'https://localhost:5173',
	credentials: true
};

const routes = {
	document: require("./routes/document"),
	home: require('./routes/home'),
	login: require('./routes/login'),
	policy: require("./routes/policy"),
	tutorial: require('./routes/tutorial'),
	user: require('./routes/user')
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use("/", routes.document);
app.use("/", routes.home);
app.use("/", routes.login);
app.use("/", routes.policy);
app.use("/", routes.tutorial);
app.use("/", routes.user);

module.exports = app;