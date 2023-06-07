import express from "express";
import { engine } from 'express-handlebars';
import mysql from 'mysql';

const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.engine("handlebars", engine())
app.set("view engine", "handlebars")

app.use(express.static('public'))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
})

connection.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');

  app.listen(3000, () => console.log("SERVER UP!"))
});



app.get("/", (req, res) => {
    res.render("home")
})

// CREATE
app.post("/books/insertbook", (req, res) => {
  const title = req.body.title
  const pageqty = req.body.pageqty

  //string de criação da query na sintaxe de SQL
  const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}','${pageqty}')`

  //efetivamente cria a query
  connection.query(sql, (err) => {
    if (err) throw err;

    res.redirect("/books")
  })
})

// READ
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books"

  connection.query(sql, (err, data) => {
    if (err) throw err;

    const books = data
    
    res.render('books', { books })
  })
})

// READ USING 'WHERE'
app.get("/books/:id", (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE id = ${id}`

  connection.query(sql, (err, data) => {
    if (err) throw err;

    const book = data[0]

    res.render('book', { book })
  })
})

// EDITING (BEGGINING)
app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE id = ${id}`

  connection.query(sql, (err, data) => {
    if (err) throw err;

    const book = data[0]

    res.render('editbook', { book })
  })
})

// UPDATE 
app.post('/books/updatebook', (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

  connection.query(sql, (err) => {
    if (err) throw err;

    res.redirect('/books')
  })
})

// DELETE
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id
  
    const sql = `DELETE FROM books WHERE id = ${id}`
  
    connection.query(sql, (err) => {
      if (err) throw err;
  
      res.redirect('/books')
    })
})