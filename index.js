'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Game = require("./models/games");

// Express configs
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(require('body-parser').urlencoded({extended: true})); // parse form submissions
app.use(bodyParser.json());
app.use('/api', require("cors")());
app.use((err, req, res, next) => {
    console.log(err);
});

// Handlebars configs
const handlebars = require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: false}));
app.set("view engine", ".html");

// Routes
// Home page static file
app.get('/', (req, res, next) => {
    Game.find((err, games) => {
        if (err) return next(err);
        res.render('home', { games: JSON.stringify(games) });
    });
});

// About page
app.get('/about', (req, res) => {
    res.type('text/html');
    res.render('About page.');
});

// APIs

// Grab single game API
app.get('/api/game/:title', (req, res, next) => {
    const title = req.params.title;
    console.log(title);
    Game.findOne({ title: title }, (err, game) => {
        if (err || !game) return next(err);
        res.json(game);
    });
});

// Get all games API
app.get('/api/games/', (req, res, next) => {
    Game.find((err, allGames) => {
        if (err || !allGames) return next(err);
        res.json(allGames);
    });
});

// Delete game API
app.get('/api/delete/:id', (req, res, next) => {
    Game.deleteOne({ "_id": req.params.id }, (err, result) => {
        if (err) return next(err);
        res.json({ "deleted": "result" });
    });
});

// Find & update existing or add new game API
app.post('/api/add/', (req, res, next) => {
    if (!req.body._id) {
        const newGame = new Game({ "title": req.body.title, "genre": req.body.genre, "year": req.body.year });
        newGame.save((err, savedNewGame) => {
            if (err) return next(err);
            console.log('New Game: ' + savedNewGame);
            res.json({ updated: 0, _id: savedNewGame._id });
        });
    } else {
        Game.updateOne({ _id: req.body._id }, { "title": req.body.title, "genre": req.body.genre, "year": req.body.year }, (err, result) => {
            if (err) return next(err);
            res.json({ updated: result.nModified, _id: req.body._id });
        });
    };
});

//End APIs

// Define 404 handler
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

// End routes

// Launch server
app.listen(app.get('port'), () => {
    console.log('Express started.');
});