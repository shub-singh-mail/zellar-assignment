import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import { saveCustomer } from '../../services/database/db';
import { AddCustomerScreen } from '../add-customer';

jest.mock('../../services/database/db', () => ({
  saveCustomer: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.spyOn(Alert, 'alert');

const mockGoBack = jest.fn();
const mockUpdateCustomerList = jest.fn();

const mockNavigation: any = {
  goBack: mockGoBack,
  setOptions: jest.fn(),
};

const mockRoute: any = {
  params: {
    updateCustomerList: mockUpdateCustomerList,
  },
};

const setup = () =>
  render(<AddCustomerScreen navigation={mockNavigation} route={mockRoute} />);

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders all input fields and buttons', () => {
  const { getByPlaceholderText, getByText } = setup();

  expect(getByText('New User')).toBeTruthy();
  expect(getByPlaceholderText('First name')).toBeTruthy();
  expect(getByPlaceholderText('Last name')).toBeTruthy();
  expect(getByPlaceholderText('Email')).toBeTruthy();
  expect(getByText('Admin')).toBeTruthy();
  expect(getByText('Manager')).toBeTruthy();
  expect(getByText('Create user')).toBeTruthy();
});

it('shows validation alert if email is invalid', async () => {
  const { getByPlaceholderText, getByText } = setup();

  fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
  fireEvent.press(getByText('Create user'));

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Validation failed',
      'Email is incorrect',
    );
  });

  expect(saveCustomer).not.toHaveBeenCalled();
});

it('creates user when valid data is entered', async () => {
  const { getByPlaceholderText, getByText } = setup();

  fireEvent.changeText(getByPlaceholderText('First name'), 'John');
  fireEvent.changeText(getByPlaceholderText('Last name'), 'Doe');
  fireEvent.changeText(getByPlaceholderText('Email'), 'john@test.com');

  fireEvent.press(getByText('Create user'));

  await waitFor(() => {
    expect(saveCustomer).toHaveBeenCalledTimes(1);
  });

  const savedUser = (saveCustomer as jest.Mock).mock.calls[0][0];

  expect(savedUser.name).toBe('John Doe');
  expect(savedUser.email).toBe('john@test.com');
  expect(savedUser.role).toBe('ADMIN');

  expect(mockUpdateCustomerList).toHaveBeenCalledWith(savedUser);
  expect(mockGoBack).toHaveBeenCalled();
});

it('changes role when Manager is selected', async () => {
  const { getByText, getByPlaceholderText } = setup();

  fireEvent.press(getByText('Manager'));

  fireEvent.changeText(getByPlaceholderText('Email'), 'manager@test.com');

  fireEvent.press(getByText('Create user'));

  await waitFor(() => {
    const savedUser = (saveCustomer as jest.Mock).mock.calls[0][0];
    expect(savedUser.role).toBe('MANAGER');
  });
});

it('shows error alert when save fails', async () => {
  (saveCustomer as jest.Mock).mockImplementation(() => {
    throw new Error('DB error');
  });

  const { getByPlaceholderText, getByText } = setup();

  fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
  fireEvent.press(getByText('Create user'));

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith('something went wrong');
  });
});

it('sets custom headerLeft button', () => {
  setup();
  expect(mockNavigation.setOptions).toHaveBeenCalled();
});
