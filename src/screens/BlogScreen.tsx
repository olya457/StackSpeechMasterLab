import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, Share, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Card} from '../components/Card';
import {Screen} from '../components/Screen';
import {TopBar} from '../components/TopBar';
import {blogArticles} from '../data/content';
import {loadFavorites, saveFavorites} from '../storage/favoritesStorage';
import {colors, radii} from '../styles/theme';
import type {BlogArticle} from '../types';

type BlogScreenProps = {
  onImmersiveChange: (immersive: boolean) => void;
};

export function BlogScreen({
  onImmersiveChange,
}: BlogScreenProps): React.JSX.Element {
  const [selected, setSelected] = useState<BlogArticle | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    onImmersiveChange(Boolean(selected));
    return () => onImmersiveChange(false);
  }, [onImmersiveChange, selected]);

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

  const orderedArticles = useMemo(() => {
    const favoriteRank = new Map(
      favorites.map((id, index) => [id, favorites.length - index]),
    );

    return [...blogArticles].sort((first, second) => {
      const firstRank = favoriteRank.get(first.id) ?? 0;
      const secondRank = favoriteRank.get(second.id) ?? 0;

      if (firstRank !== secondRank) {
        return secondRank - firstRank;
      }

      return (
        blogArticles.findIndex(article => article.id === first.id) -
        blogArticles.findIndex(article => article.id === second.id)
      );
    });
  }, [favorites]);

  const toggleFavorite = async (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter(item => item !== id)
      : [...favorites, id];
    setFavorites(next);
    await saveFavorites(next);
  };

  const shareArticle = async (article: BlogArticle) => {
    await Share.share({
      title: article.title,
      message: `${article.title}\n\n${article.excerpt}`,
    });
  };

  if (selected) {
    const favorite = favorites.includes(selected.id);
    return (
      <Screen scroll contentStyle={styles.detailContent}>
        <TopBar
          onBack={() => setSelected(null)}
          actions={[
            {
              icon: favorite ? '♥' : '♡',
              active: favorite,
              onPress: () => toggleFavorite(selected.id),
            },
            {icon: '⤴', onPress: () => shareArticle(selected)},
          ]}
        />
        <Text style={styles.detailTitle}>{selected.title}</Text>
        <Text style={styles.meta}>
          ◷ {selected.readTime} • {selected.date}
        </Text>
        <View style={styles.rule} />
        {selected.content.split('\n\n').map((paragraph, index) => (
          <Text
            key={`${selected.id}-${index}`}
            style={index === 2 ? styles.sectionTitle : styles.articleText}>
            {paragraph}
          </Text>
        ))}
      </Screen>
    );
  }

  return (
    <Screen scroll withNav>
      <Text style={styles.title}>Speaking Blog</Text>
      <Text style={styles.subtitle}>Expert insights and tips</Text>
      <View style={styles.list}>
        {orderedArticles.map(article => {
          const favorite = favorites.includes(article.id);
          return (
            <Pressable
              key={article.id}
              onPress={() => setSelected(article)}
              style={({pressed}) => pressed && styles.pressed}>
              <Card style={styles.articleCard}>
                {favorite ? (
                  <View style={styles.favoriteBadge}>
                    <Text style={styles.favoriteText}>★ Favorited</Text>
                  </View>
                ) : null}
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.excerpt}>{article.excerpt}</Text>
                <Text style={styles.meta}>
                  ◷ {article.readTime} • {article.date}
                </Text>
                <View style={styles.rule} />
                <View style={styles.cardActions}>
                  <AppButton
                    title={favorite ? 'Favorited' : 'Favorite'}
                    icon={favorite ? '♥' : '♡'}
                    variant={favorite ? 'primary' : 'ghost'}
                    onPress={() => toggleFavorite(article.id)}
                    style={styles.actionButton}
                  />
                  <AppButton
                    title="Share"
                    icon="⤴"
                    variant="ghost"
                    onPress={() => shareArticle(article)}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            </Pressable>
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
  list: {
    gap: 16,
    marginTop: 28,
  },
  articleCard: {
    padding: 20,
    gap: 14,
  },
  pressed: {
    opacity: 0.76,
  },
  favoriteBadge: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    backgroundColor: 'rgba(10, 134, 245, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  favoriteText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  articleTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '800',
  },
  excerpt: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  rule: {
    height: 1,
    backgroundColor: colors.border,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radii.md,
  },
  detailContent: {
    gap: 22,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: 16,
  },
  articleText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 27,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
  },
});
