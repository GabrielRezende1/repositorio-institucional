const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

global.__basedir = __dirname;
corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true
};

const routes = {
	document: require("./routes/document"),
	home: require('./routes/home'),
	login: require('./routes/login'),
	tutorial: require('./routes/tutorial'),
	user: require('./routes/user')
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use("/api/", routes.document);
app.use("/api/", routes.home);
app.use("/api/", routes.login);
app.use("/api/", routes.tutorial);
app.use("/api/", routes.user);

module.exports = app;