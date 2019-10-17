module.exports = `
    type Query{
        allBasketBallFields: [BasketBallField]!
        allPickupGames: [PickupGame]!
        allPlayers: [Player]!
        basketballField(id:ID): BasketBallField!
        pickupGame(id:ID): PickupGame!
        player(id:ID): Player! 
    }
`;