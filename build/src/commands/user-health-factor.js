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
exports.getEugeneHealthFactorAndDeposit = exports.getShaunHealthFactorAndDeposit = void 0;
const queriesAndResolvers_1 = require("../queriesAndResolvers");
const getShaunHealthFactorAndDeposit = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWalletAddress = '0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb'.toLowerCase();
        const result = yield queriesAndResolvers_1.getHealthFactor(userWalletAddress.toLowerCase());
        // const result2 = await getUserReserve(userWalletAddress.toLowerCase())
        return ctx.reply(result);
    }
    catch (e) {
        console.log(e);
        return ctx.reply(`Error occured la`);
    }
});
exports.getShaunHealthFactorAndDeposit = getShaunHealthFactorAndDeposit;
const getEugeneHealthFactorAndDeposit = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWalletAddress = '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase();
        const result = yield queriesAndResolvers_1.getHealthFactor(userWalletAddress.toLowerCase());
        // const result2 = await getUserReserve(userWalletAddress.toLowerCase())
        return ctx.reply(result);
    }
    catch (e) {
        console.log(e);
        return ctx.reply(`Error occured la`);
    }
});
exports.getEugeneHealthFactorAndDeposit = getEugeneHealthFactorAndDeposit;
