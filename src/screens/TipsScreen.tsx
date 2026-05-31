import React, {useMemo, useState} from 'react';
import {ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Card} from '../components/Card';
import {Chip} from '../components/Chip';
import {Screen} from '../components/Screen';
import {speakingTips, tipCategories} from '../data/content';
import {colors} from '../styles/theme';
import type {SpeakingTip, TipCategory} from '../types';

type FilterKey = TipCategory | 'all';

export function TipsScreen(): React.JSX.Element {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [randomTip, setRandomTip] = useState<SpeakingTip | null>(null);

  const visibleTips = useMemo(() => {
    if (filter === 'all') {
      return speakingTips;
    }
    return speakingTips.filter(tip => tip.category === filter);
  }, [filter]);

  const chooseRandom = () => {
    const next = speakingTips[Math.floor(Math.random() * speakingTips.length)];
    setRandomTip(next);
  };

  const shareTip = async (tip: SpeakingTip) => {
    await Share.share({
      title: tip.title,
      message: `${tip.title}\n\n${tip.body}`,
    });
  };

  return (
    <Screen scroll withNav>
      <Text style={styles.title}>Speaking Tips</Text>
      <Text style={styles.subtitle}>Expert advice for better speaking</Text>
      <AppButton
        title="Get Random Tip"
        icon="⌘"
        onPress={chooseRandom}
        style={styles.randomButton}
      />
      {randomTip ? (
        <Card style={styles.randomCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIconCircle}>
              <Text style={styles.tipIcon}>✦</Text>
            </View>
            <View style={styles.tipTextWrap}>
              <Text style={styles.tipTitle}>{randomTip.title}</Text>
              <Text style={styles.tipBody}>{randomTip.body}</Text>
            </View>
          </View>
          <AppButton
            title="Share This Tip"
            icon="⤴"
            variant="dark"
            onPress={() => shareTip(randomTip)}
            style={styles.shareButton}
          />
        </Card>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        <Chip
          label="All Tips"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        {tipCategories.map(category => (
          <Chip
            key={category.key}
            label={category.label}
            icon={category.icon}
            active={filter === category.key}
            onPress={() => setFilter(category.key)}
          />
        ))}
      </ScrollView>
      <View style={styles.list}>
        {visibleTips.map(tip => {
          const category = tipCategories.find(
            item => item.key === tip.category,
          );
          return (
            <Card key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIconCircle}>
                  <Text style={styles.tipIcon}>{category?.icon}</Text>
                </View>
                <View style={styles.tipTextWrap}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipBody}>{tip.body}</Text>
                </View>
              </View>
              <AppButton
                title="Share"
                icon="⤴"
                variant="ghost"
                onPress={() => shareTip(tip)}
                style={styles.shareButton}
              />
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 8,
  },
  randomButton: {
    marginTop: 28,
  },
  randomCard: {
    padding: 20,
    gap: 16,
    marginTop: 26,
    backgroundColor: 'rgba(3, 52, 66, 0.72)',
    borderColor: 'rgba(10, 134, 245, 0.14)',
  },
  chips: {
    gap: 10,
    paddingVertical: 30,
  },
  list: {
    gap: 14,
  },
  tipCard: {
    padding: 18,
    gap: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  tipIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipTextWrap: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '800',
  },
  tipBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  shareButton: {
    minHeight: 42,
  },
});
