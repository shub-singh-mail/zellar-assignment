import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MyText from '../../components/Text';
import RoleButton from '../../components/RoleButton';
import color from '../../constants/color';
import { saveCustomer } from '../../services/database/db';
import { AddCustomerScreenNavigationProp } from '../../types/navigation';
import { Role } from '../../types/user';
import containsOnlyAlphabets from '../../utils/contains-alphabets';

export const AddCustomerScreen = ({
  navigation,
  route: {
    params: { updateCustomerList },
  },
}: AddCustomerScreenNavigationProp) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('ADMIN');
  const bottom = useSafeAreaInsets().bottom;

  useEffect(() => {
    const back = () => (
      <MyText onPress={navigation.goBack} style={styles.bold}>
        X
      </MyText>
    );
    navigation.setOptions({
      headerLeft: back,
    });
  }, [navigation]);

  const handleCreateUser = () => {
    try {
      const trimmedEmail = email.trim();
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(trimmedEmail) === false) {
        Alert.alert('Validation failed', 'Email is incorrect');
        return;
      }
      if (trimmedFirstName.length === 0 || trimmedLastName.length === 0) {
        Alert.alert('Validation failed', 'Name cannot be empty');
        return;
      }
      if (
        !containsOnlyAlphabets(trimmedFirstName) ||
        !containsOnlyAlphabets(trimmedLastName)
      ) {
        Alert.alert('Validation failed', 'Name can only contain alphabets');
        return;
      }
      const user = {
        id: `${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email: trimmedEmail,
        role: role,
      };
      saveCustomer(user);
      updateCustomerList(user);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MyText style={styles.title}>New User</MyText>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="First name"
            placeholderTextColor={color.border}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            maxLength={20}
          />
          <TextInput
            placeholder="Last name"
            placeholderTextColor={color.border}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            maxLength={20}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={color.border}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <MyText style={styles.roleTitle}>User role</MyText>

          <View style={styles.role}>
            <RoleButton
              title="Admin"
              selected={role === 'ADMIN'}
              onPress={() => setRole('ADMIN')}
            />
            <RoleButton
              title="Manager"
              selected={role === 'MANAGER'}
              onPress={() => setRole('MANAGER')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { marginBottom: bottom + 20 }]}
          onPress={handleCreateUser}
        >
          <MyText style={{ color: color.background }}>Create user</MyText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    justifyContent: 'flex-start',
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  button: {
    height: 50,
    borderRadius: 25,
    width: '100%',
    backgroundColor: color.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '400',
  },
  inputContainer: { flex: 1, gap: 20 },
  input: {
    fontSize: 16,
    lineHeight: 18,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  role: {
    flexDirection: 'row',
    backgroundColor: color.lightBg,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bold: {
    fontWeight: '700',
  },
});
