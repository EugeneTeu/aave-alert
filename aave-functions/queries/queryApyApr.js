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
  console.log([
    percentVariableBorrowAPY,
    percentDepositAPY,
    percentStableBorrowAPY,
  ])
  // AAVE incentives calculation
  const aEmissionPerYear = aEmissionPerSecond * SECONDS_PER_YEAR
  const vEmissionPerYear = vEmissionPerSecond * SECONDS_PER_YEAR
  const { reserve } = data
  // reward price is WMATIC

  const percentDepositAPR =
    100 *
    ((aEmissionPerYear * reserve.price.priceInEth * decimals) /
      (totalATokenSupply * priceInEth * reserve.decimals))
  const percentBorrowAPR =
    100 *
    ((vEmissionPerYear * reserve.price.priceInEth * decimals) /
      (totalCurrentVariableDebt * priceInEth * reserve.decimals))
  console.log(percentBorrowAPR.toPrecision(3))
  console.log(percentBorrowAPR.toPrecision(3))
}
// USDC IS SPECIAL cause 6 decimals
export { apyAprQuery, apyAprResolver }

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
