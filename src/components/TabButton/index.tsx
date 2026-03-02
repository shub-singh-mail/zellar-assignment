import {
  Animated,
  I18nManager,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import MyText from '../Text';
import color from '../../constants/color';

type TabsProps = {
  onPress: () => void;
  idx: number;
  tab: {
    key: string;
    label: string;
    index: number;
  };
  position: React.RefObject<Animated.Value>;
};

const TabButton = ({ onPress, idx, tab, position }: TabsProps) => {
  const window = useWindowDimensions();
  const calculatedTranslateX = Animated.multiply(
    position.current.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 2].map(i => {
        const diff = i - idx;
        const x = (window.width - 40) / 3;
        return diff > 0 ? x : diff < 0 ? -x : 0;
      }),
    }),
    I18nManager.isRTL ? -1 : 1,
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      key={tab.key}
      onPress={onPress}
      style={styles.container}
    >
      <MyText style={styles.unselectedText}>{tab.label}</MyText>
      <Animated.View
        style={[
          styles.selectedTabContainer,
          {
            transform: [{ translateX: calculatedTranslateX }],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [
              { translateX: Animated.multiply(calculatedTranslateX, -1) },
            ],
          }}
        >
          <MyText style={styles.selectedText}>{tab.label}</MyText>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: color.border,
  },
  selectedTabContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.secondary,
  },
  selectedText: { color: color.secondary },
  unselectedText: { color: color.text },
});
