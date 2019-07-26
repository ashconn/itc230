'use strict'

const games = require("./games");
const Game = require("./models/games");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Express settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions
app.use('/api', require("cors")());
app.use((err, req, res, next) => {
    console.log(err);
});

//Handlebars settings
const handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: false}));
app.set("view engine", ".html");

// send static file as response
app.get('/', (req, res) => {
    games.getAll().then((games) => {
        res.render('home', {games: games});
    }).catch((err) => {
        return next(err);
    });
});

// send plain text response
app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('About page.');
});

// handle get methods

app.get('/delete', (req, res) => {
    Game.remove({title: req.query.title}, (err, result) => {
        if (err) return next(err);
        const deleted = result.result !==0;
    Game.count((err, total) => {
        res.type('text/html');
        res.render('delete', {title: req.query.title, deleted: result.result !==0, total: total });
        });
    });
});

app.get('/detail', (req, res, next) => {
    Game.findOne({title: req.query.title}, (err, games) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('detail', {result: games});
    });
});

// handle post
app.post('/detail', (req, res, next) => {
    Game.findOne({title: req.body.title}, (err, games) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('detail', {result: games});
    });
});

// APIs
app.get('/api/add/:title/:genre/:year', (req, res, next) => {
    const title = req.params.title;
    Game.updateOne({title: title}, {title: title, genre: req.params.genre, year: req.params.year}, {upsert: true}, (err, result) => {
        if (err) return next(err);
        res.json({updated: result.n});
    });
});

app.post('/api/add/', (req, res, next) => {
    if (!req.body._id) {
        const game = new Game({title: req.body.title, genre: req.body.genre, year: req.body.year});
        game.save((err, newGame) => {
            if (err) return next(err);
            console.log(newGame);
            res.json({updated: 0, _id: newGame._id});
        });
    } else {
        Game.updateOne({_id: req.body._id}, {title: req.body.title, genre: req.body.genre, year: req.body.year}, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.n});
        });
    };
});

app.get('api/game', (req, res, next) => {
    Game.find((err, result) => {
        if (err || !result) return next(err);
        res.json(result);
    });
});

app.get('/api/game/:title', (req, res, next) => {
    const title = req.params.title;
    console.log(title);
    Game.findOne({title: title}, (err, result) => {
        if (err || !result) return next(err);
        res.json(result);
    });
});

app.get('/api/delete/:title', (req, res, next) => {
    Game.remove({"title": req.params.title}, (err, result) => {
        if (err) return next(err);
        res.json({"deleted": result.result});
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