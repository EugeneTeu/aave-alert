"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPendingTxnListener = void 0;
const explorer_1 = require("./explorer");
function addPendingTxnListener(webSocketProvider, address, bot, chatId) {
    const listener = (txHash) => __awaiter(this, void 0, void 0, function* () {
        try {
            const txn = yield webSocketProvider.getTransaction(txHash);
            if (!txn) {
                return;
            }
            if (txn.from === address || txn.to === address) {
                const reply = formatReply(txn);
                bot.telegram.sendMessage(chatId, reply);
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    });
    webSocketProvider.on('pending', listener);
    return () => webSocketProvider.off('pending', listener);
}
exports.addPendingTxnListener = addPendingTxnListener;
function formatReply(txn) {
    return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${txn.nonce}, explorer: ${explorer_1.getExplorerURl(txn.hash)}`;
}
