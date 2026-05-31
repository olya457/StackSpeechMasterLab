import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radii} from '../styles/theme';

type Action = {
  icon: string;
  onPress: () => void;
  active?: boolean;
};

type TopBarProps = {
  title?: string;
  onBack?: () => void;
  actions?: Action[];
};

export function TopBar({
  title,
  onBack,
  actions = [],
}: TopBarProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.circle}>
            <Text style={styles.circleText}>‹</Text>
          </Pressable>
        ) : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      <View style={styles.actions}>
        {actions.map((action, index) => (
          <Pressable
            key={`${action.icon}-${index}`}
            onPress={action.onPress}
            style={[styles.circle, action.active && styles.activeCircle]}>
            <Text style={styles.actionText}>{action.icon}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  activeCircle: {
    backgroundColor: colors.primary,
  },
  circleText: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '700',
  },
  actionText: {
    color: colors.text,
    fontSize: 18,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    flexShrink: 1,
  },
});
