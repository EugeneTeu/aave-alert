import { gql } from '@apollo/client'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'

import { formatUserSummaryData } from '@aave/protocol-js'

const POOL = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'.toLowerCase()

// GraphQL queries
const poolReservesDataGQL = gql`
  query POOL_RESERVE_DATA {
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
  query RAW_USER_RESERVE {
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
  query USD_PRICE_IN_ETH {
    priceOracle(id: 1) {
      usdPriceEth
    }
  }
`
// userId
const userId = () => '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()

const currentTimeStamp = () => Math.floor(Date.now() / 1000)

const getUserHealthFactor = async (user, executeQuery, aaveMaticClient) => {
  const poolReservesData = await executeQuery(
    aaveMaticClient,
    poolReservesDataGQL,
    (data) => data
  )
  const rawUserReservesData = await executeQuery(
    aaveMaticClient,
    rawUserReservesGQL(user),
    (data) => data
  )
  const usdPriceInETH = await executeQuery(
    aaveMaticClient,
    usdPriceInETHGQL,
    (data) => data
  )
  const { healthFactor } = formatUserSummaryData(
    poolReservesData.reserves,
    rawUserReservesData.userReserves,
    userId(),
    usdPriceInETH,
    currentTimeStamp()
  )
  return formatHealthFactorAnwser(parseFloat(healthFactor).toPrecision(3))
}

const formatHealthFactorAnwser = (healthFactor) => {
  return `Your health factor is ${healthFactor}`
}

export { getUserHealthFactor }
