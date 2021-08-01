/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: APY_APR_QUERY
// ====================================================

export interface APY_APR_QUERY_reserve_price {
  __typename: "PriceOracleAsset";
  priceInEth: any;
}

export interface APY_APR_QUERY_reserve {
  __typename: "Reserve";
  symbol: string;
  price: APY_APR_QUERY_reserve_price;
  decimals: number;
}

export interface APY_APR_QUERY_reserves_price {
  __typename: "PriceOracleAsset";
  priceInEth: any;
}

export interface APY_APR_QUERY_reserves {
  __typename: "Reserve";
  symbol: string;
  underlyingAsset: any;
  price: APY_APR_QUERY_reserves_price;
  decimals: number;
  liquidityRate: any;
  stableBorrowRate: any;
  variableBorrowRate: any;
  aEmissionPerSecond: any;
  vEmissionPerSecond: any;
  sEmissionPerSecond: any;
  totalATokenSupply: any;
  totalCurrentVariableDebt: any;
}

export interface APY_APR_QUERY {
  reserve: APY_APR_QUERY_reserve | null;
  reserves: APY_APR_QUERY_reserves[];
}
