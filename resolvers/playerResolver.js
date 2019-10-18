const player = require('../data/mongoDb').Player;
const pickupGameDB = require('../data/mongoDb').PickupGame;
const pickupGame_Player = require('../data/mongoDb').PickupGame_Player;
const {NotFoundError} = require('../errors');
const {UserInputError} = require('apollo-server');
const {ObjectId} = require('mongodb');
const moment = require('moment');
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
        removePlayer: async ( parent,args ) => {
            var {input} = args;
            var rPlayerGame = await pickupGameDB.findById(input.pickupGameId);
            let gameEnd = moment(rPlayerGame.end);
            let timeNow = moment(new Date());
            if(moment(gameEnd.isBefore(timeNow))){
                throw new Error('Player can not be removed from games that have already been passed!');
            }
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
        addPlayerToPickupGame: async ( parent, args ) => {
            var {input} = args;
            //var field = await pickupGame_Player.pickupGame(input.pickupGameId);
            //var field = await pickupGameDB.PickupGame(input.pickupGameId);
            var pickupGame = await pickupGameDB.findById(input.pickupGameId);
            //var pickupPlayer = await pickupGameDB.findById(input.playerId); //check if player is listed
            let gameEnd = moment(pickupGame.end);
            let timeNow = moment(new Date());
            
            
            //console.log(pickupPlayer);

            if(moment(gameEnd).isBefore(timeNow)){
                throw new Error('Adding player to pickupgame failed, this game has already passed!');
            }
            //Players cannot be registered more than once to the same pickup game
            
            console.log(moment(gameEnd).isBefore(timeNow));

            var inputmdl = {
                PickupGame: args.input.pickupGameId,
                player: args.input.playerId
            };
            pickupGame_Player.create(inputmdl);
            return pickupGameDB.findById(args.input.pickupGameId);
        },
        removePlayerFromPickupGame: async ( parent, args) => {
            var {input} = args;
            var rPlayerGame = await pickupGameDB.findById(input.pickupGameId);
            let gameEnd = moment(rPlayerGame.end);
            let timeNow = moment(new Date());
            if(moment(gameEnd.isBefore(timeNow))){
                throw new Error('Player can not be removed from games that have already been passed!');
            }

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
