'use strict'

let games = [
    { title: 'Dragon Age: Inquistion', genre: 'RPG', year: 2014 },
    { title: 'Pokemon: Crystal', genre: 'RPG', year: 2000 },
    { title: 'Animal Crossing', genre: 'Simulation', year: 2001 },
    { title: 'Final Fantasy: VII', genre: 'J-RPG', year: 1997 },
    { title: 'Batman: Arkham City', genre: 'Action-Adventure', year: 2011 }
];

exports.getAll = () => {
    return games;
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