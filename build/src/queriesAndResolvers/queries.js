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
exports.getHealthFactor = exports.getApyApr = exports.getVariableRate = exports.getUserReserve = exports.getUserDeposit = void 0;
const apollo_server_1 = require("apollo-server");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../constants");
const index_1 = require("../utils/index");
const queryApyApr_1 = require("./queryApyApr");
const queryUserData_1 = require("./queryUserData");
const queryRates_1 = require("./queryRates");
const queryUserDeposit_1 = require("./queryUserDeposit");
const queryUserReserve_1 = require("./queryUserReserve");
// create a GraphQL client instance to send requests
const aaveMaticClient = new graphql_request_1.GraphQLClient(constants_1.aaveMaticSubgraphEndpoint, {
    headers: {},
});
const aaveV2Client = new graphql_request_1.GraphQLClient(constants_1.aaveV2SubgraphEndpoint, {
    headers: {},
});
//TODO: fix this typing
// takes in a client, a http query, a resolver to resolve graphql data from endpoint
const executeQuery = (client, query, resolve) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield client.request(query);
        return resolve(data);
    }
    catch (e) {
        console.log(e);
        return 'exception occured';
    }
});
const testQuery = apollo_server_1.gql `
  query TEST_QUERY {
    reserves(where: { usageAsCollateralEnabled: true }) {
      id
      name
      price {
        id
      }
      liquidityRate
      variableBorrowRate
      stableBorrowRate
    }
  }
`;
const generalResolver = (data) => {
    const result = index_1.formatJson(data);
    console.log(result);
    return result;
};
// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
const getUserDeposit = (userWalletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return executeQuery(aaveMaticClient, queryUserDeposit_1.userDepositQuery(userWalletAddress), queryUserDeposit_1.userDespositResolver);
});
exports.getUserDeposit = getUserDeposit;
// we can simply use this client to run quries.
// executeQuery(aaveMaticClient, testQuery)
const getUserReserve = (userWalletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return executeQuery(aaveMaticClient, queryUserReserve_1.userReserveQuery(userWalletAddress), queryUserReserve_1.userReserveResolver);
});
exports.getUserReserve = getUserReserve;
const getVariableRate = () => __awaiter(void 0, void 0, void 0, function* () {
    return executeQuery(aaveMaticClient, queryRates_1.variableRatesQuery('USDC'), queryRates_1.variableRatesResolver);
});
exports.getVariableRate = getVariableRate;
const getApyApr = (symbol) => __awaiter(void 0, void 0, void 0, function* () { return executeQuery(aaveMaticClient, queryApyApr_1.apyAprQuery(symbol), queryApyApr_1.apyAprResolver); });
exports.getApyApr = getApyApr;
const getHealthFactor = (userWalletAddress) => __awaiter(void 0, void 0, void 0, function* () { return queryUserData_1.getUserHealthFactor(userWalletAddress, executeQuery, aaveMaticClient); });
exports.getHealthFactor = getHealthFactor;
