import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'
// WMATIC reserve because reward is in WMATIC
const apyAprQuery = (symbol) => gql`
  {  

    reserve(id: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf12700xd05e3e715d945b59290df0ae8ef85c1bdb684744") {
    symbol
    price {
      priceInEth
    }
    decimals,
    }

    reserves(where: {  symbol: "${symbol}" }) {
    symbol
    underlyingAsset
    price {
      priceInEth
    }
    decimals
    liquidityRate 
    stableBorrowRate
    variableBorrowRate
    
    aEmissionPerSecond
    vEmissionPerSecond
    sEmissionPerSecond
    
    totalATokenSupply
    totalCurrentVariableDebt
  }
}
`
const SECONDS_PER_YEAR = 365 * 86400

const apyAprResolver = (data) => {
  const { reserves } = data
  const {
    symbol,
    underlyingAsset,
    price: { priceInEth },
    decimals,
    liquidityRate,
    stableBorrowRate,
    variableBorrowRate,
    aEmissionPerSecond,
    vEmissionPerSecond,
    sEmissionPerSecond,
    totalATokenSupply,
    totalCurrentVariableDebt,
  } = reserves[0]

  // deposit and borrow apy
  const percentDepositAPY = (100 * liquidityRate) / Math.pow(10, 27)
  const percentVariableBorrowAPY = (100 * variableBorrowRate) / Math.pow(10, 27)
  const percentStableBorrowAPY = (100 * variableBorrowRate) / Math.pow(10, 27)
  // AAVE incentives calculation
  const aEmissionPerYear = aEmissionPerSecond * SECONDS_PER_YEAR
  const vEmissionPerYear = vEmissionPerSecond * SECONDS_PER_YEAR

  const { reserve } = data
  // reward price is WMATIC
  const percentDepositAPR =
    100 *
    ((aEmissionPerYear * reserve.price.priceInEth * decimals) /
      (totalATokenSupply * priceInEth * reserve.decimals))
  const percentBorrowRewardAPR =
    100 *
    ((vEmissionPerYear * reserve.price.priceInEth * decimals) /
      (totalCurrentVariableDebt * priceInEth * reserve.decimals))

  return formatresult({
    symbol,
    percentStableBorrowAPY,
    percentVariableBorrowAPY,
    percentBorrowRewardAPR,
    percentDepositAPR,
    percentDepositAPY,
  })
}

const formatresult = ({
  symbol,
  percentStableBorrowAPY,
  percentVariableBorrowAPY,
  percentBorrowRewardAPR,
  percentDepositAPR,
  percentDepositAPY,
}) => {
  const result = [`The current rates for ${symbol} are:`]
  result.push(`Stable Borrow APY: ${percentStableBorrowAPY.toPrecision(3)}%`)
  result.push(
    `Variable Borrow APY: ${percentVariableBorrowAPY.toPrecision(3)}%`
  )
  result.push(`Borrow APR (Reward): ${percentBorrowRewardAPR.toPrecision(3)}%`)
  result.push(
    `You are charged ${(
      percentVariableBorrowAPY - percentBorrowRewardAPR
    ).toPrecision(3)}% for borrowing`
  )

  result.push(`Deposit APY: ${percentDepositAPY.toPrecision(3)}%`)
  result.push(`Desposit APR: ${percentDepositAPR.toPrecision(3)}%`)
  console.log(result.join('\n'))
  return result.join('\n')
}

export { apyAprQuery, apyAprResolver }

//TODO: calculate USDC APY APR
// USDC IS SPECIAL cause 6 decimals

// // deposit and borrow calculation
// ​
// percentDepositAPY = 100 * liquidityRate/RAY
// percentVariableBorrowAPY = 100 * variableBorrowRate/RAY
// percentStableBorrowAPY = 100 * variableBorrowRate/RAY
// ​
// // AAVE incentives calculation
// ​
// aEmissionPerYear = aEmissionPerSecond * SECONDS_PER_YEAR
// vEmissionPerYear = vEmissionPerSecond * SECONDS_PER_YEAR
// ​
// percentDepositAPR = 100 * (aEmissionPerYear * REWARD_PRICE_ETH * TOKEN_DECIMALS)/
//                           (totalATokenSupply * TOKEN_PRICE_ETH * REWARD_DECIMALS)

// percentBorrowAPR = 100 * (vEmissionPerYear * REWARD_PRICE_ETH * TOKEN_DECIMALS)/
//                           (totalCurrentVariableDebt * TOKEN_PRICE_ETH * REWARD_DECIMALS)
// ​
