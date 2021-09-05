# Express_CRUD
This is a CRUD template for Node JS Express and MySQL Database. 

<img src="static\img\banner.png"/>
![](static/image/banner.png)

*Objective*
* To create, update, read, delete records from a user table
* To connect to MySQL database using mysql2 and stash the secrets in dotenv
* To connect with a esj view and use the view folder
* Use basic bootstrap for front-end

*next repo objective*
* Use the node express-generator to create a template using router context.
* Understand how to better seperate out app.js code using router.
* Learn how to use partials for front end.
* Understand the async await and when to use

#### NOTICE
> change the mysql to mysql2
```npm install mysql2```
```const mysql = require("mysql2")```

### Connecting to MYSQL
> We will be using MySQL, first run this inside your mysql workbench

```
CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone_no VARCHAR(26)
);
```

- After you install mySQL, you will need
    1. user
    2. password

- create a file called  `.env` and paste this in
```
DB_HOST=localhost
DB_USER= < your username, usually it's 'root' >
DB_PASS= < your passsword here without the '<>' >
```

- create a new SCHEMA in your mysql workbench and call it 'crud_express'


> To connect to mysql database, we use this mysql2 package, rememver to run `npm install mysql2`

```
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'crud_express'
});

connection.connect(function(error) {
    error ? console.log(error) : console.log('Database connected!');
});
```

success, if the console.log shows, it means that it is connected, we can now use queries using `connection` const keyword

### View set up

```
//this sets the views to be directed to the views folder, try removing the 's' from views and try it out
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
```

as you can see, express let's us have the freedom to choose which view engine to use. I have chosen ejs as it is pretty simple and great to use.
this view engine let's use the data from our backend!

create a folder called `view` and add your views in there

### CRUD create read update delete

*create*

```
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
```

steps: 

1. app.get('/add')

- This looks for the /add route. Hence within the button in the / route, the create button routes to /add, this triggers the app.get('add')
- the app.get has 2 things
    req -> request which allows us to grab data coming from the route
    res -> the response we will be returing to user

    we will respond with a simple render to the form creation page called 'user_add'

2. Create view called 'user_add.ejs' under the view folder
    ```
    <form action="/save" method="post">
    ```
    notice we created a form with an action "/save" method="post"

    so our backend will be getting this data from the front-end, directed to the "/save" action. 

    So let's create a save action

3. Create `/save'

```
app.post('/save', (req , res) => {
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
```

    now you can see, we have the req coming in from the front-end which we can grab using req.body.''
    we use connection.query() 
    which takes in the sql query line, the data it needs to fill in the ? placeholder and also gives us back the error and result.
    from there we can respond with a redirect back to the original page. 




#### placeholder code

```
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
```