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
exports.WebSocketProvider = void 0;
const ethers_1 = require("ethers");
const explorer_1 = require("./explorer");
const utils_1 = require("./utils");
class WebSocketProvider {
    constructor() {
        var _a;
        const type = (_a = process.env.env) !== null && _a !== void 0 ? _a : 'dev';
        if (type === 'dev') {
            this.webSocketProvider = new ethers_1.ethers.providers.WebSocketProvider(utils_1.testnetWSS);
            // works
        }
        else {
            this.webSocketProvider = new ethers_1.ethers.providers.WebSocketProvider(utils_1.mainnetWSS);
        }
        console.log('WebSocketProvider initiated');
    }
    listenToPending() {
        try {
            this.webSocketProvider.on('pending', (arg) => {
                console.log(arg);
            });
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    getNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.webSocketProvider.getNetwork();
        });
    }
    initHeartBeat() {
        const refreshIntervalId = setInterval(() => {
            this.webSocketProvider.getNetwork();
            // console.log('heart beat log')
        }, 5000);
        return refreshIntervalId;
    }
    addPendingTxnListener(address, bot, chatId) {
        const listener = (hash) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (hash) {
                    const txn = yield this.webSocketProvider.getTransaction(hash);
                    if (!txn) {
                    }
                    else {
                        if (txn.from === address || txn.to === address) {
                            const reply = formatReply(txn);
                            bot.telegram.sendMessage(chatId, `Chat ID: ${chatId} \n${reply}`);
                        }
                    }
                }
            }
            catch (e) {
                bot.telegram.sendMessage(chatId, `Chat ID: ${chatId} \n${e}`);
            }
        });
        this.webSocketProvider.on('pending', listener);
        return () => this.webSocketProvider.off('pending', listener);
    }
}
exports.WebSocketProvider = WebSocketProvider;
function formatReply(txn) {
    return `txn detected from ${txn.from} to ${txn.to}, Nonce: ${txn.nonce}, explorer: ${explorer_1.getExplorerURl(txn.hash)}`;
}
