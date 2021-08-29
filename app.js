const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql2');
const app = express();
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'crud_express'
});

connection.connect(function(error) {
    error ? console.log(error) : console.log('Database connected!');
});

//this sets the views to be directed to the views folder, try removing the 's' from views and try it out
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'This is the user_index page',
            users : rows
        });
    });
});

//listen to server
app.listen(3000, () => {
    console.log('server is running at port 3000');
});

