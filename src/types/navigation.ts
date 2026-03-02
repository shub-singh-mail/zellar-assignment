import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from './user';

export type RootStackParamList = {
  Customers: undefined;
  AddCustomer: { updateCustomerList: (user: User) => void };
};

export type CustomersScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Customers'
>;

export type AddCustomerScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AddCustomer'
>;
