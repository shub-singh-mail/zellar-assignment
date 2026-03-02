export type Role = 'ADMIN' | 'MANAGER';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type ListZellerCustomersData = {
  listZellerCustomers: {
    items: User[];
  };
};

export type TableZellerCustomerFilterInput = {
  name?: { contains?: string };
  email?: { contains?: string };
  role?: { eq?: string };
};

export type ListZellerCustomersVars = {
  filter?: TableZellerCustomerFilterInput;
  limit?: number;
};
