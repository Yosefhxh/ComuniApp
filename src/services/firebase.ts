import { getApps, initializeApp } from 'firebase/app';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type Auth,
    type User,
} from 'firebase/auth';
import {
    collection,
    doc,
    enableIndexedDbPersistence,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    type DocumentData,
    type QueryConstraint,
    type QueryDocumentSnapshot
} from 'firebase/firestore';
import { Platform } from 'react-native';

import { firebaseEnv } from '@/config/env';
import { clearCache, readCachedValue, removeCachedCollectionItem, upsertCachedCollectionItem, writeCache } from '@/data/firebase/cache';
import { type AgendaEventInput, type AgendaEventRecord, type FirebaseRecord, type ReminderInput, type ReminderRecord, type TaskInput, type TaskRecord, type UserProfileInput, type UserProfileRecord } from '@/domain/firebase';

const firebaseApp = getApps()[0] ?? initializeApp(firebaseEnv);

const firebaseAuth: Auth = getAuth(firebaseApp);

const firebaseDb = getFirestore(firebaseApp);

if (Platform.OS === 'web') {
  void enableIndexedDbPersistence(firebaseDb).catch(() => undefined);
}

const now = () => Date.now();
const nowIso = () => now();

const collectionPath = (userId: string, scope: 'agendaEvents' | 'reminders' | 'tasks') => ['users', userId, scope] as const;
const collectionCacheKey = (userId: string, scope: 'agendaEvents' | 'reminders' | 'tasks', suffix = 'all') => `firebase:${scope}:${userId}:${suffix}`;
const documentCacheKey = (userId: string, scope: 'agendaEvents' | 'reminders' | 'tasks', documentId: string) => `firebase:${scope}:${userId}:${documentId}`;
const profileCacheKey = (userId: string) => `firebase:profile:${userId}`;

function assertUserId(userId: string): void {
  if (!userId) {
    throw new Error('A Firebase user id is required.');
  }
}

function mapDocument<TRecord extends { id: string }>(snapshot: QueryDocumentSnapshot<DocumentData>): TRecord {
  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<TRecord, 'id'>),
  } as TRecord;
}

async function writeDocumentCache<TRecord>(key: string, value: TRecord): Promise<void> {
  await writeCache(key, value);
}

async function listDocuments<TRecord extends { id: string }>(params: {
  userId: string;
  scope: 'agendaEvents' | 'reminders' | 'tasks';
  constraints: QueryConstraint[];
  suffix?: string;
}): Promise<TRecord[]> {
  const { userId, scope, constraints, suffix = 'all' } = params;
  assertUserId(userId);
  const collectionRef = collection(firebaseDb, ...collectionPath(userId, scope));
  const queryRef = query(collectionRef, ...constraints);
  const key = collectionCacheKey(userId, scope, suffix);

  try {
    const snapshot = await getDocs(queryRef);
    const records = snapshot.docs.map((documentSnapshot) => mapDocument<TRecord>(documentSnapshot));
    await writeCache(key, records);
    return records;
  } catch {
    return (await readCachedValue<TRecord[]>(key)) ?? [];
  }
}

function observeDocuments<TRecord extends { id: string }>(params: {
  userId: string;
  scope: 'agendaEvents' | 'reminders' | 'tasks';
  constraints: QueryConstraint[];
  suffix?: string;
  onChange: (records: TRecord[]) => void;
  onError?: (error: Error) => void;
}) {
  const { userId, scope, constraints, suffix = 'all', onChange, onError } = params;
  assertUserId(userId);
  const collectionRef = collection(firebaseDb, ...collectionPath(userId, scope));
  const queryRef = query(collectionRef, ...constraints);
  const key = collectionCacheKey(userId, scope, suffix);

  void readCachedValue<TRecord[]>(key).then((cachedRecords) => {
    if (cachedRecords) {
      onChange(cachedRecords);
    }
  });

  return onSnapshot(
    queryRef,
    (snapshot) => {
      const records = snapshot.docs.map((documentSnapshot) => mapDocument<TRecord>(documentSnapshot));
      void writeCache(key, records);
      onChange(records);
    },
    async (error) => {
      const cachedRecords = await readCachedValue<TRecord[]>(key);

      if (cachedRecords) {
        onChange(cachedRecords);
      }

      onError?.(error as Error);
    },
  );
}

async function readDocument<TRecord extends { id: string }>(params: {
  userId: string;
  scope: 'agendaEvents' | 'reminders' | 'tasks';
  documentId: string;
}): Promise<TRecord | null> {
  const { userId, scope, documentId } = params;
  assertUserId(userId);
  const documentRef = doc(firebaseDb, ...collectionPath(userId, scope), documentId);
  const key = documentCacheKey(userId, scope, documentId);

  try {
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      return null;
    }

    const record = {
      id: snapshot.id,
      ...(snapshot.data() as Omit<TRecord, 'id'>),
    } as TRecord;

    await writeDocumentCache(key, record);
    return record;
  } catch {
    return readCachedValue<TRecord>(key);
  }
}

