import { Text, StyleSheet, TextProps } from 'react-native';

const MyText = ({ children, style, ...props }: TextProps) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});

export default MyText;
