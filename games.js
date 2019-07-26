'use strict'

const Game = require("./models/games");

exports.getAll = () => {
    console.log('getall');
    return Game.find({}, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            return result;
        };
    });
};

exports.get = (title) => {
    return games.find((item) => {
        return item.title.toLowerCase() === title.toLowerCase();
    });
};

exports.delete = (title) => {
    const oLength = games.length;
    games = games.filter((item) => {
        return item.title !== title;
    });
    return { deleted: oLength !== games.length, total: games.length };
};

exports.add = (newGame) => {
    const oLength = games.length;
    const found = this.get(newGame.title);
    if (!found) {
        games.push(newGame);
    }
    return {added: oLength !== games.length, total: games.length };
};