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
exports.getUserHealthFactor = void 0;
const apollo_server_1 = require("apollo-server");
const protocol_js_1 = require("@aave/protocol-js");
const POOL = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'.toLowerCase();
// GraphQL queries
const poolReservesDataGQL = apollo_server_1.gql `
  query POOL_RESERVE_DATA {
    reserves {
      id
      underlyingAsset
      name
      symbol
      decimals
      isActive
      isFrozen
      usageAsCollateralEnabled
      borrowingEnabled
      stableBorrowRateEnabled
      reserveFactor
      baseLTVasCollateral
      optimalUtilisationRate
      stableRateSlope1
      stableRateSlope2
      averageStableRate
      stableDebtLastUpdateTimestamp
      baseVariableBorrowRate
      variableRateSlope1
      variableRateSlope2
      liquidityIndex
      reserveLiquidationThreshold
      reserveLiquidationBonus
      variableBorrowIndex
      variableBorrowRate

      availableLiquidity
      stableBorrowRate
      liquidityRate

      totalPrincipalStableDebt
      totalScaledVariableDebt
      lastUpdateTimestamp
      price {
        priceInEth
      }
      aEmissionPerSecond
      vEmissionPerSecond
      sEmissionPerSecond
      aIncentivesLastUpdateTimestamp
      vIncentivesLastUpdateTimestamp
      sIncentivesLastUpdateTimestamp
      aTokenIncentivesIndex
      vTokenIncentivesIndex
      sTokenIncentivesIndex
    }
  }
`;
const rawUserReservesGQL = (USER) => {
    return apollo_server_1.gql `
  query RAW_USER_RESERVE {
    userReserves(where: { user: "${USER}"}) {
      currentATokenBalance
      scaledATokenBalance
      usageAsCollateralEnabledOnUser
      scaledVariableDebt
      variableBorrowIndex
      stableBorrowRate
      principalStableDebt
      stableBorrowLastUpdateTimestamp
      reserve {
        id
        underlyingAsset
        name
        symbol
        decimals
        liquidityRate
        reserveLiquidationBonus
        lastUpdateTimestamp
      }
      aTokenincentivesUserIndex
      vTokenincentivesUserIndex
      sTokenincentivesUserIndex
    }
  }
  `;
};
const usdPriceInETHGQL = apollo_server_1.gql `
  query USD_PRICE_IN_ETH {
    priceOracle(id: 1) {
      usdPriceEth
    }
  }
`;
// // userId
const userId = () => '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase();
const currentTimeStamp = () => Math.floor(Date.now() / 1000);
const getUserHealthFactor = (userId, executeQuery, aaveMaticClient) => __awaiter(void 0, void 0, void 0, function* () {
    const { reserves } = yield executeQuery(aaveMaticClient, poolReservesDataGQL, (data) => data);
    const { userReserves } = yield executeQuery(aaveMaticClient, rawUserReservesGQL(userId), (data) => data);
    const { priceOracle: { usdPriceEth }, } = yield executeQuery(aaveMaticClient, usdPriceInETHGQL, (data) => data);
    const { healthFactor, reservesData, totalCollateralUSD, totalBorrowsETH, totalCollateralETH, totalBorrowsUSD, currentLoanToValue, } = protocol_js_1.formatUserSummaryData(reserves, userReserves, userId, usdPriceEth, currentTimeStamp());
    // console.log(totalCollateralUSD, totalBorrowsUSD)
    // console.log(usdPriceInETH)
    const healthFactorAnswer = formatHealthFactorAnwser(parseFloat(healthFactor).toPrecision(3));
    // console.log(healthFactor)
    const userDepositsAndBorrowings = formatUserDepositAndBorrow(reservesData);
    return healthFactorAnswer + '\n' + userDepositsAndBorrowings;
});
exports.getUserHealthFactor = getUserHealthFactor;
const formatUserDepositAndBorrow = (reservesData) => {
    // reservesData = reservesData.filter(
    //   ({ underlyingBalance }) => parseInt(underlyingBalance) > 0
    // )
    let deposits = [];
    let borrows = [];
    for (const currReserve of reservesData) {
        const { reserve: { symbol }, underlyingBalance, // deposit
        totalBorrows, // borrows
         } = currReserve;
        deposits.push([symbol, underlyingBalance]);
        borrows.push([symbol, totalBorrows]);
    }
    let result = 'Deposits:\n';
    // console.log(deposits)
    for (const deposit of deposits) {
        if (deposit[1] === '0') {
            continue;
        }
        result = result + `${deposit[0]}: ${deposit[1]}` + '\n';
    }
    result = result + 'Borrowings:\n';
    for (const borrow of borrows) {
        if (borrow[1] === '0') {
            continue;
        }
        result = result + `${borrow[0]}: ${borrow[1]}` + '\n';
    }
    return result;
};
const formatHealthFactorAnwser = (healthFactor) => {
    return `Your health factor is ${healthFactor}`;
};
