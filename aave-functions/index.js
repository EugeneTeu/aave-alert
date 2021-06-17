import { createRequire } from 'module'
import {
  ApolloServer,
  gql,
  makeExecutableSchema,
  addSchemaLevelResolveFunction,
  makeRemoteExecutableSchema,
  introspectSchema,
} from 'apollo-server'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { loadSchema } from '@graphql-tools/load'
import { UrlLoader } from '@graphql-tools/url-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import express, { json } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { request, GraphQLClient } from 'graphql-request'

import {
  aaveMaticSubgraphEndpoint,
  aaveV2SubgraphEndpoint,
} from './constants.js'

// create a GraphQL client instance to send requests
const aaveMaticClient = new GraphQLClient(aaveMaticSubgraphEndpoint, {
  headers: {},
})
const aaveV2Client = new GraphQLClient(aaveV2SubgraphEndpoint, {
  headers: {},
})

const formatJson = (jsonString) => JSON.stringify(jsonString, null, 2)

const executeQuery = async (client, query) => {
  try {
    const data = await client.request(query)
    // console.log(formatJson(data))
    return formatJson(data)
  } catch (e) {
    console.log(e)
    return 'exception'
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

const queryUserDeposit = (USER_ADDRESS) => gql`
  {
    deposits(where: { user: "${USER_ADDRESS}" }) {
      userReserve {
        currentATokenBalance
      }
      reserve {
        symbol
      }
    }
  }
`

// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
export const getUserDeposit = () =>
  executeQuery(
    aaveMaticClient,
    queryUserDeposit('0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase())
  )

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
