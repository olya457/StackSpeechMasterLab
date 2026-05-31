import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors, radii} from '../styles/theme';

type Variant = 'primary' | 'light' | 'ghost' | 'dark';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  loading,
  style,
}: AppButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.base,
        styles[variant],
        (pressed || disabled) && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'light' ? colors.background : colors.white}
        />
      ) : null}
      {!loading && icon ? (
        <Text style={[styles.icon, variant === 'light' && styles.lightLabel]}>
          {icon}
        </Text>
      ) : null}
      {!loading ? (
        <Text style={[styles.label, variant === 'light' && styles.lightLabel]}>
          {title}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  light: {
    backgroundColor: colors.white,
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dark: {
    backgroundColor: colors.cardSoft,
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    color: colors.white,
    fontSize: 17,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  lightLabel: {
    color: colors.backgroundSoft,
  },
});
