import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import {
  ListZellerCustomersData,
  ListZellerCustomersVars,
} from '../../types/user';

const GET_CUSTOMERS = gql`
  query ListZellerCustomers(
    $filter: TableZellerCustomerFilterInput
    $limit: Int
  ) {
    listZellerCustomers(filter: $filter, limit: $limit) {
      items {
        id
        name
        email
        role
      }
    }
  }
`;

export const useGetCustomers = (
  options: useLazyQuery.Options<
    ListZellerCustomersData,
    ListZellerCustomersVars
  > = {},
) =>
  useLazyQuery<ListZellerCustomersData, ListZellerCustomersVars>(
    GET_CUSTOMERS,
    options,
  );
