import { gql } from 'apollo-server'

import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'
const userReserveQuery = (USER_ADDRESS) => gql`
  {
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
const userReserveResolver = (data) => {
  console.log(data)
   // object returned from gql is json object
   const { userReserves } = data
   // key : symbol, value: amount (string)
   const balances = new Map()
   userReserves.filter( ({scaledATokenBalance}) => scaledATokenBalance > 0 ).map((data) => {
     const {
       scaledATokenBalance,
       reserve: {
         symbol 
       }
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
const formatDataForBot = (balance) => {
  let result = ['You currently have the following deposits in AAVE:\n']
  for (let [key, value] of balance) {
    const string = `${key}: ${value}\n`
    result.push(string)
  }
  return result.join('')
}


export { userReserveQuery, userReserveResolver }
