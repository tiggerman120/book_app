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
res.render('pages/index');
});


app.listen(PORT, () => {
    console.log('server is up at ' + PORT);
});
