import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Screen} from '../components/Screen';
import {onboardingPages} from '../data/content';
import {colors, radii} from '../styles/theme';

type OnboardingScreenProps = {
  onDone: () => void;
};

export function OnboardingScreen({
  onDone,
}: OnboardingScreenProps): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const page = onboardingPages[index];
  const last = index === onboardingPages.length - 1;
  const {width, height} = useWindowDimensions();
  const artSize = Math.min(width * 0.58, height * 0.22, 170);

  const next = () => {
    if (last) {
      onDone();
      return;
    }
    setIndex(current => current + 1);
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.center}>
        <View style={[styles.art, {width: artSize, height: artSize}]}>
          <Text style={[styles.artIcon, {fontSize: artSize * 0.42}]}>
            {page.icon}
          </Text>
        </View>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingPages.map((_, dotIndex) => (
            <Pressable
              key={dotIndex}
              onPress={() => setIndex(dotIndex)}
              style={[styles.dot, dotIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        {last ? (
          <AppButton title="Get Started" variant="light" onPress={onDone} />
        ) : (
          <View style={styles.row}>
            <AppButton
              title="Skip"
              variant="ghost"
              onPress={onDone}
              style={styles.half}
            />
            <AppButton
              title="Next"
              icon="›"
              variant="light"
              onPress={next}
              style={styles.half}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    paddingBottom: 34,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  art: {
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
  },
  artIcon: {
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 360,
  },
  footer: {
    gap: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  activeDot: {
    width: 28,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
