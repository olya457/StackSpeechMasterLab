import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {colors, layout} from '../styles/theme';

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  withNav?: boolean;
  keyboard?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll,
  withNav,
  keyboard,
  style,
  contentStyle,
}: ScreenProps): React.JSX.Element {
  const bottomPadding = withNav ? layout.bottomContent : layout.navBottom + 24;
  const topPadding = withNav ? 42 : layout.topInset;
  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        {paddingTop: topPadding},
        {paddingBottom: bottomPadding},
        contentStyle,
      ]}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        {paddingTop: topPadding, paddingBottom: bottomPadding},
        contentStyle,
      ]}>
      {children}
    </View>
  );

  const body = (
    <View style={[styles.root, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.shade} />
      {content}
    </View>
  );

  if (!keyboard) {
    return body;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}>
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: layout.androidInset,
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    borderBottomRightRadius: 120,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});
