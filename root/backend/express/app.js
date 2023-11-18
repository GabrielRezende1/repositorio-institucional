const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = {
	cart: require('./routes/cart'),
	login: require('./routes/login'),
    produto: require('./routes/product'),
	user: require('./routes/user')
}

const app = express();

app.use(cors({origin: 'https://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', routes.cart);
app.use('/', routes.login);
app.use('/produto' , routes.produto); //for express.Route() handling
app.use('/', routes.user);

module.exports = app;