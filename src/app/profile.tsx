import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const settings = [
  { title: 'Notificaciones', subtitle: 'Activadas', icon: { ios: 'bell.badge', web: 'notifications' } },
  { title: 'Privacidad', subtitle: 'Revisar permisos', icon: { ios: 'lock.shield', web: 'lock' } },
  { title: 'Soporte', subtitle: 'Centro de ayuda', icon: { ios: 'questionmark.circle', web: 'help' } },
] as const;

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInset={{ top: insets.top, bottom: insets.bottom + BottomTabInset + Spacing.three }}
      contentContainerStyle={styles.content}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <ThemedText type="subtitle">AR</ThemedText>
          </View>
          <View style={styles.headerCopy}>
            <ThemedText type="title">Perfil</ThemedText>
            <ThemedText themeColor="textSecondary">
              Vista de cuenta estática con estructura lista para futura lógica de usuario.
            </ThemedText>
          </View>
        </View>

        <ThemedView type="backgroundElement" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatBlock value="128" label="Publicaciones" />
            <StatBlock value="4.9" label="Puntuación" />
            <StatBlock value="18" label="Guardados" />
          </View>
        </ThemedView>

        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold">Ajustes</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            3 opciones
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.menuCard}>
          {settings.map((item, index) => (
            <Pressable key={item.title} style={[styles.menuRow, index !== settings.length - 1 && styles.menuDivider]}>
              <View style={styles.menuIconWrap}>
                <SymbolView name={item.icon} tintColor={theme.text} size={18} />
              </View>
              <View style={styles.menuTextWrap}>
                <ThemedText type="smallBold">{item.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.subtitle}
                </ThemedText>
              </View>
              <SymbolView name={{ ios: 'chevron.right', web: 'chevron_right' }} tintColor={theme.textSecondary} size={14} />
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.noteCard}>
          <ThemedText type="smallBold">Próxima iteración</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.noteText}>
            Aquí puedes conectar login real, edición de perfil y persistencia de datos cuando pases a la segunda fase.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statBlock}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,122,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  statsCard: {
    borderRadius: 28,
    padding: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statBlock: {
    flex: 1,
    minHeight: 84,
    borderRadius: 22,
    padding: Spacing.three,
    backgroundColor: 'rgba(120,120,128,0.12)',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  menuCard: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  menuRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  menuDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
    gap: 2,
  },
  noteCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  noteText: {
    lineHeight: 21,
  },
});