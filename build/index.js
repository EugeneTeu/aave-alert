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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./src/index");
const ethers_1 = require("ethers");
const eth_provider_1 = __importDefault(require("eth-provider"));
// get Dot env
const { config } = dotenv_1.default;
config();
const API_TOKEN = process.env.BOT_TOKEN || '';
const type = (_a = process.env.env) !== null && _a !== void 0 ? _a : 'dev';
const chatIDsToAddress = new Map();
const addressToChatIDs = new Map();
const listenerIDs = new Map();
function init(type) {
    // set u ethers provider
    let rpcProvider;
    let webSocketProvider;
    if (type === 'dev') {
        rpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(index_1.testnetRPC);
        webSocketProvider = new ethers_1.ethers.providers.Web3Provider(eth_provider_1.default(index_1.testnetWSS));
        // works
    }
    else {
        rpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(index_1.mainnetRPC);
        webSocketProvider = new ethers_1.ethers.providers.Web3Provider(eth_provider_1.default(index_1.mainnetWSS));
    }
    return {
        rpcProvider,
        webSocketProvider,
    };
}
console.log('Init providers to chain');
const { webSocketProvider } = init(type);
setInterval(() => {
    webSocketProvider.getNetwork();
    console.log('heart beat log');
}, 5000);
console.log('Creating bot with token');
const bot = new telegraf_1.Telegraf(API_TOKEN);
console.log('bot created!');
bot.launch();
bot.command('/start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx) {
        return;
    }
    const currentChatId = ctx.chat.id;
    const address = chatIDsToAddress.get(currentChatId);
    if (!address) {
        ctx.reply('Type /reg {YOUR_ADDRESS} to register');
    }
    else {
        const listenerID = index_1.addPendingTxnListener(webSocketProvider, address, bot, ctx.chat.id);
        chatIDsToAddress.set(ctx.chat.id, address);
        addressToChatIDs.set(address, ctx.chat.id);
        listenerIDs.set(address, listenerID);
        console.log(listenerIDs);
        console.log(addressToChatIDs);
        return ctx.reply(`Started monitoring for this address ${address}!`);
    }
}));
bot.command('reg', (ctx) => {
    const { update: { message: { text }, }, } = ctx;
    if (!text || text.split(' ').length < 2 || text.split(' ').length > 3) {
        return ctx.reply('wrong format, should be /reg <ADDRESS>');
    }
    let address = text.split(' ')[1];
    const currentAddressInChat = chatIDsToAddress.get(ctx.chat.id);
    if (currentAddressInChat == address) {
        return ctx.reply('Address already registered!');
    }
    try {
        address = ethers_1.utils.getAddress(address);
    }
    catch (e) {
        const { reason, value } = e;
        return ctx.reply(`Received: ${value}\n rejected as ${reason}`);
    }
    chatIDsToAddress.set(ctx.chat.id, address);
    return ctx.reply('Address registered! /start to start monitoring');
});
bot.command('stop', (ctx) => {
    const currentAddress = chatIDsToAddress.get(ctx.chat.id);
    console.log(currentAddress);
    const unsubscribe = listenerIDs.get(currentAddress);
    console.log(unsubscribe);
    if (unsubscribe) {
        unsubscribe();
    }
    listenerIDs.delete(currentAddress);
    addressToChatIDs.delete(addressToChatIDs.get(ctx.chat.id));
    chatIDsToAddress.delete(ctx.chat.id);
    return ctx.reply('Your chat ID has been removed!');
});
bot.command('/listeners', (ctx) => {
    const listeners = webSocketProvider.listeners('pending');
    if (listeners.length === 0) {
        return ctx.reply('no listeners right now!');
    }
    return ctx.reply(`${listeners}`);
});
bot.command('/test', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const network = yield webSocketProvider.getNetwork();
    console.log(network);
    return ctx.reply(`${network.name} ${network.chainId}`);
}));
bot.command('eugene', index_1.getEugeneHealthFactorAndDeposit);
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
