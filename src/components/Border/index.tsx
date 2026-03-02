import { StyleSheet, View, ViewProps } from 'react-native';

const Border = (props: ViewProps) => (
  <View style={styles.container} {...props} />
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
});

export default Border;
