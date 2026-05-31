import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {tabs} from '../data/content';
import {colors, layout, radii} from '../styles/theme';
import type {TabKey} from '../types';

type BottomNavigationProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomNavigation({
  activeTab,
  onChange,
}: BottomNavigationProps): React.JSX.Element {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.bar}>
        {tabs.map(tab => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={({pressed}) => [styles.item, pressed && styles.pressed]}>
              <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
                <Text style={styles.icon}>{tab.icon}</Text>
              </View>
              <Text style={[styles.label, active && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: layout.navBottom,
  },
  bar: {
    height: layout.navHeight,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(3, 43, 55, 0.96)',
    borderColor: colors.borderStrong,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.34,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 22,
    elevation: 10,
  },
  item: {
    width: 62,
    alignItems: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: 'rgba(10, 134, 245, 0.26)',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.primary,
  },
});
