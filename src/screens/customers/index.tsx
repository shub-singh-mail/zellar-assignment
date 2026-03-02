import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import ActionButton from './components/ActionButton';
import TabBar from './components/TabBar';
import color from '../../constants/color';
import TabScenes from './components/TabScenes';
import TABS from './tabs';
import {
  createTable,
  getCustomers,
  saveCustomers,
} from '../../services/database/db';
import { useGetCustomers } from '../../services/queries/get-customers';
import sortCustomers from '../../utils/sort-customers';
import { CustomersScreenNavigationProp } from '../../types/navigation';
import { User } from '../../types/user';

type SectionState = { title: string; data: User[] };

export const CustomersScreen = ({
  navigation,
}: CustomersScreenNavigationProp) => {
  const [fetchCustomers, { loading }] = useGetCustomers();

  const [customers, setCustomers] = useState<{
    all: SectionState[];
    admin: SectionState[];
    manager: SectionState[];
  }>({
    all: [],
    admin: [],
    manager: [],
  });

  const setSortedCustomers = (customerList: User[]) => {
    setCustomers({
      all: Object.values(sortCustomers(customerList)),
      admin: Object.values(
        sortCustomers(customerList.filter(item => item.role === 'ADMIN') || []),
      ),
      manager: Object.values(
        sortCustomers(
          customerList.filter(item => item.role === 'MANAGER') || [],
        ),
      ),
    });
  };

  const pagerViewRef = useRef<PagerView>(null);
  const [selectedTab, setSelectedTab] = useState<keyof typeof TABS>(
    TABS.ALL.key,
  );
  const position = useRef(new Animated.Value(TABS[selectedTab].index));

  const fetchCustomersAndPersist = useCallback(async () => {
    const result = await fetchCustomers();
    if (result.data?.listZellerCustomers.items) {
      await saveCustomers(result.data.listZellerCustomers.items);
      setSortedCustomers(result.data.listZellerCustomers.items);
    }
  }, [fetchCustomers]);

  useEffect(() => {
    const getCustomersFromDB = async () => {
      try {
        const customersInDB = await getCustomers();
        if (customersInDB.length === 0) {
          fetchCustomersAndPersist();
          return;
        }
        setSortedCustomers(customersInDB);
      } catch {
        await createTable();
        fetchCustomersAndPersist();
      }
    };

    getCustomersFromDB();
  }, [fetchCustomers, fetchCustomersAndPersist]);

  const updateCustomerList = (user: User) => {
    setSortedCustomers([...customers.all.map(item => item.data).flat(), user]);
  };

  const handleCreateUser = () => {
    navigation.navigate('AddCustomer', { updateCustomerList });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TabBar
          pagerViewRef={pagerViewRef}
          position={position}
          changeTab={setSelectedTab}
        />
        <TabScenes
          pagerViewRef={pagerViewRef}
          position={position}
          all={customers.all}
          admin={customers.admin}
          manager={customers.manager}
          loading={loading}
          handleRefresh={fetchCustomersAndPersist}
        />
      </View>

      <ActionButton onPress={handleCreateUser} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    flex: 1,
    gap: 10,
  },
  pagerView: {
    flex: 1,
  },
});
