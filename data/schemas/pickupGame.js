const Schema = require('mongoose').Schema;

module.exports = new Schema({

    start: {type: Date, required: true},
    end: {type: Date, required: true},
    location: { type: String, required: true },
    registeredPlayers: [{ type: Schema.Types.ObjectId, required: true }],
    host: { type: Schema.Types.ObjectId, required: true },
    deleted: Boolean
});