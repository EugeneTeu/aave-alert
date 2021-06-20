import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'

const apyAprQuery = (symbol) => gql`
  {
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

  const percentDepositAPR =
    (100 * (aEmissionPerYear * priceInEth * decimals)) /
    (totalATokenSupply * priceInEth * decimals)
  const percentBorrowAPR =
    (100 * (vEmissionPerYear * priceInEth * decimals)) /
    (totalCurrentVariableDebt * priceInEth * decimals)
  console.log(percentBorrowAPR)
  console.log(percentBorrowAPR)
}

export { apyAprQuery, apyAprResolver }
