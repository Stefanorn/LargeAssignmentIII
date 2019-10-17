const basketballField = require('./basketballFieldResolver');
const pickupGame = require('./pickupGameResolver');
const player = require('./playerResolver');

module.exports = {
    ...basketballField.types,
    ...pickupGame.types,
    ...player.types,
    Query: {
        ...basketballField.queries,
        ...pickupGame.queries,
        ...player.queries
    },
    Mutation:{
        ...player.mutations,
        ...pickupGame.mutations
    }
   // Query:{
   //     allPickupGames: () => [],
   //     allPlayers: () => [],
   //     basketballField: () => ({}),
   //     pickupGame:() => ({}),
   //     player:() => ({}) 
   // }
};
