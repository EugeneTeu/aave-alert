import { gql } from 'apollo-server'
import { formatUSDC, formatERC20 } from '../utils'
import { USER_DEPOSIT_QUERY } from './types/USER_DEPOSIT_QUERY'
// userDeposit gql query
const userDepositQuery = (USER_ADDRESS: string) => gql`
  query USER_DEPOSIT_QUERY {
    deposits(where: { user: "${USER_ADDRESS}" }) {
      userReserve {
        currentATokenBalance
      }
      reserve {
        symbol
        variableBorrowRate
      }
    }
  }
`
const userDespositResolver = (data: USER_DEPOSIT_QUERY) => {
  // object returned from gql is json object
  const { deposits } = data
  // key : symbol, value: amount (string)
  const balances = new Map()
  deposits
    .filter(
      ({ userReserve: { currentATokenBalance } }) => currentATokenBalance > 0
    )
    .map(
      (data: {
        userReserve: { currentATokenBalance: any }
        reserve: { symbol: any; variableBorrowRate: any }
      }) => {
        const {
          userReserve: { currentATokenBalance },
          reserve: { symbol, variableBorrowRate },
        } = data
        let formattedBalance = '0'
        if (symbol === 'USDC') {
          formattedBalance = formatUSDC(currentATokenBalance)
        } else {
          formattedBalance = formatERC20(currentATokenBalance)
        }
        balances.set(symbol, formattedBalance)
      }
    )

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

export { userDepositQuery, userDespositResolver }
