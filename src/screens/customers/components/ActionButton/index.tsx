import { StyleSheet, TouchableOpacity } from 'react-native';
import color from '../../../../constants/color';
import MyText from '../../../../components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ActionButton = ({ onPress }: { onPress: () => void }) => {
  const bottom = useSafeAreaInsets().bottom;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          bottom: bottom + 30,
        },
        styles.container,
      ]}
    >
      <MyText style={styles.text}>+</MyText>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.secondary,
    height: 60,
    width: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  text: {
    color: color.background,
    fontSize: 32,
  },
});
