import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'

import { formatUserSummaryData } from '@aave/protocol-js'

import {
  RAW_USER_RESERVE,
  RAW_USER_RESERVE_userReserves,
} from './types/RAW_USER_RESERVE'
import { POOL_RESERVE_DATA } from './types/POOL_RESERVE_DATA'
import {
  ReserveData,
  UserReserveData,
  UserSummaryData,
  ComputedUserReserve,
} from '@aave/protocol-js/dist/v2'
import { formatEther } from 'ethers/lib/utils'
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
      currentATokenBalance
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
// // userId
const userId = () => '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()

const currentTimeStamp = () => Math.floor(Date.now() / 1000)

const getUserHealthFactor = async (
  userId: string,
  executeQuery,
  aaveMaticClient
) => {
  const { reserves }: { reserves: ReserveData[] } = await executeQuery(
    aaveMaticClient,
    poolReservesDataGQL,
    (data) => data
  )
  const { userReserves }: { userReserves: UserReserveData[] } =
    await executeQuery(
      aaveMaticClient,
      rawUserReservesGQL(userId),
      (data) => data
    )

  const {
    priceOracle: { usdPriceEth },
  } = await executeQuery(aaveMaticClient, usdPriceInETHGQL, (data) => data)

  const {
    healthFactor,
    reservesData,
    totalCollateralUSD,
    totalBorrowsETH,
    totalCollateralETH,
    totalBorrowsUSD,
    currentLoanToValue,
  }: UserSummaryData = formatUserSummaryData(
    reserves,
    userReserves,
    userId,
    usdPriceEth,
    currentTimeStamp()
  )

  // console.log(totalCollateralUSD, totalBorrowsUSD)
  // console.log(usdPriceInETH)
  const healthFactorAnswer = formatHealthFactorAnwser(
    parseFloat(healthFactor).toPrecision(3)
  )
  // console.log(healthFactor)
  const userDepositsAndBorrowings = formatUserDepositAndBorrow(reservesData)

  return healthFactorAnswer + '\n' + userDepositsAndBorrowings
}

const formatUserDepositAndBorrow = (reservesData: ComputedUserReserve[]) => {
  // reservesData = reservesData.filter(
  //   ({ underlyingBalance }) => parseInt(underlyingBalance) > 0
  // )
  let deposits: string[][] = []
  let borrows: string[][] = []

  for (const currReserve of reservesData) {
    const {
      reserve: { symbol },
      underlyingBalance, // deposit
      totalBorrows, // borrows
    } = currReserve
    deposits.push([symbol, underlyingBalance])
    borrows.push([symbol, totalBorrows])
  }
  let result = 'Deposits:\n'
  // console.log(deposits)
  for (const deposit of deposits) {
    if (deposit[1] === '0') {
      continue
    }
    result = result + `${deposit[0]}: ${deposit[1]}` + '\n'
  }
  result = result + 'Borrowings:\n'
  for (const borrow of borrows) {
    if (borrow[1] === '0') {
      continue
    }
    result = result + `${borrow[0]}: ${borrow[1]}` + '\n'
  }
  return result
}

const formatHealthFactorAnwser = (healthFactor) => {
  return `Your health factor is ${healthFactor}`
}

export { getUserHealthFactor }
