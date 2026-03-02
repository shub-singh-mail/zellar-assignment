import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomersScreen } from '../screens/customers';
import { AddCustomerScreen } from '../screens/add-customer';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Customers"
          component={CustomersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCustomer"
          component={AddCustomerScreen}
          options={{
            presentation: 'fullScreenModal',
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
