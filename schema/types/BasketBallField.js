module.exports = `
type BasketBallField{
    id: ID!
    name: String!
    capacity: Int!
    yearOfCreation: Moment!
    pickupGames: [PickupGame!]!
    status: BasketballFieldStatus!
}
`; 