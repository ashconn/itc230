'use strict'

let games = require("./games.js");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions

const handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: false}));
app.set("view engine", ".html");

// send static file as response
app.get('/', (req, res) => {
    res.render('home', {games: games.getAll()}); 
});

// send plain text response
app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('About page.');
});

// handle get
app.get('/delete', (req, res) => {
    let result = games.delete(req.query.title);
    res.render('delete', {
        title: req.query.title, result: result
    });
});

app.get('/detail', (req, res) => {
    console.log(req.query)
    var found = games.get(req.query.title);
    res.render('detail', {
        title: req.query.title, 
        result: found
    });
});

// handle post
app.post('/detail', (req, res) => {
    console.log(req.body)
    var found = games.get(req.body.title);
    res.render('detail', {
        title: req.body.title, 
        result: found, 
        games: games.getAll()
    });
});

// define 404 handler
app.use( (req,res) => {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started.'); 
});