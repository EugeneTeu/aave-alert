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
  addPendingTxnListener,
} from './src/index'
import { ethers, Event, utils } from 'ethers'
import provider from 'eth-provider'
// get Dot env
const { config } = pkg
config()
const API_TOKEN = process.env.BOT_TOKEN || ''
const type = process.env.env ?? 'dev'

const chatIDsToAddress = new Map()
const addressToChatIDs = new Map()
const listenerIDs = new Map<string, () => ethers.providers.Provider>()

function init(type: string) {
  // set u ethers provider
  let rpcProvider: ethers.providers.JsonRpcProvider
  let webSocketProvider: ethers.providers.Provider | ethers.Signer | undefined

  if (type === 'dev') {
    rpcProvider = new ethers.providers.JsonRpcProvider(testnetRPC)
    webSocketProvider = new ethers.providers.Web3Provider(provider(testnetWSS))
    // works
  } else {
    rpcProvider = new ethers.providers.JsonRpcProvider(mainnetRPC)
    webSocketProvider = new ethers.providers.Web3Provider(provider(mainnetWSS))
  }

  return {
    rpcProvider,
    webSocketProvider,
  }
}

console.log('Init providers to chain')
const { webSocketProvider } = init(type)

const refreshIntervalId = setInterval(() => {
  webSocketProvider.getNetwork()
  console.log('heart beat log')
}, 5000)

console.log('Creating bot with token')
const bot = new Telegraf(API_TOKEN)
console.log('bot created!')
bot.launch()
bot.command('/start', async (ctx) => {
  if (!ctx) {
    return
  }
  const currentChatId = ctx.chat.id
  const address = chatIDsToAddress.get(currentChatId)
  if (!address) {
    ctx.reply('Type /reg {YOUR_ADDRESS} to register')
  } else {
    const listenerID = addPendingTxnListener(
      webSocketProvider,
      address,
      bot,
      ctx.chat.id
    )
    chatIDsToAddress.set(ctx.chat.id, address)
    addressToChatIDs.set(address, ctx.chat.id)
    listenerIDs.set(address, listenerID)
    console.log(listenerIDs)
    console.log(addressToChatIDs)
    return ctx.reply(`Started monitoring for this address ${address}!`)
  }
})

bot.command('reg', (ctx) => {
  const {
    update: {
      message: { text },
    },
  } = ctx
  if (!text || text.split(' ').length < 2 || text.split(' ').length > 3) {
    return ctx.reply('wrong format, should be /reg <ADDRESS>')
  }
  let address = text.split(' ')[1]
  const currentAddressInChat = chatIDsToAddress.get(ctx.chat.id)
  if (currentAddressInChat == address) {
    return ctx.reply('Address already registered!')
  }
  try {
    address = utils.getAddress(address)
  } catch (e) {
    const { reason, value } = e
    return ctx.reply(`Received: ${value}\n rejected as ${reason}`)
  }

  chatIDsToAddress.set(ctx.chat.id, address)
  return ctx.reply('Address registered! /start to start monitoring')
})

bot.command('stop', (ctx) => {
  const currentAddress = chatIDsToAddress.get(ctx.chat.id)
  console.log(currentAddress)
  const unsubscribe = listenerIDs.get(currentAddress)
  console.log(unsubscribe)
  if (unsubscribe) {
    unsubscribe()
  }
  listenerIDs.delete(currentAddress)
  addressToChatIDs.delete(addressToChatIDs.get(ctx.chat.id))
  chatIDsToAddress.delete(ctx.chat.id)
  return ctx.reply('Your chat ID has been removed!')
})

bot.command('/listeners', (ctx) => {
  const listeners = webSocketProvider.listeners('pending')
  if (listeners.length === 0) {
    return ctx.reply('no listeners right now!')
  }
  return ctx.reply(`${listeners}`)
})

bot.command('/test', async (ctx) => {
  const network = await webSocketProvider.getNetwork()
  console.log(network)
  return ctx.reply(`${network.name} ${network.chainId}`)
})

bot.command('eugene', getEugeneHealthFactorAndDeposit)

// Enable graceful stop
process.once('SIGINT', () => {
  clearInterval(refreshIntervalId)
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  clearInterval(refreshIntervalId)
  bot.stop('SIGTERM')
})
