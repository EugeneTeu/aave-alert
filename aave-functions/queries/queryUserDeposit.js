import { gql } from 'apollo-server'
import { formatJson, formatUSDC, formatERC20 } from '../utils/index.js'

const userDepositQuery = (USER_ADDRESS) => gql`
  {
    deposits(where: { user: "${USER_ADDRESS}" }) {
      userReserve {
        currentATokenBalance
      }
      reserve {
        symbol
      }
    }
  }
`
const userDespositResolver = (data) => {
  // object returned from gql is json object
  const { deposits } = data
  // key : symbol, value: amount (string)
  const balances = new Map()
  deposits
    .filter(
      ({ userReserve: { currentATokenBalance } }) => currentATokenBalance > 0
    )
    .map((data) => {
      const {
        userReserve: { currentATokenBalance },
        reserve: { symbol },
      } = data
      let formattedBalance = '0'

      if (symbol === 'USDC') {
        formattedBalance = formatUSDC(currentATokenBalance)
      } else {
        formattedBalance = formatERC20(currentATokenBalance)
      }
      const obj = {}
      obj[symbol] = formattedBalance
      balances.set(symbol, formattedBalance)
    })

  return formatDataForBot(balances)
}

// takes in a map of { symbol: amount }
const formatDataForBot = (balance) => {
  let result = ['You currently have the following deposits in AAVE:\n']
  for (let [key, value] of balance) {
    const string = `${key}: ${value}\n`
    result.push(string)
  }
  return result.join('')
}

export { userDepositQuery, userDespositResolver }
