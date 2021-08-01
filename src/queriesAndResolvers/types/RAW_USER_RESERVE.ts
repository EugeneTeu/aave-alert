/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RAW_USER_RESERVE
// ====================================================

export interface RAW_USER_RESERVE_userReserves_reserve {
  __typename: "Reserve";
  /**
   * Reserve address
   */
  id: string;
  underlyingAsset: any;
  name: string;
  symbol: string;
  decimals: number;
  liquidityRate: any;
  reserveLiquidationBonus: any;
  lastUpdateTimestamp: number;
}

export interface RAW_USER_RESERVE_userReserves {
  __typename: "UserReserve";
  scaledATokenBalance: any;
  usageAsCollateralEnabledOnUser: boolean;
  scaledVariableDebt: any;
  variableBorrowIndex: any;
  stableBorrowRate: any;
  principalStableDebt: any;
  stableBorrowLastUpdateTimestamp: number;
  reserve: RAW_USER_RESERVE_userReserves_reserve;
  aTokenincentivesUserIndex: any;
  vTokenincentivesUserIndex: any;
  sTokenincentivesUserIndex: any;
}

export interface RAW_USER_RESERVE {
  userReserves: RAW_USER_RESERVE_userReserves[];
}
