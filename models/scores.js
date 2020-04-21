const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    username: String,
    moves: Number,
    minutes: Number,
    seconds: Number
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = { Score };