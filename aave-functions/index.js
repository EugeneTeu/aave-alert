import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { gql } from 'apollo-server'
import express, { json } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { request, GraphQLClient } from 'graphql-request'

import {
  aaveMaticSubgraphEndpoint,
  aaveV2SubgraphEndpoint,
} from './constants.js'

import {
  userDepositQuery,
  userDespositResolver,
  variableRatesQuery,
  variableRatesResolver,
  apyAprQuery,
  apyAprResolver,
  getUserHealthFactor,
} from './queriesAndResolvers/index.js'
import { formatJson } from './utils/index.js'

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
  {
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

const queryUserReserve = (USER_ADDRESS) => gql`
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
