import { Scenes, session, Telegraf } from 'telegraf'
import { Network } from '@aave/protocol-js'
import pkg from 'dotenv'
import http from 'http'
import {
  getEugeneHealthFactorAndDeposit,
  testnetRPC,
  testnetWSS,
  mainnetRPC,
  mainnetWSS,
  initBot,
  WebSocketProvider,
  RpcProvider,
} from './src/index'
import { ethers, Event, utils } from 'ethers'
import provider from 'eth-provider'

// get Dot env
const { config } = pkg
config()
const type = process.env.env ?? 'dev'

function init(type: string) {
  // set u ethers provider
  let rpcProvider = new RpcProvider()
  let webSocketProvider = new WebSocketProvider()

  return {
    rpcProvider,
    webSocketProvider,
  }
}
let id
async function main() {
  console.log('Init providers to chain')
  const { rpcProvider, webSocketProvider } = init(type)
  id = webSocketProvider.initHeartBeat()
  initBot(webSocketProvider)
}
main()

process.once('SIGINT', () => {
  clearInterval(id)
})
process.once('SIGTERM', () => {
  clearInterval(id)
})
