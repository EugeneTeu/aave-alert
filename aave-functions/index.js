import { ApolloServer, gql } from "apollo-server"

import { v1, v2 } from '@aave/protocol-js';

import { loadSchema} from "@graphql-tools/load"
import { UrlLoader } from "@graphql-tools/url-loader"
import { addResolversToSchema } from "@graphql-tools/schema"
import express from 'express';
import { graphqlHTTP }  from 'express-graphql';



// matic subgraph
const schema = await loadSchema('https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic', {   // load from endpoint
    loaders: [
        new UrlLoader()
    ]
});

// Write some resolvers
const resolvers = {};

// Add resolvers to the schema
const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers,
});

const app = express();

app.use(
    graphqlHTTP({
        schema: schemaWithResolvers,
        graphiql: true,
    })
);

app.listen(4000, () => {
    console.info(`Server listening on http://localhost:4000`)
})





// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const typeDefs = gql`


//   type UserReserveData {
//     reserve {
//       symbol
//     }
//     currentTotalDebt
//     currentVariableDebt
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     getUserReserve : UserReserveData
//   }
  
  


// `;

// // Resolvers define the technique for fetching the types defined in the
// // schema. This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     getUserReserve : () => 
//   },
// };

// const schemaWithResolvers = addResolversToSchema({
//     schema,
//     resolvers,
// });


// // The ApolloServer constructor requires two parameters: your schema
// // definition and your set of resolvers.
// const server = new ApolloServer({ typeDefs, schemaWithResolvers });

// // The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });