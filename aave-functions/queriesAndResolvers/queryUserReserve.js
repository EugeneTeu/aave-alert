import { gql } from 'apollo-server'
import { formatJson } from '../utils/index.js'

const userReserveQuery = (USER_ADDRESS) => gql`
  {
    userReserves(where: { user: "${USER_ADDRESS}" }) {
      
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
  //TODO: match the above json
  const result = formatJson(data)
  console.log(result)
  return result
}

export { userReserveQuery, userReserveResolver }
