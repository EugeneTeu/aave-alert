import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js'
// query rates by symbols
const healthFactorQuery = (symbol) => gql`
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

const healthFactorResolver = (data) => {
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

export { healthFactorQuery, healthFactorResolver }

// export function calculateHealthFactorFromBalancesBigUnits(
//   collateralBalanceETH: BigNumberValue,
//   borrowBalanceETH: BigNumberValue,
//   currentLiquidationThreshold: BigNumberValue
// ): BigNumber {
//   return calculateHealthFactorFromBalances(
//     collateralBalanceETH,
//     borrowBalanceETH,
//     new BigNumber(currentLiquidationThreshold)
//       .multipliedBy(10 ** LTV_PRECISION)
//       .decimalPlaces(0, BigNumber.ROUND_DOWN)
//   )
// }
