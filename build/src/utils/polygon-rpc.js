"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mumbaiPrivateWss = exports.testnetWSS = exports.testnetRPC = exports.mainnetPrivateWss = exports.mainnetRPCPrivate = exports.mainnetWSS = exports.mainnetRPC = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// get Dot env
const { config } = dotenv_1.default;
config();
exports.mainnetRPC = 'https://polygon-rpc.com';
exports.mainnetWSS = 'wss://rpc-mainnet.matic.quiknode.pro';
exports.mainnetRPCPrivate = `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATIC_MAINNET}`;
exports.mainnetPrivateWss = `wss://rpc-mainnet.maticvigil.com/ws/v1/${process.env.MATIC_MAINNET}`;
exports.testnetRPC = 'https://matic-mumbai.chainstacklabs.com';
exports.testnetWSS = 'wss://ws-matic-mumbai.chainstacklabs.com';
exports.mumbaiPrivateWss = `wss://rpc-mumbai.maticvigil.com/ws/v1/${process.env.MATIC_MUMBAI}`;
