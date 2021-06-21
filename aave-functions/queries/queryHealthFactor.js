import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'
import {
  calculateHealthFactorFromBalancesBigUnits,
  formatUserSummaryData,
} from '@aave/protocol-js'
import { request, GraphQLClient } from 'graphql-request'
import {
  aaveMaticSubgraphEndpoint,
  aaveV2SubgraphEndpoint,
} from '../constants.js'

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

const POOL = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'.toLowerCase()

const poolReservesDataGQL = gql`
  {
    reserves {
      id
      underlyingAsset
      name
      symbol
      decimals
      isActive
      isFrozen
      usageAsCollateralEnabled
      borrowingEnabled
      stableBorrowRateEnabled
      reserveFactor
      baseLTVasCollateral
      optimalUtilisationRate
      stableRateSlope1
      stableRateSlope2
      averageStableRate
      stableDebtLastUpdateTimestamp
      baseVariableBorrowRate
      variableRateSlope1
      variableRateSlope2
      liquidityIndex
      reserveLiquidationThreshold
      reserveLiquidationBonus
      variableBorrowIndex
      variableBorrowRate

      availableLiquidity
      stableBorrowRate
      liquidityRate

      totalPrincipalStableDebt
      totalScaledVariableDebt
      lastUpdateTimestamp
      price {
        priceInEth
      }
      aEmissionPerSecond
      vEmissionPerSecond
      sEmissionPerSecond
      aIncentivesLastUpdateTimestamp
      vIncentivesLastUpdateTimestamp
      sIncentivesLastUpdateTimestamp
      aTokenIncentivesIndex
      vTokenIncentivesIndex
      sTokenIncentivesIndex
    }
  }
`

const rawUserReservesGQL = (USER) => {
  return gql`
  {
    userReserves(where: { user: "${USER}"}) {
      scaledATokenBalance
      usageAsCollateralEnabledOnUser
      scaledVariableDebt
      variableBorrowIndex
      stableBorrowRate
      principalStableDebt
      stableBorrowLastUpdateTimestamp
      reserve {
        id
        underlyingAsset
        name
        symbol
        decimals
        liquidityRate
        reserveLiquidationBonus
        lastUpdateTimestamp
      }
      aTokenincentivesUserIndex
      vTokenincentivesUserIndex
      sTokenincentivesUserIndex
    }
  }
  `
}

const usdPriceInETHGQL = gql`
  {
    priceOracle(id: 1) {
      usdPriceEth
    }
  }
`

const userId = () => '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()

const currentTimeStamp = () => Math.floor(Date.now() / 1000)

// const result = formatUserSummaryData()

const aaveMaticClient = new GraphQLClient(aaveMaticSubgraphEndpoint, {
  headers: {},
})

const executeQuery = async (client, query, resolve) => {
  try {
    const data = await client.request(query)
    return resolve(data)
  } catch (e) {
    console.log(e)
    return 'exception occured'
  }
}

const fetchDataFromSubGraph = async () => {
  const poolReservesData = await executeQuery(
    aaveMaticClient,
    poolReservesDataGQL,
    (data) => data
  )
  const rawUserReservesData = await executeQuery(
    aaveMaticClient,
    rawUserReservesGQL(userId()),
    (data) => data
  )
  const usdPriceInETH = await executeQuery(
    aaveMaticClient,
    usdPriceInETHGQL,
    (data) => data
  )

  return { poolReservesData, rawUserReservesData, usdPriceInETH }
}
const { poolReservesData, rawUserReservesData, usdPriceInETH } =
  await fetchDataFromSubGraph()

const result = formatUserSummaryData(
  poolReservesData.reserves,
  rawUserReservesData.userReserves,
  userId(),
  usdPriceInETH,
  currentTimeStamp()
)

console.log(result)
