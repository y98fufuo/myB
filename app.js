const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Fu20030928',
  database: 'myshelf'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM books',
    (error, results) => {
      console.log(results);
      res.render('index.ejs',{books: results});
    }
  );
});

//独自のコード

app.get('/bookEdit', (req, res) => {
  connection.query(
    'SELECT * FROM books',
    (error, results) => {
      console.log(results);
      res.render('bookEdit.ejs',{books: results});
    }
  );
});

//ここまで

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create',(req,res) => {
  connection.query(
    'INSERT INTO books(title,author) VALUES(?,?)',
    [req.body.bookTitle,req.body.bookAuthor],
    (error,results) => {
      res.redirect("/bookEdit");
    }
  );
});

app.post("/delete/:id",(req,res) => {
  connection.query("DELETE FROM books WHERE id=?",
  [req.params.id],
  (error,results) => {
    res.redirect('/bookEdit');
  })

});

//並べ替え
app.post("/titleOrder",(req,res) => {
  connection.query("SELECT * FROM books ORDER BY title ASC",
  (error,results) => {
    console.log(results);
    res.render('index.ejs',{books: results})
  })
});

app.post("/addOrder",(req,res) => {
  connection.query("SELECT * FROM books ORDER BY id ASC",
  (error,results) => {
    console.log(results);
    res.render('index.ejs',{books: results})
  })
});

app.post("/authorOrder",(req,res) => {
  connection.query("SELECT * FROM books ORDER BY author ASC",
  (error,results) => {
    console.log(results);
    res.render('index.ejs',{books: results})
  })
});

//並べ替えここまで

app.get("/edit/:id",(req,res) => {
  connection.query("SELECT * FROM books WHERE id=?",
  [req.params.id],
  (error,results) => {
    res.render("edit.ejs",{book: results[0]});
  })
});

app.post("/update/:id",(req,res) => {
  connection.query("UPDATE books SET title=?, author=? WHERE id=?",
    [req.body.bookTitle,req.body.bookAuthor,req.params.id],
    (error,results) => {
      res.redirect('/bookEdit');
    }
  )

});


app.listen(3000);