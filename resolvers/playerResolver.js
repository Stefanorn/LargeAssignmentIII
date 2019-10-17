const player = require('../data/mongoDb').Player;
const pickupGameDB = require('../data/mongoDb').PickupGame;
const pickupGame_Player = require('../data/mongoDb').PickupGame_Player;
const {NotFoundError} = require('../errors');
const {UserInputError} = require('apollo-server');
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
        removePlayer:( parent,args ) => {
            player.findById(args.id).updateOne(
                {},
                {$set: {"deleted": true}},
                {upsert: false, multi: true},
                (err, raw) => {
                    if(err) { throw err};
                    console.log(raw);
                });
                return true;
        },
        addPlayerToPickupGame: ( parent, args ) => {

            var inputmdl = {
                PickupGame: args.input.pickupGameId,
                player: args.input.playerId
            };
            console.log(inputmdl);
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
            playedGames: async (parent, args) => {
                var connection = await pickupGame_Player.find({ "player": parent.id});
                var pickupGames = pickupGameDB.find({"id": connection.pickupGame});
                return pickupGames;
            },
        }
    }

};
