import { StyleSheet, TextProps, View } from 'react-native';
import MyText from '../Text';
import color from '../../constants/color';

type RadioButtonProps = {
  label: string;
  isSelected: boolean;
};

const RadioButton = ({ label, isSelected }: RadioButtonProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}>
        <View style={isSelected ? styles.innerCircle : undefined} />
      </View>
      <MyText style={styles.label}>{label}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.secondary,
  },
  innerCircle: {
    backgroundColor: color.secondary,
    flex: 1,
    margin: 3,
    borderRadius: 12,
  },
  label: {},
});

export default RadioButton;
