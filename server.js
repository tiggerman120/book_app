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

//app.post('/')
function createSearch(req,res) {
  let url='https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+inauthor:${req.body.search[0]}`;
  }
  superagent.get(url)
    .then(data => {
      res.json(data.text);
    })
    .catch(error => {
      console.error(error);
    });
}
app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});
