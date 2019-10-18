const pickUpDb = require('../data/mongoDb').PickupGame;
const basketBallFieldDb = require('../services/basketballFieldService');
const player = require('../data/mongoDb').Player;
const pickupGame_Player = require('../data/mongoDb').PickupGame_Player;
var {ObjectId} = require('mongodb');
const {NotFoundError} = require('../errors');


module.exports = {
    queries: {
        allPickupGames: () => pickUpDb.find({}),
        pickupGame: (parent, args) => pickUpDb.findById(args.id)
    },
    mutations:{
        createPickupGame: async (parent, args) => {
            var {input} = args;
            var field = await basketBallFieldDb.basketBallField(input.basketballFieldId);
            //console.log(field);
            //console.log
            if(field.status === "CLOSED"){ // checks if field status is closed, and throws a error message if it is
                throw new Error('createPickupGame failed, basketballField is closed!');
            }
            var inputMdl = { 
                host: args.input.hostId,
                location: args.input.basketballFieldId,
                ...args.input };
            return pickUpDb.create(inputMdl);
        },
        removePickupGame:(parent,args) =>{
            var r = pickUpDb.findById(args.id).updateOne(
                {},
                { $set: { "deleted": true}},
                {upsert: false, multi: true})
                .exec()
                .then((raw, err) => {
                    console.log(raw);
                      if (err){ return false} 
                      if(raw.nModified != 0){return true} 
                      return false; });
            if(r == true){
                return true;
            }
            else{
                throw new NotFoundError();
            }
        }
    },
    types: {
        PickupGame:{
           location:  parent => { 
              // console.log(basketBallFieldDb.basketballField(parent.location));

              return basketBallFieldDb.basketBallField(parent.location)
             },
            registeredPlayers:  (parent) => {

                var foundPlayers = pickupGame_Player.find({ "pickupGame": parent._id})
                .exec()
                .then( async (value) =>{
                    if(value.length){
                        var ret = [];
                        for(var i =0; i < value.length; i++){
                            ret.push( await player.findOne({"_id": ObjectId(value[i].player)}).exec());
                        }
                        return ret;
                   }
                   else return [];
                });

                return foundPlayers;
            },
            host: parent => { return player.findById(parent.host)},
            
        }
    }
}

