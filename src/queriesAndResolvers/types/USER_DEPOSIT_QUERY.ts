/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: USER_DEPOSIT_QUERY
// ====================================================

export interface USER_DEPOSIT_QUERY_deposits_userReserve {
  __typename: "UserReserve";
  currentATokenBalance: any;
}

export interface USER_DEPOSIT_QUERY_deposits_reserve {
  __typename: "Reserve";
  symbol: string;
  variableBorrowRate: any;
}

export interface USER_DEPOSIT_QUERY_deposits {
  __typename: "Deposit";
  userReserve: USER_DEPOSIT_QUERY_deposits_userReserve;
  reserve: USER_DEPOSIT_QUERY_deposits_reserve;
}

export interface USER_DEPOSIT_QUERY {
  deposits: USER_DEPOSIT_QUERY_deposits[];
}
