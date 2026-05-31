import {Platform} from 'react-native';

export const colors = {
  background: '#001c29',
  backgroundSoft: '#023345',
  backgroundBright: '#087fe5',
  card: '#063442',
  cardSoft: '#103f50',
  cardStrong: '#0a5fa8',
  border: 'rgba(142, 205, 230, 0.2)',
  borderStrong: 'rgba(255, 255, 255, 0.22)',
  text: '#f7fbff',
  muted: '#9fb5c4',
  dim: '#6f8797',
  primary: '#0a86f5',
  primaryDeep: '#075f9f',
  white: '#ffffff',
  danger: '#ff3156',
  shadow: '#00121a',
  success: '#24d783',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const layout = {
  horizontal: 24,
  navHeight: 74,
  navBottom: Platform.OS === 'android' ? 30 : 20,
  androidInset: Platform.OS === 'android' ? 30 : 0,
  topInset: Platform.OS === 'ios' ? 54 : 30,
  bottomContent: Platform.OS === 'android' ? 126 : 112,
};

export const typography = {
  title: 30,
  subtitle: 16,
  body: 16,
  small: 13,
};
