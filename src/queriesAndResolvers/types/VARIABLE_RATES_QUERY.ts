/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: VARIABLE_RATES_QUERY
// ====================================================

export interface VARIABLE_RATES_QUERY_reserves_paramsHistory {
  __typename: "ReserveParamsHistoryItem";
  timestamp: number;
  liquidityIndex: any;
  variableBorrowIndex: any;
}

export interface VARIABLE_RATES_QUERY_reserves {
  __typename: "Reserve";
  symbol: string;
  lastUpdateTimestamp: number;
  liquidityIndex: any;
  variableBorrowIndex: any;
  paramsHistory: VARIABLE_RATES_QUERY_reserves_paramsHistory[];
}

export interface VARIABLE_RATES_QUERY {
  reserves: VARIABLE_RATES_QUERY_reserves[];
}
