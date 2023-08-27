"use strict";
require("dotenv").config();
const cors          = require('cors');
const express       = require("express");
const app           = express();
app.use(cors());
app.use(express.json());
const productRoute  = require("./routes/product");
app.use('/produto' , productRoute); //for express.Route() handling
const db            = require('./db/models/index');

//Listen
app.listen(process.env.PORT, () => {
    console.log(`App listening on http://localhost:${process.env.PORT}`);
});
//
