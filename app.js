const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql2');
const { maxHeaderSize } = require('http');
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


app.get('/', (req, res) => {
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'This is the user_index page',
            users : rows
        });
    });
});

// app.get('/create', async(req, res) => {
//     let sql = "INSERT INTO users VALUES (4, 'test', 'test@gmail.com', 123)";
//     connection.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('user_index', {
//             title : 'This is the user_index page',
//             users : rows
//         });
//     });
// });

app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'This is the create user page',
    });
});

// app.post('/save', (req , res) => {
//     let data;
//     let sql = "INSERT INTO users SET ?";
//     let query = "SELECT COUNT(id) AS max_id FROM users"
//     connection.query(query, (err, rows) => {
//         if (err) throw err;
//         data = {id: rows[0].max_id + 1, name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
//         connection.query(sql, data, (err, results) => {
//             if (err) throw err;
//             res.redirect('/');
//         });
//     });
// });

app.post('/save', (req , res) => {
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:userId', (req,res) => {
    const userID = req.params.userId;
    let sql = `DELETE FROM users WHERE id = ${userID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//listen to server
app.listen(3000, () => {
    console.log('server is running at port 3000');
});

