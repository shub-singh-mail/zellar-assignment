import { StyleSheet, TouchableOpacity } from 'react-native';
import MyText from '../Text';
import color from '../../constants/color';

const RoleButton = ({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={selected ? styles.roleSelected : styles.roleUnselected}
    >
      <MyText
        style={selected ? styles.roleSelectedText : styles.roleUnselectedText}
      >
        {title}
      </MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roleSelected: {
    borderWidth: 1,
    width: '50%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color.secondary,
    backgroundColor: color.primary,
  },
  roleUnselected: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSelectedText: {
    color: color.secondary,
  },
  roleUnselectedText: {
    color: color.text,
  },
});

export default RoleButton;
