import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Card} from '../components/Card';
import {Screen} from '../components/Screen';
import {SegmentedControl} from '../components/SegmentedControl';
import {TopBar} from '../components/TopBar';
import {categories, initialTexts} from '../data/content';
import {colors, layout, radii} from '../styles/theme';
import type {CategoryKey, PracticeText, Speed, TextSize} from '../types';

type TrainView = 'home' | 'settings' | 'reader' | 'complete';

type TrainScreenProps = {
  onImmersiveChange: (immersive: boolean) => void;
};

const speedOptions: Array<{label: string; value: Speed}> = [
  {label: 'Slow', value: 'slow'},
  {label: 'Medium', value: 'medium'},
  {label: 'Fast', value: 'fast'},
];

const sizeOptions: Array<{label: string; value: TextSize}> = [
  {label: 'Small', value: 'small'},
  {label: 'Medium', value: 'medium'},
  {label: 'Large', value: 'large'},
];

const scrollSpeeds: Record<Speed, number> = {
  slow: 10,
  medium: 16,
  fast: 24,
};

const scrollInterval = 100;

const textFonts: Record<TextSize, number> = {
  small: 22,
  medium: 26,
  large: 31,
};

export function TrainScreen({
  onImmersiveChange,
}: TrainScreenProps): React.JSX.Element {
  const [view, setView] = useState<TrainView>('home');
  const [category, setCategory] = useState<CategoryKey>('public');
  const [speed, setSpeed] = useState<Speed>('medium');
  const [textSize, setTextSize] = useState<TextSize>('medium');

  const practiceText = useMemo(
    () =>
      initialTexts.find(item => item.category === category) ?? initialTexts[0],
    [category],
  );

  useEffect(() => {
    onImmersiveChange(view === 'reader' || view === 'complete');
    return () => onImmersiveChange(false);
  }, [onImmersiveChange, view]);

  if (view === 'settings') {
    return (
      <SettingsView
        category={category}
        speed={speed}
        textSize={textSize}
        onBack={() => setView('home')}
        onSpeedChange={setSpeed}
        onTextSizeChange={setTextSize}
        onStart={() => setView('reader')}
      />
    );
  }

  if (view === 'reader') {
    return (
      <ReaderView
        text={practiceText}
        speed={speed}
        textSize={textSize}
        onBack={() => setView('settings')}
        onComplete={() => setView('complete')}
      />
    );
  }

  if (view === 'complete') {
    return (
      <CompleteView
        text={practiceText}
        speed={speed}
        onAgain={() => setView('reader')}
        onHome={() => setView('home')}
      />
    );
  }

  return (
    <Screen scroll withNav>
      <Text style={styles.title}>Teleprompter Training</Text>
      <Text style={styles.subtitle}>Choose a category to start practicing</Text>
      <View style={styles.categoryList}>
        {categories.map(item => {
          const active = item.key === category;
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                setCategory(item.key);
                setView('settings');
              }}
              style={({pressed}) => [
                styles.categoryCard,
                active && styles.categoryActive,
                pressed && styles.pressed,
              ]}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>{item.label}</Text>
                <Text style={styles.categorySub}>Start practicing now</Text>
              </View>
              <Text style={styles.categoryTrail}>⌕</Text>
            </Pressable>
          );
        })}
      </View>
      <Card style={styles.howCard}>
        <Text style={styles.howTitle}>How it works</Text>
        {[
          'Select a category that matches your practice goal',
          'Choose your preferred text speed and size',
          'Read along as the text scrolls automatically',
          'Review your session results and track progress',
        ].map((item, index) => (
          <View key={item} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{item}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

type SettingsViewProps = {
  category: CategoryKey;
  speed: Speed;
  textSize: TextSize;
  onBack: () => void;
  onSpeedChange: (speed: Speed) => void;
  onTextSizeChange: (textSize: TextSize) => void;
  onStart: () => void;
};

function SettingsView({
  category,
  speed,
  textSize,
  onBack,
  onSpeedChange,
  onTextSizeChange,
  onStart,
}: SettingsViewProps): React.JSX.Element {
  const categoryInfo =
    categories.find(item => item.key === category) ?? categories[0];

  return (
    <Screen withNav contentStyle={styles.settingsContent}>
      <TopBar onBack={onBack} />
      <View style={styles.settingsHeader}>
        <Text style={styles.title}>Session Settings</Text>
        <Text style={styles.subtitle}>Customize your reading experience</Text>
      </View>
      <View style={styles.settingBlock}>
        <Text style={styles.settingLabel}>Category</Text>
        <Card style={styles.selectedCategory}>
          <Text style={styles.selectedIcon}>{categoryInfo.icon}</Text>
          <Text style={styles.selectedLabel}>{categoryInfo.label}</Text>
        </Card>
      </View>
      <View style={styles.settingBlock}>
        <Text style={styles.settingLabel}>Text Speed</Text>
        <SegmentedControl
          value={speed}
          options={speedOptions}
          onChange={onSpeedChange}
        />
      </View>
      <View style={styles.settingBlock}>
        <Text style={styles.settingLabel}>Text Size</Text>
        <SegmentedControl
          value={textSize}
          options={sizeOptions}
          onChange={onTextSizeChange}
        />
      </View>
      <View style={styles.settingsSpacer} />
      <AppButton title="Start Session" variant="light" onPress={onStart} />
    </Screen>
  );
}

type ReaderViewProps = {
  text: PracticeText;
  speed: Speed;
  textSize: TextSize;
  onBack: () => void;
  onComplete: () => void;
};

function ReaderView({
  text,
  speed,
  textSize,
  onBack,
  onComplete,
}: ReaderViewProps): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const [paused, setPaused] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const scrollYRef = useRef(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    scrollYRef.current = 0;
    completedRef.current = false;
    setPaused(false);
    setReachedEnd(false);
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, [text.id]);

  useEffect(() => {
    if (paused || reachedEnd || completedRef.current) {
      return;
    }

    const timer = setInterval(() => {
      const maxScroll = Math.max(contentHeight - viewportHeight, 0);
      if (maxScroll <= 12) {
        return;
      }

      const step = scrollSpeeds[speed] * (scrollInterval / 1000);
      const next = Math.min(scrollYRef.current + step, maxScroll);
      scrollYRef.current = next;
      scrollRef.current?.scrollTo({y: next, animated: false});

      if (next >= maxScroll - 1) {
        setReachedEnd(true);
        setPaused(true);
      }
    }, scrollInterval);

    return () => clearInterval(timer);
  }, [contentHeight, paused, reachedEnd, speed, viewportHeight]);

  const restart = () => {
    completedRef.current = false;
    setPaused(false);
    setReachedEnd(false);
    scrollYRef.current = 0;
    scrollRef.current?.scrollTo({y: 0, animated: false});
  };

  const togglePlayback = () => {
    if (reachedEnd) {
      restart();
      return;
    }

    setPaused(current => !current);
  };

  const completeManually = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const syncScrollPosition = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <Screen contentStyle={styles.readerContent}>
      <TopBar onBack={onBack} />
      <ScrollView
        ref={scrollRef}
        style={styles.readerFrame}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={syncScrollPosition}
        onContentSizeChange={(_, height) => setContentHeight(height)}
        onLayout={event => setViewportHeight(event.nativeEvent.layout.height)}
        contentContainerStyle={styles.readerScroll}>
        <Text style={[styles.readerText, {fontSize: textFonts[textSize]}]}>
          {text.content}
        </Text>
      </ScrollView>
      <View style={styles.readerControls}>
        <Pressable onPress={restart} style={styles.controlButton}>
          <Text style={styles.controlIcon}>↻</Text>
        </Pressable>
        <Pressable onPress={togglePlayback} style={styles.controlButton}>
          <Text style={styles.controlIcon}>{paused ? '▷' : 'Ⅱ'}</Text>
        </Pressable>
        <Pressable onPress={completeManually} style={styles.controlButton}>
          <Text style={styles.controlIcon}>✓</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

type CompleteViewProps = {
  text: PracticeText;
  speed: Speed;
  onAgain: () => void;
  onHome: () => void;
};

function CompleteView({
  text,
  speed,
  onAgain,
  onHome,
}: CompleteViewProps): React.JSX.Element {
  const wordCount = text.content.split(/\s+/).filter(Boolean).length;
  const minutes = speed === 'slow' ? 4 : speed === 'medium' ? 3 : 2;

  return (
    <Screen contentStyle={styles.completeContent}>
      <View style={styles.doneCircle}>
        <Text style={styles.doneIcon}>✓</Text>
      </View>
      <Text style={styles.completeTitle}>Session Complete!</Text>
      <Text style={styles.subtitle}>
        Great job! Keep practicing to improve your skills.
      </Text>
      <View style={styles.stats}>
        <Stat label="Session Duration" value={`${minutes}:45`} />
        <Stat label="Words Read" value={`${wordCount}`} />
        <Stat
          label="Avg. Speed"
          value={speed[0].toUpperCase() + speed.slice(1)}
        />
      </View>
      <View style={styles.completeSpacer} />
      <AppButton
        title="Practice Again"
        icon="↻"
        variant="light"
        onPress={onAgain}
      />
      <AppButton
        title="Back to Home"
        icon="⌂"
        variant="dark"
        onPress={onHome}
      />
    </Screen>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  categoryList: {
    gap: 16,
    marginTop: 28,
  },
  categoryCard: {
    minHeight: 92,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryActive: {
    backgroundColor: colors.cardStrong,
    borderColor: colors.cardStrong,
  },
  pressed: {
    opacity: 0.78,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  categorySub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 5,
  },
  categoryTrail: {
    color: colors.text,
    opacity: 0.8,
    fontSize: 26,
  },
  howCard: {
    marginTop: 28,
    padding: 20,
  },
  howTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(10, 134, 245, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  settingsContent: {
    gap: 28,
  },
  settingsHeader: {
    marginTop: 12,
  },
  settingBlock: {
    gap: 12,
  },
  settingLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  selectedIcon: {
    fontSize: 22,
  },
  selectedLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  settingsSpacer: {
    flex: 1,
  },
  readerContent: {
    paddingBottom: layout.navBottom + 24,
  },
  readerScroll: {
    paddingTop: 28,
    paddingBottom: 120,
  },
  readerFrame: {
    flex: 1,
  },
  readerText: {
    color: colors.text,
    lineHeight: 39,
    fontWeight: '500',
  },
  readerControls: {
    position: 'absolute',
    bottom: layout.navBottom + 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  completeContent: {
    alignItems: 'center',
    paddingTop: 92,
    gap: 12,
  },
  doneCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneIcon: {
    color: colors.text,
    fontSize: 54,
    fontWeight: '800',
  },
  completeTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
  },
  stats: {
    width: '100%',
    gap: 12,
    marginTop: 32,
  },
  statRow: {
    minHeight: 46,
    borderRadius: radii.md,
    backgroundColor: colors.cardSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  completeSpacer: {
    flex: 1,
  },
});
