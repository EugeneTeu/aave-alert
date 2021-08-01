/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: POOL_RESERVE_DATA
// ====================================================

export interface POOL_RESERVE_DATA_reserves_price {
  __typename: "PriceOracleAsset";
  priceInEth: any;
}

export interface POOL_RESERVE_DATA_reserves {
  __typename: "Reserve";
  /**
   * Reserve address
   */
  id: string;
  underlyingAsset: any;
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
  isFrozen: boolean;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  reserveFactor: any;
  baseLTVasCollateral: any;
  optimalUtilisationRate: any;
  stableRateSlope1: any;
  stableRateSlope2: any;
  averageStableRate: any;
  stableDebtLastUpdateTimestamp: number;
  baseVariableBorrowRate: any;
  variableRateSlope1: any;
  variableRateSlope2: any;
  liquidityIndex: any;
  reserveLiquidationThreshold: any;
  reserveLiquidationBonus: any;
  variableBorrowIndex: any;
  variableBorrowRate: any;
  availableLiquidity: any;
  stableBorrowRate: any;
  liquidityRate: any;
  totalPrincipalStableDebt: any;
  totalScaledVariableDebt: any;
  lastUpdateTimestamp: number;
  price: POOL_RESERVE_DATA_reserves_price;
  aEmissionPerSecond: any;
  vEmissionPerSecond: any;
  sEmissionPerSecond: any;
  aIncentivesLastUpdateTimestamp: number;
  vIncentivesLastUpdateTimestamp: number;
  sIncentivesLastUpdateTimestamp: number;
  aTokenIncentivesIndex: any;
  vTokenIncentivesIndex: any;
  sTokenIncentivesIndex: any;
}

export interface POOL_RESERVE_DATA {
  reserves: POOL_RESERVE_DATA_reserves[];
}
