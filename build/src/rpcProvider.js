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
exports.RpcProvider = void 0;
const ethers_1 = require("ethers");
const explorer_1 = require("./explorer");
const utils_1 = require("./utils");
class RpcProvider {
    constructor() {
        var _a;
        const type = (_a = process.env.env) !== null && _a !== void 0 ? _a : 'dev';
        if (type === 'dev') {
            this.rpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(utils_1.testnetRPC);
            // works
        }
        else {
            this.rpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(utils_1.mainnetRPCPrivate);
        }
        console.log('RpcProvider initiated');
    }
    listenToPending() {
        let latestBlock;
        return setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const currentBlock = yield this.rpcProvider.getBlockNumber();
            if (latestBlock === currentBlock) {
                return;
            }
            latestBlock = currentBlock;
            const txns = yield this.rpcProvider.getBlockWithTransactions(latestBlock);
            console.log(txns.timestamp, txns.number + '\n');
            const transactions = txns.transactions;
            const filteredTransactions = transactions.filter((txn) => {
                if (!txn.to) {
                    return false;
                }
                return txn.to === '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff';
            });
            console.log(filteredTransactions);
        }), 2000);
    }
}
exports.RpcProvider = RpcProvider;
function formatReply(txn) {
    return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${txn.nonce}, explorer: ${explorer_1.getExplorerURl(txn.hash)}`;
}