async function createDocument<TInput extends Record<string, unknown>, TRecord extends FirebaseRecord>(params: {
  userId: string;
  scope: 'agendaEvents' | 'reminders' | 'tasks';
  input: TInput;
}): Promise<TRecord> {
  const { userId, scope, input } = params;
  assertUserId(userId);
  const collectionRef = collection(firebaseDb, ...collectionPath(userId, scope));
  const createdAt = nowIso();
  const nextRecord = {
    ...input,
    ownerId: userId,
    createdAt,
    updatedAt: createdAt,
  } as Omit<TRecord, 'id'>;
  const documentRef = doc(collectionRef);
  const record = {
    id: documentRef.id,
    ...nextRecord,
  } as TRecord;

  await setDoc(documentRef, record);
  await upsertCachedCollectionItem(collectionCacheKey(userId, scope), record);
  await writeDocumentCache(documentCacheKey(userId, scope, record.id), record);

  return record;
}

async function updateDocument<TInput extends Record<string, unknown>, TRecord extends FirebaseRecord>(params: {
  userId: string;
  scope: 'agendaEvents' | 'reminders' | 'tasks';
  documentId: string;
  input: Partial<TInput>;
}): Promise<TRecord> {
  const { userId, scope, documentId, input } = params;
  assertUserId(userId);
  const documentRef = doc(firebaseDb, ...collectionPath(userId, scope), documentId);
  const currentRecord = await readDocument<TRecord>({ userId, scope, documentId });
  const updatedAt = nowIso();
  const nextRecord = {
    ...(currentRecord ?? { id: documentId, ownerId: userId, createdAt: updatedAt } as TRecord),
    ...input,
    id: documentId,
    ownerId: userId,
    updatedAt,
  } as TRecord;

  await updateDoc(documentRef, {
    ...input,
    updatedAt,
  } as DocumentData);
  await writeDocumentCache(documentCacheKey(userId, scope, documentId), nextRecord);
  await upsertCachedCollectionItem(collectionCacheKey(userId, scope), nextRecord);

  return nextRecord;
}

async function deleteDocument(params: { userId: string; scope: 'agendaEvents' | 'reminders' | 'tasks'; documentId: string }): Promise<void> {
  const { userId, scope, documentId } = params;
  assertUserId(userId);
  const documentRef = doc(firebaseDb, ...collectionPath(userId, scope), documentId);

  await import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(documentRef));
  await clearCache(documentCacheKey(userId, scope, documentId));
  await removeCachedCollectionItem(collectionCacheKey(userId, scope), documentId);
}

export async function getUserProfile(userId: string): Promise<UserProfileRecord | null> {
  assertUserId(userId);
  const documentRef = doc(firebaseDb, 'users', userId);

  try {
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      return null;
    }

    const record = snapshot.data() as UserProfileRecord;
    await writeDocumentCache(profileCacheKey(userId), record);

    return record;
  } catch {
    return readCachedValue<UserProfileRecord>(profileCacheKey(userId));
  }
}

export async function upsertUserProfile(userId: string, input: Partial<UserProfileInput> & { email: string }): Promise<UserProfileRecord> {
  assertUserId(userId);
  const currentProfile = (await getUserProfile(userId)) ?? {
    id: userId,
    ownerId: userId,
    createdAt: now(),
    updatedAt: now(),
    displayName: input.displayName ?? '',
    email: input.email,
    photoURL: null,
    phoneNumber: null,
    role: 'member' as const,
    bio: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };

  const nextProfile: UserProfileRecord = {
    ...currentProfile,
    ...input,
    id: userId,
    ownerId: userId,
    email: input.email,
    displayName: input.displayName ?? currentProfile.displayName,
    photoURL: input.photoURL ?? currentProfile.photoURL,
    phoneNumber: input.phoneNumber ?? currentProfile.phoneNumber,
    bio: input.bio ?? currentProfile.bio,
    timezone: input.timezone ?? currentProfile.timezone,
    updatedAt: now(),
  };

  await setDoc(doc(firebaseDb, 'users', userId), nextProfile, { merge: true });
  await writeDocumentCache(profileCacheKey(userId), nextProfile);

  return nextProfile;
}

export async function syncUserProfileFromAuth(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) {
  if (!user.email) {
    return null;
  }

  return upsertUserProfile(user.uid, {
    email: user.email,
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
  });
}

export function observeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function signUpWithEmailPassword(payload: { email: string; password: string; displayName?: string }) {
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);

  if (payload.displayName) {
    await updateProfile(userCredential.user, { displayName: payload.displayName });
  }

  await syncUserProfileFromAuth(userCredential.user);
  return userCredential.user;
}

