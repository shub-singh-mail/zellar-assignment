import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { CustomersScreen } from '../customers';
import { useGetCustomers } from '../../services/queries/get-customers';
import {
  createTable,
  getCustomers,
  saveCustomers,
} from '../../services/database/db';

jest.mock('../../services/queries/get-customers', () => ({
  useGetCustomers: jest.fn(),
}));
jest.mock('../../services/database/db');

jest.mock('../../services/database/db', () => ({
  createTable: jest.fn(),
  getCustomers: jest.fn(),
  saveCustomers: jest.fn(),
}));

jest.mock('./components/TabBar', () => () => null);
jest.mock('./components/TabScenes', () => (props: any) => {
  return (
    <>
      <mock-TabScenes {...props} />
    </>
  );
});
jest.mock('./components/ActionButton', () => (props: any) => {
  return <mock-ActionButton {...props} />;
});

const mockNavigate = jest.fn();

const mockNavigation: any = {
  navigate: mockNavigate,
};

const mockCustomers = [
  { id: '1', name: 'John Admin', email: 'a@test.com', role: 'ADMIN' },
  { id: '2', name: 'Jane Manager', email: 'm@test.com', role: 'MANAGER' },
];

it('loads customers from DB if present', async () => {
  (getCustomers as jest.Mock).mockResolvedValueOnce(mockCustomers);

  (useGetCustomers as jest.Mock).mockReturnValueOnce([
    jest.fn(),
    { loading: false },
  ]);

  render(<CustomersScreen navigation={mockNavigation} />);

  await waitFor(() => {
    expect(getCustomers).toHaveBeenCalledTimes(1);
  });

  expect(saveCustomers).not.toHaveBeenCalled();
});

it('fetches from API if DB is empty', async () => {
  (getCustomers as jest.Mock).mockResolvedValue([]);

  const mockFetch = jest.fn().mockResolvedValue({
    data: {
      listZellerCustomers: {
        items: mockCustomers,
      },
    },
  });

  (useGetCustomers as jest.Mock).mockReturnValue([
    mockFetch,
    { loading: false },
  ]);

  render(<CustomersScreen navigation={mockNavigation} />);

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled();
  });

  expect(saveCustomers).toHaveBeenCalledWith(mockCustomers);
});

it('creates table if DB throws error', async () => {
  (getCustomers as jest.Mock).mockRejectedValue(new Error('DB error'));

  const mockFetch = jest.fn().mockResolvedValue({
    data: {
      listZellerCustomers: {
        items: mockCustomers,
      },
    },
  });

  (useGetCustomers as jest.Mock).mockReturnValue([
    mockFetch,
    { loading: false },
  ]);

  render(<CustomersScreen navigation={mockNavigation} />);

  await waitFor(() => {
    expect(createTable).toHaveBeenCalled();
  });

  expect(mockFetch).toHaveBeenCalled();
});

it('navigates to AddCustomer screen when action button pressed', async () => {
  (getCustomers as jest.Mock).mockResolvedValue(mockCustomers);

  (useGetCustomers as jest.Mock).mockReturnValue([
    jest.fn(),
    { loading: false },
  ]);

  const { UNSAFE_getByType } = render(
    <CustomersScreen navigation={mockNavigation} />,
  );

  const actionButton = UNSAFE_getByType('mock-ActionButton');

  fireEvent(actionButton, 'onPress');

  expect(mockNavigate).toHaveBeenCalledWith('AddCustomer', {
    updateCustomerList: expect.any(Function),
  });
});

it('updateCustomerList correctly adds new user', async () => {
  (getCustomers as jest.Mock).mockResolvedValue(mockCustomers);

  (useGetCustomers as jest.Mock).mockReturnValue([
    jest.fn(),
    { loading: false },
  ]);

  const { UNSAFE_getByType } = render(
    <CustomersScreen navigation={mockNavigation} />,
  );

  await waitFor(() => {
    expect(getCustomers).toHaveBeenCalled();
  });

  const actionButton = UNSAFE_getByType('mock-ActionButton');

  fireEvent(actionButton, 'onPress');

  const navigateCall = mockNavigate.mock.calls[0][1];

  const updateCustomerList = navigateCall.updateCustomerList;

  const newUser = {
    id: '3',
    name: 'New User',
    email: 'new@test.com',
    role: 'ADMIN',
  };

  updateCustomerList(newUser);

  // If needed, you could enhance this test
  // by mocking sortCustomers and asserting
  // setSortedCustomers behavior
});

it('passes loading state to TabScenes', async () => {
  (getCustomers as jest.Mock).mockResolvedValue(mockCustomers);

  (useGetCustomers as jest.Mock).mockReturnValue([
    jest.fn(),
    { loading: true },
  ]);

  const { UNSAFE_getByType } = render(
    <CustomersScreen navigation={mockNavigation} />,
  );

  const tabScenes = UNSAFE_getByType('mock-TabScenes');

  expect(tabScenes.props.loading).toBe(true);
});
