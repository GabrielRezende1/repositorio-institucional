const express = require('express');
const cookieParser = require('cookie-parser');

global.__basedir = __dirname;

const routes = {
	document: require("./routes/document"),
	home: require('./routes/home'),
	login: require('./routes/login'),
	policy: require("./routes/policy"),
	tutorial: require('./routes/tutorial'),
	user: require('./routes/user')
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use("/api/", routes.document);
app.use("/api/", routes.home);
app.use("/api/", routes.login);
app.use("/api/", routes.policy);
app.use("/api/", routes.tutorial);
app.use("/api/", routes.user);

module.exports = app;