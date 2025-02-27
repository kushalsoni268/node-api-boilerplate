const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
 
const app = express();
 
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(cors());
 
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
 
/* Handling Errors */
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
 
app.listen(process.env.PORT,() => console.log('Server is running on port ' + process.env.PORT));