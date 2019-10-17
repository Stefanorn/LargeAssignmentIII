const basketBallFieldDb = require('../services/basketballFieldService');
const pickupGame = require('../data/mongoDb').PickupGame;

module.exports = {
    queries: {
        allBasketBallFields: () => basketBallFieldDb.allBasketBallFields(),
        basketballField: (arent,args) => basketBallFieldDb.basketBallField(args.id)
    },
    types: {
        BasketBallField:{
            pickupGames: parent => {
                var items = pickupGame.find({'location': parent.id});
                return items;
            }
        }
    }
}
