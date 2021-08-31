"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerURl = void 0;
const getExplorerURl = (txnHash) => {
    if (process.env.env === 'dev') {
        return 'https://mumbai.polygonscan.com/tx/' + txnHash;
    }
    return 'https://polygonscan.com/tx/' + txnHash;
};
exports.getExplorerURl = getExplorerURl;
