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
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = require("./src/index.js");
const { config } = dotenv_1.default;
const ethers_1 = require("ethers");
const getShaunHealthFactorAndDeposit = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWalletAddress = '0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb'.toLowerCase();
        const result = yield index_js_1.getHealthFactor(userWalletAddress.toLowerCase());
        const result2 = yield index_js_1.getUserReserve(userWalletAddress.toLowerCase());
        return ctx.reply(`${result}\n${result2}`);
    }
    catch (e) {
        console.log(e);
        return ctx.reply(`Error occured la`);
    }
});
const getEugeneHealthFactorAndDeposit = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWalletAddress = '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase();
        const result = yield index_js_1.getHealthFactor(userWalletAddress.toLowerCase());
        const result2 = yield index_js_1.getUserReserve(userWalletAddress.toLowerCase());
        return ctx.reply(`${result}\n${result2}`);
    }
    catch (e) {
        console.log(e);
        return ctx.reply(`Error occured la`);
    }
});
config();
const API_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;
const bot = new telegraf_1.Telegraf(API_TOKEN);
// bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`)
bot.start((ctx) => ctx.reply('Hello there.'));
bot.command('quit', (ctx) => {
    // Using context shortcut
    ctx.leaveChat();
});
bot.command('alive', (ctx) => {
    ctx.reply('hi i am alive');
});
bot.command('shaun', getShaunHealthFactorAndDeposit);
bot.command('Shaun', getShaunHealthFactorAndDeposit);
bot.command('eugene', getEugeneHealthFactorAndDeposit);
bot.command('Eugene', getEugeneHealthFactorAndDeposit);
bot.command('dp', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { update: { message: { text }, }, } = ctx;
    if (!text || text.split(' ').length < 2 || text.split(' ').length > 3) {
        return ctx.reply('wrong format, should be /dp <ETH ADDRESS>');
    }
    let address = text.split(' ')[1];
    try {
        address = ethers_1.utils.getAddress(address);
    }
    catch (e) {
        // {"reason":"invalid address","code":"INVALID_ARGUMENT","argument":"address","value":"test"}
        const { reason, value } = e;
        return ctx.reply(`Received: ${value}\n rejected as ${reason}`);
    }
    const result = yield index_js_1.getHealthFactor(address.toLowerCase());
    const result2 = yield index_js_1.getUserReserve(address.toLowerCase());
    return ctx.reply(`${result}\n${result2}`);
}));
// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('hipster', Telegraf.reply('λ'))
// bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
