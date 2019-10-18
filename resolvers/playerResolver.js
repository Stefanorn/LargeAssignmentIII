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
            
            player.findById(args.id).updateOne(
                {},
                { $set: {"name": args.input.name}}, 
                (err,raw) => {
                    if(err){ console.log(" whant to throw new NotFoundError(); ");
 }
                    if(raw.nModified === 0){
                        console.log(" whant to throw new NotFoundError(); ");
                    }
                });
            return player.findById(args.id);
        
        },
        removePlayer:  ( parent,args ) => {
            var r = player.findById(args.id).updateOne(
                {},
                {$set: {"deleted": true}},
                {upsert: false, multi: true}).exec();
            
            console.log(r);
            if( r.nModified === 0){
                throw new NotFoundError();
            }
            else{
                return true;
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
