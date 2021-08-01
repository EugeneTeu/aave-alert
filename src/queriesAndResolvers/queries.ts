import { gql } from '@apollo/client'
import { GraphQLClient } from 'graphql-request'

import {
  aaveMaticSubgraphEndpoint,
  aaveV2SubgraphEndpoint,
} from '../constants.js'

import { formatJson } from '../utils/index.js'
import { apyAprQuery, apyAprResolver } from './queryApyApr.js'
import { getUserHealthFactor } from './queryHealthFactor.js'
import { variableRatesQuery, variableRatesResolver } from './queryRates.js'
import { userDepositQuery, userDespositResolver } from './queryUserDeposit.js'
import { userReserveQuery, userReserveResolver } from './queryUserReserve.js'

// create a GraphQL client instance to send requests
const aaveMaticClient = new GraphQLClient(aaveMaticSubgraphEndpoint, {
  headers: {},
})
const aaveV2Client = new GraphQLClient(aaveV2SubgraphEndpoint, {
  headers: {},
})

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
export const getUserDeposit = (userWalletAddress) =>
  executeQuery(
    aaveMaticClient,
    userDepositQuery(userWalletAddress),
    userDespositResolver
  )

// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
export const getUserReserve = (userWalletAddress) =>
  executeQuery(
    aaveMaticClient,
    userReserveQuery(userWalletAddress),
    userReserveResolver
  )

export const getVariableRate = () =>
  executeQuery(
    aaveMaticClient,
    variableRatesQuery('USDC'),
    variableRatesResolver
  )

export const getApyApr = (symbol) =>
  executeQuery(aaveMaticClient, apyAprQuery(symbol), apyAprResolver)

export const getHealthFactor = (userWalletAddress) =>
  getUserHealthFactor(userWalletAddress, executeQuery, aaveMaticClient)
