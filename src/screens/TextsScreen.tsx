import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import {AppButton} from '../components/AppButton';
import {Card} from '../components/Card';
import {Chip} from '../components/Chip';
import {Screen} from '../components/Screen';
import {TopBar} from '../components/TopBar';
import {categories} from '../data/content';
import {loadPracticeTexts, savePracticeTexts} from '../storage/textStorage';
import {colors, layout, radii} from '../styles/theme';
import type {CategoryKey, PracticeText} from '../types';

type FilterKey = CategoryKey | 'all';

type TextsScreenProps = {
  onImmersiveChange: (immersive: boolean) => void;
};

type Draft = {
  id?: string;
  category: CategoryKey;
  title: string;
  content: string;
  builtIn?: boolean;
};

type FormField = 'title' | 'content';

type TextSelection = {
  start: number;
  end: number;
};

type KeyboardLanguage = 'en' | 'ru';

type KeyboardMode = 'letters' | 'numbers';

type KeyboardKey = {
  label: string;
  value?: string;
  action?: 'shift' | 'backspace' | 'space' | 'enter' | 'language' | 'mode';
  flex?: number;
};

const keyboardLetters: Record<KeyboardLanguage, KeyboardKey[][]> = {
  en: [
    'qwertyuiop'.split('').map(value => ({label: value, value})),
    'asdfghjkl'.split('').map(value => ({label: value, value})),
    [
      {label: '⇧', action: 'shift', flex: 1.2},
      ...'zxcvbnm'.split('').map(value => ({label: value, value})),
      {label: '⌫', action: 'backspace', flex: 1.2},
    ],
  ],
  ru: [
    'йцукенгшщзх'.split('').map(value => ({label: value, value})),
    'фывапролджэ'.split('').map(value => ({label: value, value})),
    [
      {label: '⇧', action: 'shift', flex: 1.2},
      ...'ячсмитьбю'.split('').map(value => ({label: value, value})),
      {label: '⌫', action: 'backspace', flex: 1.2},
    ],
  ],
};

const keyboardNumbers: KeyboardKey[][] = [
  '1234567890'.split('').map(value => ({label: value, value})),
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'].map(value => ({
    label: value,
    value,
  })),
  ['.', ',', '?', '!', "'", '+', '='].map(value => ({label: value, value})),
];

