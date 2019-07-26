const mongoose = require('mongoose');
const credentials = require('../credentials.js');

mongoose.connect(credentials.connectionString, { dbName: "ITC230", useNewUrlParser: true }); 

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

const gameSchema = mongoose.Schema({
    title: String,
    genre: String,
    year: Number,
},
    {collection: 'Games'});

module.exports = mongoose.model('Game', gameSchema);