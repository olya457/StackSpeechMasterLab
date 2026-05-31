export type TabKey = 'train' | 'texts' | 'blog' | 'tips' | 'battle';

export type CategoryKey = 'public' | 'diction' | 'emotion';

export type Speed = 'slow' | 'medium' | 'fast';

export type TextSize = 'small' | 'medium' | 'large';

export type PracticeText = {
  id: string;
  category: CategoryKey;
  title: string;
  content: string;
  builtIn?: boolean;
};

export type BlogArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
};

export type TipCategory = 'voice' | 'confidence' | 'diction';

export type SpeakingTip = {
  id: string;
  category: TipCategory;
  title: string;
  body: string;
};