export function TextsScreen({
  onImmersiveChange,
}: TextsScreenProps): React.JSX.Element {
  const [texts, setTexts] = useState<PracticeText[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedText, setSelectedText] = useState<PracticeText | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onImmersiveChange(Boolean(draft || selectedText));
    return () => onImmersiveChange(false);
  }, [draft, onImmersiveChange, selectedText]);

  useEffect(() => {
    let mounted = true;
    loadPracticeTexts()
      .then(items => {
        if (mounted) {
          setTexts(items);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleTexts = useMemo(() => {
    if (filter === 'all') {
      return texts;
    }
    return texts.filter(item => item.category === filter);
  }, [filter, texts]);

  const changeFilter = (next: FilterKey) => {
    setFilter(next);
  };

  const persist = async (next: PracticeText[]) => {
    setTexts(next);
    await savePracticeTexts(next);
  };

  const openNew = () => {
    setDraft({category: 'public', title: '', content: ''});
  };

  const openText = (item: PracticeText) => {
    setSelectedText(item);
  };

  const openEdit = (item: PracticeText) => {
    setDraft({...item});
  };

  const removeCustomText = (item: PracticeText) => {
    Alert.alert('Delete text', `Delete "${item.title}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => persist(texts.filter(text => text.id !== item.id)),
      },
    ]);
  };

  const saveDraft = async () => {
    if (!draft) {
      return;
    }

    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) {
      Alert.alert('Missing text', 'Add a title and content before saving.');
      return;
    }

    const nextItem: PracticeText = {
      id: draft.id ?? `custom-${Date.now()}`,
      title,
      content,
      category: draft.category,
      builtIn: draft.builtIn,
    };

    const next = draft.id
      ? texts.map(item => (item.id === draft.id ? nextItem : item))
      : [nextItem, ...texts];

    await persist(next);
    setDraft(null);
  };

  if (selectedText) {
    return (
      <TextDetail text={selectedText} onBack={() => setSelectedText(null)} />
    );
  }

  if (draft) {
    return (
      <TextForm
        draft={draft}
        onDraftChange={setDraft}
        onSave={saveDraft}
        onBack={() => setDraft(null)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <Screen scroll withNav>
        <Text style={styles.title}>Text Workshop</Text>
        <Text style={styles.subtitle}>Manage your practice texts</Text>
        <ScrollView
          horizontal
          style={styles.chipScroller}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <Chip
            label="All Texts"
            active={filter === 'all'}
            onPress={() => changeFilter('all')}
          />
          {categories.map(item => (
            <Chip
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={filter === item.key}
              onPress={() => changeFilter(item.key)}
            />
          ))}
        </ScrollView>
        <View style={styles.list}>
          {loading ? <Text style={styles.empty}>Loading texts...</Text> : null}
          {!loading && visibleTexts.length === 0 ? (
            <Text style={styles.empty}>No texts in this category yet.</Text>
          ) : null}
          {visibleTexts.map(item => {
            const category = categories.find(cat => cat.key === item.category);
            const custom = !item.builtIn;
            return (
              <Card key={item.id} style={styles.textCard}>
                <View style={styles.textRow}>
                  <Text style={styles.textIcon}>{category?.icon}</Text>
                  <View style={styles.textMain}>
                    <Text style={styles.textTitle}>{item.title}</Text>
                    <Text style={styles.textExcerpt} numberOfLines={2}>
                      {item.content}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {item.builtIn ? 'Built-in' : 'Saved'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => openText(item)}
                      style={styles.iconButton}>
                      <Text style={styles.actionText}>📖</Text>
                    </Pressable>
                    {custom ? (
                      <>
                        <Pressable
                          onPress={() => openEdit(item)}
                          style={styles.iconButton}>
                          <Text style={styles.editText}>✎</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => removeCustomText(item)}
                          style={styles.iconButton}>
                          <Text style={styles.deleteText}>⌫</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </Screen>
      <Pressable onPress={openNew} style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

type TextFormProps = {
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  onSave: () => void;
  onBack: () => void;
};

function TextForm({
  draft,
  onDraftChange,
  onSave,
  onBack,
}: TextFormProps): React.JSX.Element {
  const [activeField, setActiveField] = useState<FormField>('title');
  const [language, setLanguage] = useState<KeyboardLanguage>('en');
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [shifted, setShifted] = useState(false);
  const [selection, setSelection] = useState<Record<FormField, TextSelection>>({
    title: {start: draft.title.length, end: draft.title.length},
    content: {start: draft.content.length, end: draft.content.length},
  });

  const updateSelection = (
    field: FormField,
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    setSelection(current => ({
      ...current,
      [field]: event.nativeEvent.selection,
    }));
  };

  const updateField = (
    field: FormField,
    value: string,
    nextSelection?: TextSelection,
  ) => {
    onDraftChange({...draft, [field]: value});
    if (nextSelection) {
      setSelection(current => ({...current, [field]: nextSelection}));
    }
  };

  const insertValue = (value: string) => {
    const fieldValue = draft[activeField];
    const fieldSelection = selection[activeField];
    const start = Math.min(fieldSelection.start, fieldValue.length);
    const end = Math.min(fieldSelection.end, fieldValue.length);
    const nextValue =
      fieldValue.slice(0, start) + value + fieldValue.slice(end);
    const nextPosition = start + value.length;
    updateField(activeField, nextValue, {
      start: nextPosition,
      end: nextPosition,
    });
    if (shifted && mode === 'letters') {
      setShifted(false);
    }
  };

  const removeValue = () => {
    const fieldValue = draft[activeField];
    const fieldSelection = selection[activeField];
    const start = Math.min(fieldSelection.start, fieldValue.length);
    const end = Math.min(fieldSelection.end, fieldValue.length);

    if (start !== end) {
      const nextValue = fieldValue.slice(0, start) + fieldValue.slice(end);
      updateField(activeField, nextValue, {start, end: start});
      return;
    }

    if (start === 0) {
      return;
    }

    const nextPosition = start - 1;
    const nextValue =
      fieldValue.slice(0, nextPosition) + fieldValue.slice(start);
    updateField(activeField, nextValue, {
      start: nextPosition,
      end: nextPosition,
    });
  };

  const handleEnter = () => {
    if (activeField === 'title') {
      setActiveField('content');
      setSelection(current => ({
        ...current,
        content: {start: draft.content.length, end: draft.content.length},
      }));
      return;
    }

    insertValue('\n');
  };

  const handleKeyboardPress = (key: KeyboardKey) => {
    if (key.action === 'shift') {
      setShifted(current => !current);
      return;
    }

    if (key.action === 'backspace') {
      removeValue();
      return;
    }

    if (key.action === 'space') {
      insertValue(' ');
      return;
    }

    if (key.action === 'enter') {
      handleEnter();
      return;
    }

    if (key.action === 'language') {
      setLanguage(current => (current === 'en' ? 'ru' : 'en'));
      setMode('letters');
      setShifted(false);
      return;
    }

    if (key.action === 'mode') {
      setMode(current => (current === 'letters' ? 'numbers' : 'letters'));
      setShifted(false);
      return;
    }

    if (key.value) {
      insertValue(shifted ? key.value.toUpperCase() : key.value);
    }
  };

  return (
    <Screen scroll contentStyle={styles.formContent}>
      <TopBar
        title={draft.id ? 'Edit Text' : 'Add New Text'}
        onBack={onBack}
        actions={[{icon: '💾', onPress: onSave, active: true}]}
      />
      <View style={styles.formBlock}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map(item => {
            const active = item.key === draft.category;
            return (
              <Pressable
                key={item.key}
                onPress={() => onDraftChange({...draft, category: item.key})}
                style={({pressed}) => [
                  styles.categoryPick,
                  active && styles.categoryPickActive,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.pickIcon}>{item.icon}</Text>
                <Text style={styles.pickLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.formBlock}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={draft.title}
          onFocus={() => setActiveField('title')}
          onPressIn={() => setActiveField('title')}
          onSelectionChange={event => updateSelection('title', event)}
          onChangeText={title => updateField('title', title)}
          placeholder="Enter text title"
          placeholderTextColor={colors.muted}
          showSoftInputOnFocus={false}
          selection={activeField === 'title' ? selection.title : undefined}
          style={[styles.input, activeField === 'title' && styles.inputActive]}
        />
      </View>
      <View style={[styles.formBlock, styles.contentBlock]}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          value={draft.content}
          onFocus={() => setActiveField('content')}
          onPressIn={() => setActiveField('content')}
          onSelectionChange={event => updateSelection('content', event)}
          onChangeText={content => updateField('content', content)}
          placeholder="Enter your practice text here..."
          placeholderTextColor={colors.muted}
          showSoftInputOnFocus={false}
          multiline
          selection={activeField === 'content' ? selection.content : undefined}
          textAlignVertical="top"
          style={[
            styles.input,
            styles.textArea,
            activeField === 'content' && styles.inputActive,
          ]}
        />
      </View>
      <CompactKeyboard
        language={language}
        mode={mode}
        shifted={shifted}
        onPress={handleKeyboardPress}
      />
      <AppButton
        title={draft.id ? 'Save Changes' : 'Save Text'}
        icon="💾"
        onPress={onSave}
        style={styles.saveButton}
      />
    </Screen>
  );
}

function CompactKeyboard({
  language,
  mode,
  shifted,
  onPress,
}: {
  language: KeyboardLanguage;
  mode: KeyboardMode;
  shifted: boolean;
  onPress: (key: KeyboardKey) => void;
}): React.JSX.Element {
  const rows = mode === 'letters' ? keyboardLetters[language] : keyboardNumbers;
  const bottomRow: KeyboardKey[] = [
    {label: mode === 'letters' ? '123' : 'ABC', action: 'mode', flex: 1.35},
    {label: language.toUpperCase(), action: 'language', flex: 1.2},
    {label: 'space', action: 'space', flex: 4.2},
    {label: '↵', action: 'enter', flex: 1.15},
  ];

  return (
    <View style={styles.keyboard}>
      {rows.map((row, rowIndex) => (
        <View key={`${mode}-${language}-${rowIndex}`} style={styles.keyRow}>
          {row.map((key, keyIndex) => (
            <KeyboardButton
              key={`${key.label}-${keyIndex}`}
              keyboardKey={key}
              shifted={shifted}
              onPress={onPress}
            />
          ))}
        </View>
      ))}
      <View style={styles.keyRow}>
        {bottomRow.map(key => (
          <KeyboardButton
            key={key.label}
            keyboardKey={key}
            shifted={false}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

function KeyboardButton({
  keyboardKey,
  shifted,
  onPress,
}: {
  keyboardKey: KeyboardKey;
  shifted: boolean;
  onPress: (key: KeyboardKey) => void;
}): React.JSX.Element {
  const active = keyboardKey.action === 'shift' && shifted;
  const label =
    shifted && keyboardKey.value
      ? keyboardKey.label.toUpperCase()
      : keyboardKey.label;

  return (
    <Pressable
      onPress={() => onPress(keyboardKey)}
      style={({pressed}) => [
        styles.key,
        {flex: keyboardKey.flex ?? 1},
        keyboardKey.action && styles.specialKey,
        active && styles.activeKey,
        pressed && styles.pressed,
      ]}>
      <Text
        style={[styles.keyText, keyboardKey.action && styles.specialKeyText]}>
        {label}
      </Text>
    </Pressable>
  );
}

function TextDetail({
  text,
  onBack,
}: {
  text: PracticeText;
  onBack: () => void;
}): React.JSX.Element {
  const category = categories.find(item => item.key === text.category);

  return (
    <Screen scroll contentStyle={styles.detailContent}>
      <TopBar title="Text" onBack={onBack} />
      <View style={styles.detailHeader}>
        <Text style={styles.detailIcon}>{category?.icon}</Text>
        <View style={styles.detailTitleWrap}>
          <Text style={styles.detailTitle}>{text.title}</Text>
          <Text style={styles.detailCategory}>{category?.label}</Text>
        </View>
      </View>
      <Card style={styles.detailCard}>
        <Text style={styles.detailBody}>{text.content}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  chipScroller: {
    height: 96,
    flexGrow: 0,
    marginTop: 28,
    marginBottom: 32,
  },
  chips: {
    alignItems: 'center',
    gap: 12,
    paddingRight: 24,
  },
  list: {
    gap: 14,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
  textCard: {
    padding: 16,
  },
  textRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textIcon: {
    fontSize: 20,
    marginTop: 3,
  },
  textMain: {
    flex: 1,
  },
  textTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '800',
  },
  textExcerpt: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 10,
  },
  badgeText: {
    color: colors.muted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.text,
    fontSize: 17,
  },
  editText: {
    color: colors.text,
    fontSize: 18,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 19,
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: layout.navBottom + layout.navHeight + 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 20,
    elevation: 8,
  },
  fabText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 34,
  },
  formContent: {
    gap: 26,
  },
  detailContent: {
    gap: 22,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  detailIcon: {
    fontSize: 30,
  },
  detailTitleWrap: {
    flex: 1,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
  },
  detailCategory: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 6,
  },
  detailCard: {
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  detailBody: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 30,
  },
  formBlock: {
    gap: 12,
  },
  contentBlock: {
    marginTop: 20,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryPick: {
    flex: 1,
    minHeight: 78,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  categoryPickActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  pickIcon: {
    fontSize: 21,
  },
  pickLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.cardSoft,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputActive: {
    borderColor: colors.primary,
  },
  textArea: {
    minHeight: 300,
    paddingTop: 16,
    paddingBottom: 16,
    lineHeight: 23,
  },
  keyboard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.045)',
    padding: 8,
    gap: 6,
  },
  keyRow: {
    flexDirection: 'row',
    gap: 5,
  },
  key: {
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.cardSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  specialKey: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeKey: {
    backgroundColor: colors.primary,
  },
  keyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  specialKeyText: {
    fontSize: 13,
  },
  saveButton: {
    marginTop: -20,
  },
});
