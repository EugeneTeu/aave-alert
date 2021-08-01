"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDespositResolver = exports.userDepositQuery = void 0;
const apollo_server_1 = require("apollo-server");
const index_js_1 = require("../utils/index.js");
// userDeposit gql query
const userDepositQuery = (USER_ADDRESS) => apollo_server_1.gql `
  {
    deposits(where: { user: "${USER_ADDRESS}" }) {
      userReserve {
        currentATokenBalance
      }
      reserve {
        symbol
        variableBorrowRate
      }
    }
  }
`;
exports.userDepositQuery = userDepositQuery;
const userDespositResolver = (data) => {
    // object returned from gql is json object
    const { deposits } = data;
    // key : symbol, value: amount (string)
    const balances = new Map();
    deposits
        .filter(({ userReserve: { currentATokenBalance } }) => currentATokenBalance > 0)
        .map((data) => {
        const { userReserve: { currentATokenBalance }, reserve: { symbol, variableBorrowRate }, } = data;
        let formattedBalance = '0';
        if (symbol === 'USDC') {
            formattedBalance = index_js_1.formatUSDC(currentATokenBalance);
        }
        else {
            formattedBalance = index_js_1.formatERC20(currentATokenBalance);
        }
        balances.set(symbol, formattedBalance);
    });
    return formatDataForBot(balances);
};
exports.userDespositResolver = userDespositResolver;
// takes in a map of { symbol: amount }
//TODO: move to bot function folder
// bot function folder will compose graphql calls together
const formatDataForBot = (balance) => {
    let result = ['You currently have the following deposits in AAVE:\n'];
    for (let [key, value] of balance) {
        const string = `${key}: ${value}\n`;
        result.push(string);
    }
    return result.join('');
};
