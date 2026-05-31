import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {colors, radii} from '../styles/theme';

const logo = require('../assets/speech-logo.png');

export function SplashScreen(): React.JSX.Element {
  const {width, height} = useWindowDimensions();
  const logoSize = Math.min(width - 32, height * 0.42, 360);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.backgroundBright}
      />
      <View style={styles.darkWash} />
      <View style={[styles.logoWrap, {width: logoSize, height: logoSize}]}>
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundBright,
  },
  darkWash: {
    ...StyleSheet.absoluteFillObject,
    top: '38%',
    backgroundColor: 'rgba(0, 28, 41, 0.5)',
  },
  logoWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowOffset: {width: 0, height: 18},
    shadowRadius: 30,
    elevation: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
