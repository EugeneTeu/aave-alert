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
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./src/index");
// get Dot env
const { config } = dotenv_1.default;
config();
const type = (_a = process.env.env) !== null && _a !== void 0 ? _a : 'dev';
function init(type) {
    // set u ethers provider
    let rpcProvider = new index_1.RpcProvider();
    let webSocketProvider = new index_1.WebSocketProvider();
    return {
        rpcProvider,
        webSocketProvider,
    };
}
let id;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Init providers to chain');
        const { rpcProvider, webSocketProvider } = init(type);
        id = webSocketProvider.initHeartBeat();
        index_1.initBot(webSocketProvider);
        //webSocketProvider.listenToPending();
    });
}
main();
process.once('SIGINT', () => {
    clearInterval(id);
});
process.once('SIGTERM', () => {
    clearInterval(id);
});
