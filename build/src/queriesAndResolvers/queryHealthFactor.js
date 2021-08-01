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
  {
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
  {
    userReserves(where: { user: "${USER}"}) {
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
  {
    priceOracle(id: 1) {
      usdPriceEth
    }
  }
`;
// userId
const userId = () => '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase();
const currentTimeStamp = () => Math.floor(Date.now() / 1000);
const getUserHealthFactor = (user, executeQuery, aaveMaticClient) => __awaiter(void 0, void 0, void 0, function* () {
    const poolReservesData = yield executeQuery(aaveMaticClient, poolReservesDataGQL, (data) => data);
    const rawUserReservesData = yield executeQuery(aaveMaticClient, rawUserReservesGQL(user), (data) => data);
    const usdPriceInETH = yield executeQuery(aaveMaticClient, usdPriceInETHGQL, (data) => data);
    const { healthFactor } = protocol_js_1.formatUserSummaryData(poolReservesData.reserves, rawUserReservesData.userReserves, userId(), usdPriceInETH, currentTimeStamp());
    return formatHealthFactorAnwser(parseFloat(healthFactor).toPrecision(3));
});
exports.getUserHealthFactor = getUserHealthFactor;
const formatHealthFactorAnwser = (healthFactor) => {
    return `Your health factor is ${healthFactor}`;
};