export async function signInWithEmailPassword(payload: { email: string; password: string }) {
  const userCredential = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
  await syncUserProfileFromAuth(userCredential.user);
  return userCredential.user;
}

export async function signInWithGoogle(payload: { idToken: string; accessToken?: string }) {
  const credential = GoogleAuthProvider.credential(payload.idToken, payload.accessToken);
  const userCredential = await signInWithCredential(firebaseAuth, credential);
  await syncUserProfileFromAuth(userCredential.user);
  return userCredential.user;
}

export async function sendResetPasswordEmail(email: string) {
  await sendPasswordResetEmail(firebaseAuth, email);
}

export async function signOutUser(authClient: Auth = firebaseAuth) {
  await signOut(authClient);
}

export const firebaseRepositories = {
  agendaEvents: {
    list: (userId: string) => listDocuments<AgendaEventRecord>({ userId, scope: 'agendaEvents', constraints: [orderBy('startsAt', 'asc')] }),
    observe: (userId: string, onData: (records: AgendaEventRecord[]) => void, onError?: (error: Error) => void) => observeDocuments<AgendaEventRecord>({ userId, scope: 'agendaEvents', constraints: [orderBy('startsAt', 'asc')], onChange: onData, onError }),
    getById: (userId: string, eventId: string) => readDocument<AgendaEventRecord>({ userId, scope: 'agendaEvents', documentId: eventId }),
    create: (userId: string, input: AgendaEventInput) => createDocument<AgendaEventInput, AgendaEventRecord>({ userId, scope: 'agendaEvents', input }),
    update: (userId: string, eventId: string, input: Partial<AgendaEventInput>) => updateDocument<AgendaEventInput, AgendaEventRecord>({ userId, scope: 'agendaEvents', documentId: eventId, input }),
    remove: (userId: string, eventId: string) => deleteDocument({ userId, scope: 'agendaEvents', documentId: eventId }),
  },
  reminders: {
    list: (userId: string) => listDocuments<ReminderRecord>({ userId, scope: 'reminders', constraints: [orderBy('dueAt', 'asc')] }),
    observe: (userId: string, onData: (records: ReminderRecord[]) => void, onError?: (error: Error) => void) => observeDocuments<ReminderRecord>({ userId, scope: 'reminders', constraints: [orderBy('dueAt', 'asc')], onChange: onData, onError }),
    getById: (userId: string, reminderId: string) => readDocument<ReminderRecord>({ userId, scope: 'reminders', documentId: reminderId }),
    create: (userId: string, input: ReminderInput) => createDocument<ReminderInput, ReminderRecord>({ userId, scope: 'reminders', input }),
    update: (userId: string, reminderId: string, input: Partial<ReminderInput>) => updateDocument<ReminderInput, ReminderRecord>({ userId, scope: 'reminders', documentId: reminderId, input }),
    remove: (userId: string, reminderId: string) => deleteDocument({ userId, scope: 'reminders', documentId: reminderId }),
  },
  tasks: {
    list: (userId: string) => listDocuments<TaskRecord>({ userId, scope: 'tasks', constraints: [orderBy('createdAt', 'desc'), limit(100)] }),
    observe: (userId: string, onData: (records: TaskRecord[]) => void, onError?: (error: Error) => void) => observeDocuments<TaskRecord>({ userId, scope: 'tasks', constraints: [orderBy('createdAt', 'desc'), limit(100)], onChange: onData, onError }),
    getById: (userId: string, taskId: string) => readDocument<TaskRecord>({ userId, scope: 'tasks', documentId: taskId }),
    create: (userId: string, input: TaskInput) => createDocument<TaskInput, TaskRecord>({ userId, scope: 'tasks', input }),
    update: (userId: string, taskId: string, input: Partial<TaskInput>) => updateDocument<TaskInput, TaskRecord>({ userId, scope: 'tasks', documentId: taskId, input }),
    remove: (userId: string, taskId: string) => deleteDocument({ userId, scope: 'tasks', documentId: taskId }),
  },
  profiles: {
    get: getUserProfile,
    upsert: upsertUserProfile,
  },
} as const;

export type FirebaseServices = {
  auth: {
    firebaseAuth: Auth;
    observeAuthState: typeof observeAuthState;
    signUpWithEmailPassword: typeof signUpWithEmailPassword;
    signInWithEmailPassword: typeof signInWithEmailPassword;
    signInWithGoogle: typeof signInWithGoogle;
    sendResetPasswordEmail: typeof sendResetPasswordEmail;
    signOutUser: typeof signOutUser;
  };
  repositories: typeof firebaseRepositories;
};

export const firebaseServices: FirebaseServices = {
  auth: {
    firebaseAuth,
    observeAuthState,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signInWithGoogle,
    sendResetPasswordEmail,
    signOutUser,
  },
  repositories: firebaseRepositories,
};
