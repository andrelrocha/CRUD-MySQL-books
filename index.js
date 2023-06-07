import express from "express";
import { engine } from 'express-handlebars';
import pool from "./db/connection.js";

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

app.listen(3000, () => console.log("SERVER UP!"))




app.get("/", (req, res) => {
    res.render("home")
})

// CREATE
app.post("/books/insertbook", (req, res) => {
  const title = req.body.title
  const pageqty = req.body.pageqty

  //string de criação da query na sintaxe de SQL [atenção a nao mandar direto na query os dados]
  const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
  const data = ['title', 'pageqty', title, pageqty]

  //efetivamente cria a query
  pool.query(sql, data, (err) => {
    if (err) throw err;

    res.redirect("/books")
  })
})

// READ
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books"

  pool.query(sql, (err, data) => {
    if (err) throw err;

    const books = data
    
    res.render('books', { books })
  })
})

// READ USING 'WHERE'
app.get("/books/:id", (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(sql, data, (err, data) => {
    if (err) throw err;

    const book = data[0]

    res.render('book', { book })
  })
})

// EDITING (BEGGINING)
app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(sql, data, (err, data) => {
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

  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
  const data = ['title', title, 'pageqty', pageqty, 'id', id]

  pool.query(sql, data, (err) => {
    if (err) throw err;

    res.redirect('/books')
  })
})

// DELETE
app.post('/books/remove/:id', (req, res) => {
  const id = req.params.id

  const sql = `DELETE FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(sql, data, (err) => {
    if (err) throw err;

    res.redirect('/books')
  })
})