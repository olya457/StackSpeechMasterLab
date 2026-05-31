import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radii} from '../styles/theme';

type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>): React.JSX.Element {
  return (
    <View style={styles.row}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({pressed}) => [
              styles.item,
              active && styles.active,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.label, active && styles.activeLabel]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  item: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardSoft,
    paddingHorizontal: 10,
  },
  active: {
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  activeLabel: {
    color: colors.backgroundSoft,
  },
});
