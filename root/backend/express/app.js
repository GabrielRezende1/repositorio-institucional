const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = {
	login: require('./routes/login'),
	user: require('./routes/user')
}

const app = express();

app.use(cors({origin: 'https://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', routes.login);
app.use('/', routes.user);

module.exports = app;