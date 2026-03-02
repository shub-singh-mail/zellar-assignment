import { StyleSheet, View } from 'react-native';
import MyText from '../../components/Text';
import color from '../../constants/color';

type UserListItemProps = {
  name: string;
  type: string;
};

const UserListItem: React.FC<UserListItemProps> = ({ name, type }) => {
  return (
    <View style={styles.container}>
      <View style={styles.initialContainer}>
        <MyText style={styles.initial}>{name.charAt(0)}</MyText>
      </View>

      <MyText style={styles.name}>{name}</MyText>
    </View>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    gap: 10,
  },
  initialContainer: {
    height: 40,
    width: 40,
    borderRadius: 6,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: color.secondary,
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    color: color.text,
  },
  type: {
    fontSize: 13,
    color: color.textSecondary,
  },
});
