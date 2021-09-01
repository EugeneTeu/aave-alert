import { ethers } from 'ethers'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { getExplorerURl } from './explorer'
import {
  mainnetPrivateWss,
  mainnetWSS,
  mumbaiPrivateWss,
  testnetWSS,
} from './utils'
import provider from 'eth-provider'

export class WebSocketProvider {
  webSocketProvider: ethers.providers.Provider
  constructor() {
    const type = process.env.env ?? 'dev'
    if (type === 'dev') {
      this.webSocketProvider = new ethers.providers.WebSocketProvider(
        testnetWSS
      )
      // works
    } else {
      this.webSocketProvider = new ethers.providers.WebSocketProvider(
        mainnetWSS
      )
    }
    console.log('WebSocketProvider initiated')
  }

  listenToPending() {
    try {
      this.webSocketProvider.on('pending', (arg) => {
        console.log(arg)
      })
    } catch (e) {
      console.log(e)
      return
    }
  }

  async getNetwork() {
    return await this.webSocketProvider.getNetwork()
  }

  initHeartBeat() {
    const refreshIntervalId = setInterval(() => {
      this.webSocketProvider.getNetwork()
      // console.log('heart beat log')
    }, 5000)
    return refreshIntervalId
  }

  addPendingTxnListener(
    address: string,
    bot: Telegraf<Context<Update>>,
    chatId: number
  ) {
    const listener = async (hash: string) => {
      try {
        if (hash) {
          const txn: ethers.providers.TransactionResponse =
            await this.webSocketProvider.getTransaction(hash)
          if (!txn) {
          } else {
            if (txn.from === address || txn.to === address) {
              const reply = formatReply(txn)
              bot.telegram.sendMessage(chatId, `Chat ID: ${chatId} \n${reply}`)
            }
          }
        }
      } catch (e) {
        bot.telegram.sendMessage(chatId, `Chat ID: ${chatId} \n${e}`)
      }
    }

    this.webSocketProvider.on('pending', listener)
    return () => this.webSocketProvider.off('pending', listener)
  }
}

function formatReply(txn: ethers.providers.TransactionResponse) {
  return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${
    txn.nonce
  }, explorer: ${getExplorerURl(txn.hash)}`
}
