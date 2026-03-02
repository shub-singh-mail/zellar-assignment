import { Animated, SectionList, StyleSheet, View } from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';

import MyText from '../../../../components/Text';
import UserListItem from '../../../../components/UserListItem';
import color from '../../../../constants/color';
import TABS from '../../tabs';

type TabScenesProps = {
  pagerViewRef: React.RefObject<PagerView | null>;
  all: any[];
  admin: any[];
  manager: any[];
  position: React.RefObject<Animated.Value>;
  loading: boolean;
  handleRefresh: () => void;
};

function TabScenes({
  pagerViewRef,
  all,
  admin,
  manager,
  position,
  loading,
  handleRefresh,
}: TabScenesProps) {
  const handlePageScroll = ({ nativeEvent }: PagerViewOnPageScrollEvent) => {
    position.current.setValue(nativeEvent.position + nativeEvent.offset);
  };
  return (
    <PagerView
      ref={pagerViewRef}
      style={styles.flex}
      initialPage={0}
      onPageScroll={handlePageScroll}
    >
      <Section
        key={TABS.ALL.key}
        sections={all}
        loading={loading}
        onRefresh={handleRefresh}
      />

      <Section
        key={TABS.ADMIN.key}
        sections={admin}
        loading={loading}
        onRefresh={handleRefresh}
      />

      <Section
        key={TABS.MANAGER.key}
        sections={manager}
        loading={loading}
        onRefresh={handleRefresh}
      />
    </PagerView>
  );
}

function Section({
  sections,
  loading,
  onRefresh,
}: {
  sections: any[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <SectionList
      sections={sections}
      refreshing={loading}
      onRefresh={onRefresh}
      renderSectionHeader={SectionHeader}
      renderItem={renderUser}
      ListEmptyComponent={loading ? null : ListEmptyComponent}
      style={styles.listStyle}
      stickySectionHeadersEnabled={false}
    />
  );
}

function ListEmptyComponent() {
  return (
    <View style={styles.flex}>
      <MyText style={styles.noCustomersText}>No customers found</MyText>
    </View>
  );
}

function renderUser({ item }) {
  return <UserListItem {...item} />;
}

function SectionHeader({ section }) {
  return <MyText style={styles.sectionHeader}>{section.title}</MyText>;
}

export default TabScenes;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  separator: {
    height: 10,
  },
  listStyle: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  noCustomersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: color.text,
  },
});
