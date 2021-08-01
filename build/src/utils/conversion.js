"use strict";
// util method to convert the decimal place of different assets
// ERC20 tokens uses 10^18
// USDC token uses 10^6
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatERC20 = exports.formatUSDC = void 0;
const ethers_1 = __importDefault(require("ethers"));
const formatUSDC = (usdc) => ethers_1.default.utils.formatUnits(usdc, 6);
exports.formatUSDC = formatUSDC;
const formatERC20 = (erc20) => ethers_1.default.utils.formatEther(erc20);
exports.formatERC20 = formatERC20;
