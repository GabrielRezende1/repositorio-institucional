const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = {
	document: require("./routes/document"),
	home: require('./routes/home'),
	login: require('./routes/login'),
	tutorial: require('./routes/tutorial'),
	user: require('./routes/user')
}

const app = express();

app.use(cors({origin: 'https://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use("/", routes.document);
app.use("/", routes.home);
app.use("/", routes.login);
app.use("/", routes.tutorial);
app.use("/", routes.user);

module.exports = app;