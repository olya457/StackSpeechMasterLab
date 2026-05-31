import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, radii} from '../styles/theme';

type ChipProps = {
  label: string;
  active?: boolean;
  icon?: string;
  onPress: () => void;
};

export function Chip({
  label,
  active,
  icon,
  onPress,
}: ChipProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.chip,
        active && styles.active,
        pressed && styles.pressed,
      ]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.035)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.white,
  },
});
