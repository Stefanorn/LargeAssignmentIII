const { gql } = require('apollo-server');

const Types = require('./types/index');
const Enum = require('./enums/index');
const Query = require('./queries/index');
const Scalar = require('./scalar/index');
const Input = require('./input/index');
const Mutation = require('./mutations/index');


module.exports = gql`
    ${Scalar}
    ${Types}
    ${Enum}
    ${Query}
    ${Input}
    ${Mutation}
`;