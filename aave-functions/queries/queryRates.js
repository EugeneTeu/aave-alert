import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'
import { calculateAverageRate } from '@aave/protocol-js'
//TODO: just follow sdk...

// query rates by symbols
const variableRatesQuery = (symbol) => gql`
  {
    reserves(first: 1, where: { symbol: "${symbol}"  }) {
       symbol
    lastUpdateTimestamp
    liquidityIndex
    variableBorrowIndex
      paramsHistory(first: 1, orderDirection: asc, orderBy: timestamp) {
        timestamp
        liquidityIndex
        variableBorrowIndex
      }
    }
  }
`

const variableRatesResolver = (data) => {
  console.log(data)
  const { reserves } = data
  const { paramsHistory, liquidityIndex, lastUpdateTimestamp } = reserves[0]

  const archivedRate = calculateAverageRate(
    paramsHistory[0].liquidityIndex,
    liquidityIndex,
    paramsHistory[0].timestamp,
    lastUpdateTimestamp
  )
  console.log(archivedRate)
}

export { variableRatesQuery, variableRatesResolver }

// from sdk guide

// /*
// You can fetch the data rquired from graphql.
// This query would provide the mot up to date & the first ever data.
// This data could be used to calculate the average liquidityRate since inception.
// {
//   reserves(first: 1) {
//     lastUpdateTimestamp
//     liquidityIndex
//     variableBorrowIndex
//     paramsHistory(first: 1, orderDirection: asc, orderBy: timestamp){
//       timestamp
//     	liquidityIndex
//     	variableBorrowIndex
//     }
//   }
// }
// */

// // data returned by gql
// const result = {
//   lastUpdateTimestamp: 1611926412,
//   liquidityIndex: "1031830159181667334741382194",
//   variableBorrowIndex: "1048002659480593195934069307",
//   paramsHistory: [
//     {
//       timestamp: 1606903009,
//       liquidityIndex: "1021187617641523092754480830",
//       variableBorrowIndex: "1034162815675781948442542345",
//     },
//   ],
// };
// const archivedRate = calculateAverageRate(
//   result.paramsHistory[0].liquidityIndex,
//   result.liquidityIndex,
//   result.paramsHistory[0].timestamp,
//   result.lastUpdateTimestamp
// );

