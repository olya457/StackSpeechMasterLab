import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomNavigation} from '../components/BottomNavigation';
import {SplashScreen} from '../screens/SplashScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {TrainScreen} from '../screens/TrainScreen';
import {TextsScreen} from '../screens/TextsScreen';
import {BlogScreen} from '../screens/BlogScreen';
import {TipsScreen} from '../screens/TipsScreen';
import {BattleScreen} from '../screens/BattleScreen';
import {colors} from '../styles/theme';
import type {TabKey} from '../types';

type Stage = 'splash' | 'onboarding' | 'main';

export function AppNavigator(): React.JSX.Element {
  const [stage, setStage] = useState<Stage>('splash');
  const [activeTab, setActiveTab] = useState<TabKey>('train');
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStage('onboarding'), 5000);
    return () => clearTimeout(timer);
  }, []);

  const changeTab = (tab: TabKey) => {
    setImmersive(false);
    setActiveTab(tab);
  };

  if (stage === 'splash') {
    return <SplashScreen />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onDone={() => setStage('main')} />;
  }

  return (
    <View style={styles.root}>
      {activeTab === 'train' ? (
        <TrainScreen onImmersiveChange={setImmersive} />
      ) : null}
      {activeTab === 'texts' ? (
        <TextsScreen onImmersiveChange={setImmersive} />
      ) : null}
      {activeTab === 'blog' ? (
        <BlogScreen onImmersiveChange={setImmersive} />
      ) : null}
      {activeTab === 'tips' ? <TipsScreen /> : null}
      {activeTab === 'battle' ? (
        <BattleScreen onImmersiveChange={setImmersive} />
      ) : null}
      {!immersive ? (
        <BottomNavigation activeTab={activeTab} onChange={changeTab} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
