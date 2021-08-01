/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: USER_RESERVE_QUERY
// ====================================================

export interface USER_RESERVE_QUERY_userReserves_reserve {
  __typename: "Reserve";
  symbol: string;
}

export interface USER_RESERVE_QUERY_userReserves_user {
  __typename: "User";
  /**
   * user address
   */
  id: string;
}

export interface USER_RESERVE_QUERY_userReserves {
  __typename: "UserReserve";
  scaledATokenBalance: any;
  reserve: USER_RESERVE_QUERY_userReserves_reserve;
  user: USER_RESERVE_QUERY_userReserves_user;
}

export interface USER_RESERVE_QUERY {
  userReserves: USER_RESERVE_QUERY_userReserves[];
}
