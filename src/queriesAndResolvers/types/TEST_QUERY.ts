/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TEST_QUERY
// ====================================================

export interface TEST_QUERY_reserves_price {
  __typename: "PriceOracleAsset";
  id: string;
}

export interface TEST_QUERY_reserves {
  __typename: "Reserve";
  /**
   * Reserve address
   */
  id: string;
  name: string;
  price: TEST_QUERY_reserves_price;
  liquidityRate: any;
  variableBorrowRate: any;
  stableBorrowRate: any;
}

export interface TEST_QUERY {
  reserves: TEST_QUERY_reserves[];
}
