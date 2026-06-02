import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Importamos los servicios de Firebase y los tipos de dominio
import { AgendaEventRecord, TaskRecord } from '@/domain/firebase';
import { firebaseServices } from '@/services/firebase';
import { User } from 'firebase/auth';

const quickActions = ['Nueva Tarea', 'Programar Evento', 'Compartir'] as const;

export default function HomeScreen() {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);
  
  // Estados para manejar el backend
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Efecto para escuchar la autenticación y traer los datos en tiempo real
  useEffect(() => {
    // 1. Observar estado de autenticación
    const unsubscribeAuth = firebaseServices.auth.observeAuthState((user) => {
      setCurrentUser(user);
      
      if (user) {
        // 2. Si hay usuario, observar sus tareas en tiempo real
        const unsubscribeTasks = firebaseServices.repositories.tasks.observe(
          user.uid,
          (realTasks) => {
            setTasks(realTasks);
            setLoading(false);
          },
          (error) => console.error("Error cargando tareas:", error)
        );

        // 3. Observar eventos de su agenda
        const unsubscribeAgenda = firebaseServices.repositories.agendaEvents.observe(
          user.uid,
          (events) => setAgendaEvents(events),
          (error) => console.error("Error cargando agenda:", error)
        );

        // Limpiar suscripciones al desmontar
        return () => {
          unsubscribeTasks();
          unsubscribeAgenda();
        };
      } else {
        setLoading(false);
        setTasks([]);
        setAgendaEvents([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Calcular dinámicamente las métricas de las tarjetas de resumen
  const activeTasksCount = tasks.filter(t => !t.completed).length;
  const pendingEventsCount = agendaEvents.filter(e => e.status === 'active').length;

  const summaryCards = [
    { label: 'Tareas Activas', value: activeTasksCount.toString(), detail: 'En progreso', icon: { ios: 'tray.full', web: 'inventory' } as const },
    { label: 'Eventos Pendientes', value: pendingEventsCount.toString(), detail: 'Próximos', icon: { ios: 'bell.badge', web: 'notifications' } as const },
    { label: 'Equipo', value: '24', detail: '6 en línea', icon: { ios: 'person.3', web: 'groups' } as const }, // Este podría conectarse a un modelo de "Teams" en el futuro
  ];

  // Formateador de fechas simple
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Sin fecha';
    return new Date(timestamp).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <ThemedView style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator size="large" color={theme.text} />
      </ThemedView>
    );
  }

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
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </ThemedText>
              <ThemedText type="title" style={styles.pageTitle}>
                Inicio
              </ThemedText>
            </View>
            <View style={styles.avatarButton}>
              <ThemedText type="smallBold">
                {currentUser?.displayName ? currentUser.displayName.substring(0, 2).toUpperCase() : 'AR'}
              </ThemedText>
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Estado general
            </ThemedText>
            <ThemedText type="subtitle" style={styles.heroValue}>
              {activeTasksCount === 0 ? '¡Todo listo para hoy!' : `${activeTasksCount} tareas pendientes`}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.heroBody}>
              Tus datos ya están conectados a Firebase en tiempo real. Crea una nueva tarea para ver los cambios instantáneos.
            </ThemedText>
            <View style={styles.heroActions}>
              <Pressable style={[styles.primaryAction, { backgroundColor: theme.text }]} onPress={() => setSheetVisible(true)}>
                <ThemedText type="smallBold" style={{ color: theme.background }}>
                  Acciones rápidas
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Resumen</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Tiempo real
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
              {tasks.length} elementos
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.listCard}>
            {tasks.length > 0 ? tasks.slice(0, 5).map((task, index) => (
              <View key={task.id} style={[styles.listRow, index !== tasks.slice(0, 5).length - 1 && styles.listDivider]}>
                <View style={styles.rowIconWrap}>
                  <SymbolView name={{ ios: 'checklist', web: 'checklist' }} tintColor={theme.text} size={18} />
                </View>
                <View style={styles.rowTextWrap}>
                  <ThemedText type="smallBold">{task.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Prioridad {task.priority} · {formatDate(task.dueAt)}
                  </ThemedText>
                </View>
                <SymbolView name={{ ios: 'chevron.right', web: 'chevron_right' }} tintColor={theme.textSecondary} size={14} />
              </View>
            )) : (
              <View style={styles.listRow}>
                 <ThemedText type="small" themeColor="textSecondary">No hay tareas creadas. ¡Añade una!</ThemedText>
              </View>
            )}
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
              Selecciona una acción para continuar.
            </ThemedText>
            <View style={styles.sheetActions}>
              {quickActions.map((action) => (
                <Pressable 
                  key={action} 
                  style={styles.sheetActionButton}
                  onPress={() => {
                    // Aquí puedes añadir la navegación a tu formulario de creación
                    // router.push('/crear-tarea');
                    setSheetVisible(false);
                  }}
                >
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
  screen: { flex: 1 },
  safeArea: { flex: 1 },
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { marginTop: 2 },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: { borderRadius: 28, padding: Spacing.four, gap: Spacing.two },
  heroValue: { marginTop: 2 },
  heroBody: { lineHeight: 22 },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  primaryAction: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  summaryGrid: { flexDirection: 'row', gap: Spacing.two },
  summaryCard: {
    flex: 1,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.one,
    minHeight: 132,
  },
  summaryValue: { marginTop: Spacing.one },
  listCard: { borderRadius: 28, overflow: 'hidden' },
  listRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  listDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(128,128,128,0.2)' },
  rowIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: { flex: 1, gap: 2 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)', padding: Spacing.three },
  sheet: { borderRadius: 28, padding: Spacing.four, gap: Spacing.three },
  sheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(120,120,128,0.3)',
    alignSelf: 'center',
    marginBottom: Spacing.one,
  },
  sheetTitle: { textAlign: 'center' },
  sheetText: { textAlign: 'center', lineHeight: 21 },
  sheetActions: { gap: Spacing.two },
  sheetActionButton: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: 22,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseButton: { minHeight: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});