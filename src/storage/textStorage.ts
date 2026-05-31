import AsyncStorage from '@react-native-async-storage/async-storage';
import {initialTexts} from '../data/content';
import type {PracticeText} from '../types';

const TEXTS_KEY = 'speakpro.practiceTexts.v1';

export async function loadPracticeTexts(): Promise<PracticeText[]> {
  const raw = await AsyncStorage.getItem(TEXTS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(TEXTS_KEY, JSON.stringify(initialTexts));
    return initialTexts;
  }

  try {
    const parsed = JSON.parse(raw) as PracticeText[];
    return Array.isArray(parsed) ? parsed : initialTexts;
  } catch {
    return initialTexts;
  }
}

export async function savePracticeTexts(texts: PracticeText[]): Promise<void> {
  await AsyncStorage.setItem(TEXTS_KEY, JSON.stringify(texts));
}
