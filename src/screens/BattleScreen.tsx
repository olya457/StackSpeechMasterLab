import React, {useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Card} from '../components/Card';
import {Screen} from '../components/Screen';
import {SegmentedControl} from '../components/SegmentedControl';
import {TopBar} from '../components/TopBar';
import {battleText} from '../data/content';
import {colors, radii} from '../styles/theme';
import type {Speed, TextSize} from '../types';

type Flow =
  | 'intro'
  | 'ready'
  | 'setup'
  | 'read'
  | 'between'
  | 'vote'
  | 'results';

type BattleScreenProps = {
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

const fontSizeMap: Record<TextSize, number> = {
  small: 21,
  medium: 25,
  large: 30,
};

const players = ['Player 1', 'Player 2'];

export function BattleScreen({
  onImmersiveChange,
}: BattleScreenProps): React.JSX.Element {
  const [flow, setFlow] = useState<Flow>('intro');
  const [speed, setSpeed] = useState<Speed>('medium');
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [votes, setVotes] = useState<[number, number]>([0, 0]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    onImmersiveChange(flow !== 'intro' && flow !== 'ready');
    return () => onImmersiveChange(false);
  }, [flow, onImmersiveChange]);

  useEffect(() => {
    if (flow !== 'vote') {
      return;
    }
    if (timeLeft <= 0) {
      setFlow('results');
      return;
    }
    const timer = setInterval(() => setTimeLeft(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [flow, timeLeft]);

  const reset = () => {
    setCurrentPlayer(0);
    setVotes([0, 0]);
    setTimeLeft(30);
  };

  const startBattle = () => {
    reset();
    setFlow('read');
  };

  const finishReading = () => {
    if (currentPlayer === 0) {
      setFlow('between');
      return;
    }
    setTimeLeft(30);
    setFlow('vote');
  };

  const voteFor = (index: 0 | 1) => {
    setVotes(current => {
      const next: [number, number] = [...current] as [number, number];
      next[index] += 1;
      return next;
    });
  };

  const winnerIndex = votes[0] === votes[1] ? -1 : votes[0] > votes[1] ? 0 : 1;

  if (flow === 'ready') {
    return (
      <Screen withNav contentStyle={styles.readyContent}>
        <View style={styles.heroCup}>
          <Text style={styles.heroCupText}>🏆</Text>
        </View>
        <Text style={styles.readyTitle}>Ready for Battle?</Text>
        <Text style={styles.readyBody}>
          Get ready to compete! Make sure you have at least one audience member
          to vote after both players perform.
        </Text>
        <View style={styles.infoStack}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>👥</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Two Players Required</Text>
              <Text style={styles.infoBody}>
                Both players will use the same device
              </Text>
            </View>
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>30-Second Voting</Text>
              <Text style={styles.infoBody}>
                Audience votes after both players finish
              </Text>
            </View>
          </Card>
        </View>
        <View style={styles.readySpacer} />
        <AppButton
          title="Continue to Setup"
          variant="light"
          onPress={() => setFlow('setup')}
        />
      </Screen>
    );
  }

  if (flow === 'setup') {
    return (
      <Screen scroll contentStyle={styles.setupContent}>
        <TopBar onBack={() => setFlow('ready')} />
        <Text style={styles.title}>Battle Setup</Text>
        <Text style={styles.subtitle}>Configure your battle settings</Text>
        <View style={styles.formBlock}>
          <Text style={styles.label}>Players</Text>
          {players.map((player, index) => (
            <View key={player} style={styles.playerRow}>
              <Text style={styles.playerBadge}>{index + 1}</Text>
              <Text style={styles.playerLabel}>{player}</Text>
            </View>
          ))}
        </View>
        <View style={styles.formBlock}>
          <Text style={styles.label}>Text Speed</Text>
          <SegmentedControl
            value={speed}
            options={speedOptions}
            onChange={setSpeed}
          />
        </View>
        <View style={styles.formBlock}>
          <Text style={styles.label}>Text Size</Text>
          <SegmentedControl
            value={textSize}
            options={sizeOptions}
            onChange={setTextSize}
          />
        </View>
        <View style={styles.readySpacer} />
        <AppButton
          title="Start Battle"
          icon="▷"
          variant="light"
          onPress={startBattle}
        />
      </Screen>
    );
  }

  if (flow === 'read' || flow === 'between') {
    return (
      <Screen scroll contentStyle={styles.readContent}>
        <TopBar onBack={() => setFlow('setup')} />
        <Text style={styles.nowReading}>Now Reading</Text>
        <Text style={styles.readerName}>{players[currentPlayer]}</Text>
        <View style={styles.rule} />
        <Text style={[styles.readerText, {fontSize: fontSizeMap[textSize]}]}>
          {battleText}
        </Text>
        <AppButton
          title={`${players[currentPlayer]} Finished`}
          icon="✓"
          onPress={finishReading}
          style={styles.finishButton}
        />
        <Modal visible={flow === 'between'} transparent animationType="fade">
          <View style={styles.modalShade}>
            <Card style={styles.modalCard}>
              <Text style={styles.modalCheck}>✓</Text>
              <Text style={styles.modalTitle}>{players[0]} Finished!</Text>
              <Text style={styles.modalBody}>Time to vote for the winner.</Text>
              <AppButton
                title="Next Player"
                onPress={() => {
                  setCurrentPlayer(1);
                  setFlow('read');
                }}
              />
            </Card>
          </View>
        </Modal>
      </Screen>
    );
  }

  if (flow === 'vote') {
    return (
      <Screen contentStyle={styles.voteContent}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerIcon}>⏱️</Text>
        </View>
        <Text style={styles.timerText}>{timeLeft}s</Text>
        <Text style={styles.timerSub}>Time remaining to vote</Text>
        <Text style={styles.voteTitle}>Who was the better speaker?</Text>
        <View style={styles.voteList}>
          {[0, 1].map(index => (
            <Pressable
              key={players[index]}
              onPress={() => voteFor(index as 0 | 1)}
              style={({pressed}) => [
                styles.voteCard,
                pressed && styles.pressed,
              ]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.voteNameWrap}>
                <Text style={styles.voteName}>{players[index]}</Text>
                <Text style={styles.votePlayer}>Player {index + 1}</Text>
              </View>
              <View style={styles.voteBadge}>
                <Text style={styles.voteBadgeText}>{votes[index]}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text style={styles.voteNote}>
          Audience members can vote multiple times
        </Text>
        <View style={styles.readySpacer} />
        <AppButton
          title="Finish Voting"
          variant="light"
          onPress={() => setFlow('results')}
        />
      </Screen>
    );
  }

  if (flow === 'results') {
    const totalVotes = votes[0] + votes[1];
    const title =
      winnerIndex === -1 ? 'It’s a Tie!' : `${players[winnerIndex]} Wins!`;

    return (
      <Screen contentStyle={styles.resultsContent}>
        <View style={styles.heroCupSmall}>
          <Text style={styles.heroCupSmallText}>🏆</Text>
        </View>
        <Text style={styles.readyTitle}>{title}</Text>
        <Text style={styles.readyBody}>Congratulations on the victory!</Text>
        <View style={styles.resultList}>
          {[0, 1].map(index => {
            const percent = totalVotes ? (votes[index] / totalVotes) * 100 : 0;
            return (
              <View key={players[index]} style={styles.resultItem}>
                <View style={styles.resultTop}>
                  <Text style={styles.resultName}>{players[index]}</Text>
                  <Text style={styles.resultVotes}>{votes[index]}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, {width: `${percent}%`}]} />
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.voteNote}>Total Votes: {totalVotes}</Text>
        <View style={styles.readySpacer} />
        <AppButton
          title="Rematch"
          icon="↻"
          variant="light"
          onPress={() => {
            reset();
            setFlow('setup');
          }}
        />
        <AppButton
          title="Back to Home"
          icon="⌂"
          variant="dark"
          onPress={() => {
            reset();
            setFlow('intro');
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll withNav>
      <Text style={styles.title}>Speaker Battle</Text>
      <Text style={styles.subtitle}>
        Challenge your friends to a speaking duel
      </Text>
      <View style={styles.bigTrophy}>
        <Text style={styles.bigTrophyText}>🏆</Text>
      </View>
      <View style={styles.features}>
        <Feature
          icon="👥"
          title="2-Player Mode"
          body="Challenge a friend in a local speaking competition"
        />
        <Feature
          icon="⚡"
          title="Live Voting"
          body="Audience members vote on the best performance in real-time"
        />
        <Feature
          icon="🏆"
          title="Instant Results"
          body="See who won right after the voting period ends"
        />
      </View>
      <Card style={styles.howCard}>
        <Text style={styles.howTitle}>How to Play</Text>
        {[
          'Enter player names and choose settings',
          'Each player takes turns reading the same text',
          'Audience votes for the best performance',
          'Winner is revealed after voting ends',
        ].map((item, index) => (
          <Text key={item} style={styles.howLine}>
            {index + 1}. {item}
          </Text>
        ))}
      </Card>
      <AppButton
        title="Start Battle"
        onPress={() => setFlow('ready')}
        style={styles.start}
      />
    </Screen>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}): React.JSX.Element {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Text>{icon}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
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
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  bigTrophy: {
    height: 180,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    borderColor: colors.border,
    borderWidth: 1,
  },
  bigTrophyText: {
    fontSize: 72,
  },
  features: {
    gap: 15,
    marginTop: 24,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(10, 134, 245, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  featureBody: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  howCard: {
    marginTop: 24,
    padding: 18,
  },
  howTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  howLine: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
  },
  start: {
    marginTop: 22,
  },
  readyContent: {
    alignItems: 'center',
    paddingTop: 66,
    gap: 14,
  },
  heroCup: {
    width: 116,
    height: 116,
    borderRadius: radii.xl,
    backgroundColor: colors.cardStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCupText: {
    fontSize: 58,
  },
  readyTitle: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  readyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  infoStack: {
    width: '100%',
    gap: 12,
    marginTop: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 13,
  },
  infoBody: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  readySpacer: {
    flex: 1,
  },
  setupContent: {
    gap: 20,
  },
  formBlock: {
    gap: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  playerRow: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: colors.cardSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  playerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
  playerLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  readContent: {
    gap: 18,
  },
  nowReading: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  readerName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  rule: {
    height: 1,
    backgroundColor: colors.border,
  },
  readerText: {
    color: colors.text,
    lineHeight: 38,
    fontWeight: '500',
  },
  finishButton: {
    marginTop: 12,
  },
  modalShade: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    padding: 28,
  },
  modalCard: {
    width: '100%',
    maxWidth: 300,
    padding: 22,
    alignItems: 'center',
    gap: 12,
  },
  modalCheck: {
    color: colors.success,
    fontSize: 44,
    fontWeight: '800',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  modalBody: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 8,
  },
  voteContent: {
    alignItems: 'center',
    paddingTop: 52,
    gap: 10,
  },
  timerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerIcon: {
    fontSize: 22,
  },
  timerText: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '800',
  },
  timerSub: {
    color: colors.muted,
    fontSize: 12,
  },
  voteTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginTop: 36,
  },
  voteList: {
    width: '100%',
    gap: 12,
  },
  voteCard: {
    minHeight: 60,
    borderRadius: radii.md,
    backgroundColor: colors.cardSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.75,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
  },
  voteNameWrap: {
    flex: 1,
  },
  voteName: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  votePlayer: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  voteBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  voteBadgeText: {
    color: colors.text,
    fontWeight: '800',
  },
  voteNote: {
    color: colors.dim,
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
  },
  resultsContent: {
    alignItems: 'center',
    paddingTop: 58,
    gap: 12,
  },
  heroCupSmall: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCupSmallText: {
    fontSize: 52,
  },
  resultList: {
    width: '100%',
    gap: 12,
    marginTop: 28,
  },
  resultItem: {
    borderRadius: radii.md,
    backgroundColor: colors.cardSoft,
    padding: 14,
    gap: 10,
  },
  resultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultName: {
    color: colors.text,
    fontWeight: '800',
  },
  resultVotes: {
    color: colors.text,
    fontWeight: '800',
  },
  track: {
    height: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.white,
  },
});
