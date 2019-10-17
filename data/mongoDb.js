const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const playerSchema = require('./schemas/player');
const pickupGameSchema = require('./schemas/pickupGame');

const connection = mongoose.createConnection(
    "mongodb+srv://dbuser:leyni@cluster0-vn6pr.mongodb.net/HoopDream",
    { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    Player: connection.model('Player', playerSchema),
    PickupGame: connection.model('PickupGame', pickupGameSchema),
    PickupGame_Player: connection.model('PickupGame_Player',
     new Schema({
        PickupGame: { type: Schema.Types.ObjectId, required: true },
        player: { type: Schema.Types.ObjectId, required: true }
    },))
};
