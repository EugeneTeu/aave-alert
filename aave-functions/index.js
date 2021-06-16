import { createRequire } from 'module';
import { ApolloServer, gql, makeExecutableSchema, addSchemaLevelResolveFunction, makeRemoteExecutableSchema, introspectSchema } from "apollo-server"
import { HttpLink } from "apollo-link-http"
import  fetch  from "node-fetch"
import { v1, v2 } from '@aave/protocol-js';
import { loadSchema} from "@graphql-tools/load"
import { UrlLoader } from "@graphql-tools/url-loader"
import { addResolversToSchema } from "@graphql-tools/schema"
import express from 'express';
import { graphqlHTTP }  from 'express-graphql';
import { request, GraphQLClient } from 'graphql-request'

console.log("YOUR_ADDRESS_HERE".toLowerCase())
const aaveMaticSubgraphEndpoint = 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic'

// create a GraphQL client instance to send requests
const client = new GraphQLClient(aaveMaticSubgraphEndpoint, { headers: {} })

const testQuery = gql`
  {
  reserves (where: {
    usageAsCollateralEnabled: true
  }) {
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

const executeQuery = async (client, query) => {
   const response = await client.request(query)
   console.log(response)
}
// we can simply use this client to run quries.
executeQuery(client, testQuery)



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
