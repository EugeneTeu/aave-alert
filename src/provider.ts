import { ethers } from 'ethers'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { getExplorerURl } from './explorer'
export function addPendingTxnListener(
  webSocketProvider: ethers.providers.Provider,
  address: string,
  bot: Telegraf<Context<Update>>,
  chatId: number
) {
  webSocketProvider.on('pending', async (tx) => {
    try {
      const txn: ethers.providers.TransactionResponse =
        await webSocketProvider.getTransaction(tx)
      if (!txn) {
        return
      }
      if (txn.from === address || txn.to === address) {
        const reply = formatReply(txn)
        bot.telegram.sendMessage(chatId, reply)
      }
    } catch (e) {
      console.log(e)
      return
    }
  })
  return () => webSocketProvider.off('pending')
}

function formatReply(txn: ethers.providers.TransactionResponse) {
  return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${
    txn.nonce
  }, explorer: ${getExplorerURl(txn.hash)}`
}

export function removePendingTxnListener(address) {}
