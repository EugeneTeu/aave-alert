import { gql } from 'apollo-server'
import { GraphQLClient } from 'graphql-request'

import { aaveMaticSubgraphEndpoint, aaveV2SubgraphEndpoint } from '../constants'

import { formatJson } from '../utils/index'
import { apyAprQuery, apyAprResolver } from './queryApyApr'
import { getUserHealthFactor } from './queryHealthFactor'
import { variableRatesQuery, variableRatesResolver } from './queryRates'
import { userDepositQuery, userDespositResolver } from './queryUserDeposit'
import { userReserveQuery, userReserveResolver } from './queryUserReserve'

// create a GraphQL client instance to send requests
const aaveMaticClient = new GraphQLClient(aaveMaticSubgraphEndpoint, {
  headers: {},
})
const aaveV2Client = new GraphQLClient(aaveV2SubgraphEndpoint, {
  headers: {},
})
//TODO: fix this typing
// takes in a client, a http query, a resolver to resolve graphql data from endpoint
const executeQuery = async (client, query, resolve) => {
  try {
    const data = await client.request(query)
    return resolve(data)
  } catch (e) {
    console.log(e)
    return 'exception occured'
  }
}

const testQuery = gql`
  query TEST_QUERY {
    reserves(where: { usageAsCollateralEnabled: true }) {
      id
      name
      price {
        id
      }
      liquidityRate
      variableBorrowRate
      stableBorrowRate
    }
  }
`

const generalResolver = (data) => {
  const result = formatJson(data)
  console.log(result)
  return result
}

// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
export const getUserDeposit = async (userWalletAddress) =>
  executeQuery(
    aaveMaticClient,
    userDepositQuery(userWalletAddress),
    userDespositResolver
  )

// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
export const getUserReserve = async (userWalletAddress) =>
  executeQuery(
    aaveMaticClient,
    userReserveQuery(userWalletAddress),
    userReserveResolver
  )

export const getVariableRate = async () =>
  executeQuery(
    aaveMaticClient,
    variableRatesQuery('USDC'),
    variableRatesResolver
  )

export const getApyApr = async (symbol) =>
  executeQuery(aaveMaticClient, apyAprQuery(symbol), apyAprResolver)

export const getHealthFactor = async (userWalletAddress) =>
  getUserHealthFactor(userWalletAddress, executeQuery, aaveMaticClient)
