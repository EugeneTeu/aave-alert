import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { gql } from 'apollo-server'
import express, { json } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { request, GraphQLClient } from 'graphql-request'

import {
  aaveMaticSubgraphEndpoint,
  aaveV2SubgraphEndpoint,
} from './constants.js'

import { userDepositQuery, userDespositResolver } from './queries/index.js'
import { formatJson } from './utils/index.js'
import {
  variableRatesQuery,
  variableRatesResolver,
} from './queries/queryRates.js'
// create a GraphQL client instance to send requests
const aaveMaticClient = new GraphQLClient(aaveMaticSubgraphEndpoint, {
  headers: {},
})
const aaveV2Client = new GraphQLClient(aaveV2SubgraphEndpoint, {
  headers: {},
})

// takes in a client, a http query, a resolver to resolve graphql data from endpoint
const executeQuery = async (client, query, resolve) => {
  try {
    const data = await client.request(query)
    return resolve(data)
  } catch (e) {
    console.log(e)
    return 'exception occured'
  }
}

const testQuery = gql`
  {
    reserves(where: { usageAsCollateralEnabled: true }) {
      id
      name
      price {
        id
      }
      liquidityRate
      variableBorrowRate
      stableBorrowRate
    }
  }
`

const queryUserReserve = (USER_ADDRESS) => gql`
  {
    userReserves(where: { user: "${USER_ADDRESS}" }) {
      
      reserve {
        
        symbol
      }
      user {
        id
      }
    }
  }
`
const generalResolver = (data) => {
  const result = formatJson(data)
  console.log(result)
  return result
}

// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
export const getUserDeposit = () =>
  executeQuery(
    aaveMaticClient,
    userDepositQuery(
      '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
    ),
    userDespositResolver
  )

export const getVariableRate = () =>
  executeQuery(
    aaveMaticClient,
    variableRatesQuery('USDC'),
    variableRatesResolver
  )
// getUserDeposit()
getVariableRate()

// executeQuery(aaveV2Client, testQuery)
// -----------------------------------------------------------------------------
// Graph ql express server
// -----------------------------------------------------------------------------

// const schema1 = await loadSchema('https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic', {   // load from endpoint
//     loaders: [
//         new UrlLoader()
//     ]
// });

// // Write some resolvers
// const resolvers = {};

// // Add resolvers to the schema
// const schemaWithResolvers = addResolversToSchema({
//     schema,
//     resolvers,
// });

// // const app = express();

// // app.use(
// //     graphqlHTTP({
// //         schema: schemaWithResolvers,
// //         graphiql: true,
// //     })
// // );

// // app.listen(4000, () => {
// //     console.info(`Server listening on http://localhost:4000`)
// // })
