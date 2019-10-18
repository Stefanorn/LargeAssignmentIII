const player = require('../data/mongoDb').Player;
const pickupGameDB = require('../data/mongoDb').PickupGame;
const pickupGame_Player = require('../data/mongoDb').PickupGame_Player;
const {NotFoundError} = require('../errors');
const {UserInputError} = require('apollo-server');
const {ObjectId} = require('mongodb');
module.exports = {
    queries: {
        allPlayers: () => player.find({}),
        player: (parent, args) => player.findById(args.id)
    },
    mutations:{
        createPlayer:(parent,args) => {
            var inputmdl = {
                ...args.input
            };
            return player.create(inputmdl);
        },
        updatePlayer: ( parent, args ) => {
            
            var r = player.findById(args.id).updateOne(
                {},
                { $set: {"name": args.input.name}})
                 .exec();

                return player.findById(args.id);

        },
        removePlayer:  ( parent,args ) => {
            var r = player.findById(args.id).updateOne(
                {},
                {$set: {"deleted": true}},
                {upsert: false, multi: true})
                .exec()
                .then((raw, err) => {
                    console.log(err);
                      if (err){ return false} 
                      if(raw.nModified){return true} 
                      return false; });
            if(r == true){
                return true;
            }
            else{
                throw new NotFoundError();
            }
        },
        addPlayerToPickupGame: ( parent, args ) => {

            var inputmdl = {
                PickupGame: args.input.pickupGameId,
                player: args.input.playerId
            };
            pickupGame_Player.create(inputmdl);
            return pickupGameDB.findById(args.input.pickupGameId);
        },
        removePlayerFromPickupGame:( parent, args) => {
            pickupGame_Player.deleteOne({
                'player': args.input.playerId,
                'PickupGame': args.input.pickupGameId
            });
            return true;
        }
    },
    types:{
        Player:{
            playedGames: (parent) => {
                
                var foundPlayers = pickupGame_Player.find({ "player": parent._id})
                .exec()
                .then( async (value) =>{
                    if(value.length){
                        var ret = [];
                        
                        value = JSON.stringify(value);
                        value = JSON.parse(value);

                        for(var i =0; i < value.length; i++){
                            ret.push( await pickupGameDB.findOne({"_id": ObjectId(value[i].pickupGame)}).exec());
                        }
                        console.log(ret);
                        return ret;
                   }
                   else return [];
                });

                return foundPlayers;
            },
        }
    }

};
