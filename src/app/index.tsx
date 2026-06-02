import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const summaryCards = [
  { label: 'Activos', value: '18', detail: '+3 hoy', icon: { ios: 'tray.full', web: 'inventory' } },
  { label: 'Pendientes', value: '7', detail: '2 vencen hoy', icon: { ios: 'bell.badge', web: 'notifications' } },
  { label: 'Equipo', value: '24', detail: '6 en línea', icon: { ios: 'person.3', web: 'groups' } },
] as const;

const tasks = [
  { title: 'Revisar solicitudes', meta: '5 min · Prioridad alta', icon: { ios: 'checklist', web: 'checklist' } },
  { title: 'Confirmar recordatorio', meta: 'Hoy · 14:30', icon: { ios: 'calendar.badge.clock', web: 'event' } },
  { title: 'Compartir actualización', meta: 'Mañana · 09:00', icon: { ios: 'square.and.arrow.up', web: 'share' } },
] as const;

const quickActions = ['Nuevo aviso', 'Programar', 'Compartir'] as const;

export default function HomeScreen() {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic">
          <ThemedView style={styles.headerRow}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Lunes, 1 de junio
              </ThemedText>
              <ThemedText type="title" style={styles.pageTitle}>
                Inicio
              </ThemedText>
            </View>
            <View style={styles.avatarButton}>
              <ThemedText type="smallBold">AR</ThemedText>
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Estado general
            </ThemedText>
            <ThemedText type="subtitle" style={styles.heroValue}>
              94% listo para hoy
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.heroBody}>
              Vista de demostración con contenido estático para validar navegación, jerarquía visual y densidad de información.
            </ThemedText>
            <View style={styles.heroActions}>
              <Pressable style={[styles.primaryAction, { backgroundColor: theme.text }]} onPress={() => setSheetVisible(true)}>
                <ThemedText type="smallBold" style={{ color: theme.background }}>
                  Acciones rápidas
                </ThemedText>
              </Pressable>
              <View style={styles.pillBadge}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  12:45
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Resumen</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Datos de prueba
            </ThemedText>
          </View>

          <View style={styles.summaryGrid}>
            {summaryCards.map((card) => (
              <ThemedView key={card.label} type="backgroundElement" style={styles.summaryCard}>
                <SymbolView name={card.icon} tintColor={theme.text} size={18} />
                <ThemedText type="subtitle" style={styles.summaryValue}>
                  {card.value}
                </ThemedText>
                <ThemedText type="smallBold">{card.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {card.detail}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Tareas destacadas</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              3 elementos
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.listCard}>
            {tasks.map((task, index) => (
              <View key={task.title} style={[styles.listRow, index !== tasks.length - 1 && styles.listDivider]}>
                <View style={styles.rowIconWrap}>
                  <SymbolView name={task.icon} tintColor={theme.text} size={18} />
                </View>
                <View style={styles.rowTextWrap}>
                  <ThemedText type="smallBold">{task.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {task.meta}
                  </ThemedText>
                </View>
                <SymbolView name={{ ios: 'chevron.right', web: 'chevron_right' }} tintColor={theme.textSecondary} size={14} />
              </View>
            ))}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.noteCard}>
            <ThemedText type="smallBold">Siguiente paso</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.noteText}>
              Sustituye estos datos mockup por tu modelo real cuando definas la app final.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={sheetVisible} transparent animationType="fade" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.background }]}>
            <View style={styles.sheetHandle} />
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Acciones rápidas
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.sheetText}>
              Presentación modal simple para demostrar el patrón nativo.
            </ThemedText>
            <View style={styles.sheetActions}>
              {quickActions.map((action) => (
                <Pressable key={action} style={styles.sheetActionButton}>
                  <ThemedText type="smallBold">{action}</ThemedText>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.sheetCloseButton, { backgroundColor: theme.text }]} onPress={() => setSheetVisible(false)}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                Cerrar
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heroValue: {
    marginTop: 2,
  },
  heroBody: {
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  primaryAction: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillBadge: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.one,
    minHeight: 132,
  },
  summaryValue: {
    marginTop: Spacing.one,
  },
  listCard: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  listRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  listDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  rowIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  noteCard: {
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  noteText: {
    lineHeight: 21,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: Spacing.three,
  },
  sheet: {
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(120,120,128,0.3)',
    alignSelf: 'center',
    marginBottom: Spacing.one,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  sheetText: {
    textAlign: 'center',
    lineHeight: 21,
  },
  sheetActions: {
    gap: Spacing.two,
  },
  sheetActionButton: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseButton: {
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});