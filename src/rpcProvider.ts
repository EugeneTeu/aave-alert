import { ethers } from 'ethers'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { getExplorerURl } from './explorer'
import { mainnetRPC, mainnetRPCPrivate, testnetRPC } from './utils'

export class RpcProvider {
  rpcProvider: ethers.providers.Provider
  constructor() {
    const type = process.env.env ?? 'dev'
    if (type === 'dev') {
      this.rpcProvider = new ethers.providers.JsonRpcProvider(testnetRPC)
      // works
    } else {
      this.rpcProvider = new ethers.providers.JsonRpcProvider(mainnetRPCPrivate)
    }
    console.log('RpcProvider initiated')
  }

  listenToPending(): NodeJS.Timer {
    let latestBlock
    return setInterval(async () => {
      const currentBlock = await this.rpcProvider.getBlockNumber()
      if (latestBlock === currentBlock) {
        return
      }
      latestBlock = currentBlock
      const txns = await this.rpcProvider.getBlockWithTransactions(latestBlock)
      console.log(txns.timestamp, txns.number + '\n')
      const transactions = txns.transactions
      const filteredTransactions = transactions.filter((txn) => {
        if (!txn.to) {
          return false
        }
        return txn.to === '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff'
      })
      console.log(filteredTransactions)
    }, 2000)
  }
}

function formatReply(txn: ethers.providers.TransactionResponse) {
  return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${
    txn.nonce
  }, explorer: ${getExplorerURl(txn.hash)}`
}
