'use strict';

//3rd party dependancies
const express = require('express');
const env = require('dotenv');
const app = express();
const pg = require('pg');
const methodOverride = require('method-override');

env.config();

//front end config
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method')); //method override is the hack for put/delete on the browser

const superagent = require('superagent');

//server constants
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL)


app.get('/', putOnIndex)

app.get('/hello', (req, res) => {
  res.render('pages/index');
});
// app.get('/searches', (req, res) => {
//   res.render('pages/searches/show', {
//     booksArray: booksArray
//   });
// });
app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});
app.get('/searches/index', (req, res) => {
  res.render('pages/index');
});

app.post('/searches/new', createSearch);

app.get('*', (req, res) => {
  res.render('pages/error', { error: new Error('Page not found') });
});

//database config
client.connect();
client.on('error', err => console.log(err));



function createSearch(req, res) {


  let url = 'https://www.googleapis.com/books/v1/volumes?maxResults=10&projection=full&q=';
  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+inauthor:${req.body.search[0]}`;
  }
  superagent.get(url)
    .then(data => {
      var booksToRender = data.body.items
      var instance = booksToRender.map((item) => (new Book(item)));
      // res.render('pages/index', { booksArray: instance });
      res.render('pages/searches/show', { booksArray: instance });
    })
    .catch(err => {
      console.error(err);
      res.render('pages/error', { error: err });
    });
}
function putOnIndex(req, res) {
  let insert = 'SELECT * FROM books';
  return client.query(insert)
    .then(data => {
      // console.log(data);
      // var instance = data.body.item.map((item) => booksArray.push(new Book(item)));
      res.render('pages/index', { booksArray: data.rows });
    })
}

function Book(bookData) {
  if (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) {

    if (!bookData.volumeInfo.imageLinks.thumbnail.startsWith('https')) {
      this.img = bookData.volumeInfo.imageLinks.thumbnail.replace('http', 'https');
    }
    else {
      this.img = bookData.volumeInfo.imageLinks.thumbnail;
    }
  }
  else {
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;
  }
  this.title = bookData.volumeInfo.title ? bookData.volumeInfo.title : `Book Title (Unknown)`;
  this.author = bookData.volumeInfo.authors ? bookData.volumeInfo.authors : `Book Authors Unknown`;
  this.description = bookData.volumeInfo.description ? bookData.volumeInfo.description : `Book description unavailable`;
}

// function databaseStorage(req, res) {
//   let sql = 'INSERT * INTO books (title, author, description, image_url) VALUES ($1, $2, $3, $4)'
//   //controller / destructuring
//   let sqlArr = [bookData.title, bookData.author, bookData.description, bookData.thumbnail];

  //controller


//   return client.query(sql, sqlArr)//this asks the sql client for the information
//     //request asks postgres
//     .then(res.redirect('/'))
//     .catch(err => console.error(err))
// }




app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});
