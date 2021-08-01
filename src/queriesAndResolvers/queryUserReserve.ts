import { gql } from '@apollo/client'

import { formatUSDC, formatERC20 } from '../utils/index.js'
import { USER_RESERVE_QUERY } from './types/USER_RESERVE_QUERY.js'
const userReserveQuery = (USER_ADDRESS: any) => gql`
  query USER_RESERVE_QUERY {
    userReserves(where: { user: "${USER_ADDRESS}" }) {
      scaledATokenBalance
      reserve {
        symbol
      }
      user {
        id
      }
    }
  }
`
const userReserveResolver = (data: USER_RESERVE_QUERY) => {
  console.log(data)
  // object returned from gql is json object
  const { userReserves } = data
  // key : symbol, value: amount (string)
  const balances = new Map()
  userReserves
    .filter(({ scaledATokenBalance }) => scaledATokenBalance > 0)
    .map((data: { scaledATokenBalance: any; reserve: { symbol: any } }) => {
      const {
        scaledATokenBalance,
        reserve: { symbol },
      } = data
      let formattedBalance = '0'
      if (symbol === 'USDC') {
        formattedBalance = formatUSDC(scaledATokenBalance)
      } else {
        formattedBalance = formatERC20(scaledATokenBalance)
      }
      balances.set(symbol, formattedBalance)
    })

  return formatDataForBot(balances)
}

// takes in a map of { symbol: amount }
//TODO: move to bot function folder
// bot function folder will compose graphql calls together
const formatDataForBot = (balance: Map<any, any>) => {
  let result = ['You currently have the following deposits in AAVE:\n']
  for (let [key, value] of balance) {
    const string = `${key}: ${value}\n`
    result.push(string)
  }
  return result.join('')
}

export { userReserveQuery, userReserveResolver }
