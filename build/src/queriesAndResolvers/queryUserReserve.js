"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userReserveResolver = exports.userReserveQuery = void 0;
const apollo_server_1 = require("apollo-server");
const utils_1 = require("../utils");
const userReserveQuery = (USER_ADDRESS) => apollo_server_1.gql `
  query USER_RESERVE_QUERY {
    userReserves(where: { user: "${USER_ADDRESS}" }) {
      currentATokenBalance
      scaledATokenBalance
      reserve {
        symbol
      }
      user {
        id
      }
    }
  }
`;
exports.userReserveQuery = userReserveQuery;
const userReserveResolver = (data) => {
    // console.log(data.userReserves)
    // console.log(JSON.stringify(data, null, 1))
    // object returned from gql is json object
    const { userReserves } = data;
    // key : symbol, value: amount (string)
    const balances = new Map();
    userReserves
        .filter(({ currentATokenBalance }) => currentATokenBalance > 0)
        .map((data) => {
        const { currentATokenBalance, reserve: { symbol }, } = data;
        let formattedBalance = '0';
        if (symbol === 'USDC') {
            formattedBalance = utils_1.formatUSDC(currentATokenBalance);
        }
        else {
            formattedBalance = utils_1.formatERC20(currentATokenBalance);
        }
        balances.set(symbol, formattedBalance);
    });
    return formatDataForBot(balances);
};
exports.userReserveResolver = userReserveResolver;
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
