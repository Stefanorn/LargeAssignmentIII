const pickUpDb = require('../data/mongoDb').PickupGame;
const basketBallFieldDb = require('../services/basketballFieldService');
const player = require('../data/mongoDb').Player;
const pickupGame_Player = require('../data/mongoDb').PickupGame_Player;
var {ObjectId} = require('mongodb');


module.exports = {
    queries: {
        allPickupGames: () => pickUpDb.find({}),
        pickupGame: (parent, args) => pickUpDb.findById(args.id)
    },
    mutations:{
        createPickupGame: (parent, args) => {
            var inputMdl = { 
                host: args.input.hostId,
                location: args.input.basketballFieldId,
                ...args.input };
            return pickUpDb.create(inputMdl);
        },
        removePickupGame:(parent,args) =>{
            pickUpDb.findById(args.id).updateOne(
                {},
                { $set: { "deleted": true}},
                {upsert: false, multi: true},
                (err,raw) =>{
                if(err){
                    throw err;
                }
            });
            return true;
        }
    },
    types: {
        PickupGame:{
           location: parent => { 
              return basketBallFieldDb.basketBallField(parent.location)
             },
            registeredPlayers:async (parent) => {
                var foundPlayers = pickupGame_Player.find({ "PickupGame": ObjectId(parent._id)})
                .exec()
                .then(async (d) => {
                    var p = player.find({_id: d.player}).exec();
                    console.log(await p);
                });

                console.log(await foundPlayers);
                var p = player.find({"_id": ObjectId(foundPlayers.player)});
                return p;
            },
            host: parent => { return player.findById(parent.host)},
            
        }
    }
};