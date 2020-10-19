'use strict';

const express = require('express');

const env = require('dotenv');

const app = express();

env.config();

app.set('view engine' , 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

app.get('/hello' , (req, res) => {
  res.render('pages/index');
});

app.get('/' , (req, res) => {
  res.render('pages/searches/new');
});

app.get('/searches' , (req, res) => {
    res.render('pages/searches/show', {
        booksArray: booksArray
    });
});

app.post('/searches' , createSearch);

var booksArray = [];

function createSearch(req,res) {
  let url='https://www.googleapis.com/books/v1/volumes?maxResults=10&projection=full&q=';
  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+inauthor:${req.body.search[0]}`;
  }
  superagent.get(url)
  .then(data => {
        console.log(data.body.items)
        data.body.items.forEach(item => {
            booksArray.push(new Book(item))
        })
        console.log(booksArray)
      res.render('pages/searches/show' ,  {booksArray:booksArray});
    })
    .catch(error => {
      console.error(error);
    });
}
app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});

function Book(bookData) {
this.img = bookData.volumeInfo.imageLinks.thumbnail;
this.title = bookData.volumeInfo.title;
this.author = bookData.volumeInfo.authors;
this.description = bookData.volumeInfo.description;
}

