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

//static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

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

app.get('/frontend', (req,res) => {
    res.render('frontend_page', {
        title: 'testing front end'
    })
});

app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'This is the create user page',
    });
});

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

app.get('/edit/:userId', (req, res) => {
    const userID = req.params.userId;
    let sql = `SELECT * FROM users
               WHERE users.id = ${userID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result[0])
        res.render('user_edit', {
            title: 'This is edit user page',
            user: result[0]
        });
    });
});

app.post('/update', (req, res) => {
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no}
    let userId = req.body.id;
    let sql = `UPDATE users SET ? WHERE users.id = ${userId}`
    connection.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    })
})

//listen to server
app.listen(3000, () => {
    console.log('server is running at port 3000');
});