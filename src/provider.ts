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
  const listener = async ({ hash }) => {
    try {
      const txn: ethers.providers.TransactionResponse =
        await webSocketProvider.getTransaction(hash)
      if (!txn) {
      } else {
        if (txn.from === address || txn.to === address) {
          const reply = formatReply(txn)
          bot.telegram.sendMessage(chatId, reply)
        }
      }
    } catch (e) {
      console.log(e)
      return
    }
  }

  webSocketProvider.on('pending', listener)
  return () => webSocketProvider.off('pending', listener)
}

function formatReply(txn: ethers.providers.TransactionResponse) {
  return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${
    txn.nonce
  }, explorer: ${getExplorerURl(txn.hash)}`
}
