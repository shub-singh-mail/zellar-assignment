import { Animated, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import color from '../../../../constants/color';
import TabButton from '../../../../components/TabButton';
import TABS from '../../tabs';

type TabBarProps = {
  pagerViewRef: React.RefObject<PagerView | null>;
  changeTab: (tab: keyof typeof TABS) => void;
  position: React.RefObject<Animated.Value>;
};

const TabBar = ({ pagerViewRef, changeTab, position }: TabBarProps) => {
  return (
    <View style={styles.container}>
      {Object.values(TABS).map((tab, idx) => (
        <TabButton
          key={tab.key}
          idx={idx}
          position={position}
          tab={tab}
          onPress={() => {
            changeTab(tab.key);
            pagerViewRef.current?.setPage(idx);
          }}
        />
      ))}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: color.border,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
});
