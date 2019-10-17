module.exports = `
type PickupGame{
    id: ID!
    start: Moment!
    end: Moment!
    location: BasketBallField!
    registeredPlayers: [Player!]!
    host: Player
}
`; 