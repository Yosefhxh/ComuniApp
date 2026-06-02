import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const agendaItems = [
  { time: '09:00', title: 'Revisión semanal', detail: 'Sala 3 · 45 min', tag: 'Reunión', icon: { ios: 'calendar', web: 'event' } },
  { time: '12:30', title: 'Bloque creativo', detail: 'Trabajo profundo · 90 min', tag: 'En foco', icon: { ios: 'sparkles', web: 'auto_awesome' } },
  { time: '17:00', title: 'Cierre de día', detail: 'Resumen y siguiente paso', tag: 'Resumen', icon: { ios: 'checkmark.seal', web: 'check_circle' } },
] as const;

const reminderItems = [
  { title: 'Enviar confirmación', meta: 'Mañana · 08:00' },
  { title: 'Actualizar portada', meta: 'Jueves · 13:30' },
  { title: 'Revisar métricas', meta: 'Viernes · 10:15' },
] as const;

export default function AgendaScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="small" themeColor="textSecondary">
            Semana activa
          </ThemedText>
          <ThemedText type="title">Agenda</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Mockup con jerarquía clara para revisar citas, tareas y recordatorios sin lógica de negocio.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => [styles.linkPressable, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Referencia Expo</ThemedText>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={14}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <View style={styles.sectionsWrapper}>
          {agendaItems.map((item) => (
            <ThemedView key={item.title} type="backgroundElement" style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={styles.eventTimeBadge}>
                  <ThemedText type="smallBold">{item.time}</ThemedText>
                </View>
                <View style={styles.eventTag}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.tag}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.eventBody}>
                <View style={styles.eventIconWrap}>
                  <SymbolView name={item.icon} tintColor={theme.text} size={18} />
                </View>
                <View style={styles.eventTextWrap}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.detail}
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          ))}

          <ThemedView type="backgroundElement" style={styles.reminderCard}>
            <ThemedText type="smallBold">Recordatorios</ThemedText>
            {reminderItems.map((item, index) => (
              <View key={item.title} style={[styles.reminderRow, index !== reminderItems.length - 1 && styles.reminderDivider]}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  {item.title}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.meta}
                </ThemedText>
              </View>
            ))}
          </ThemedView>
        </View>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    width: '100%',
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  linkPressable: {
    minHeight: 44,
  },
  pressed: {
    opacity: 0.72,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    minHeight: 44,
    paddingVertical: Spacing.two,
    borderRadius: 22,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  eventCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTimeBadge: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.12)',
  },
  eventTag: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
  },
  eventBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  eventIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTextWrap: {
    flex: 1,
    gap: 2,
  },
  reminderCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  reminderRow: {
    minHeight: 44,
    justifyContent: 'center',
    gap: 2,
  },
  reminderDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
});