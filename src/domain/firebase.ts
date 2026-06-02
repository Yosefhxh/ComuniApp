export type FirebaseRecord = {
  id: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

export type UserProfileRecord = FirebaseRecord & {
  displayName: string;
  email: string;
  photoURL: string | null;
  phoneNumber: string | null;
  role: 'owner' | 'member';
  bio: string;
  timezone: string;
};

export type UserProfileInput = Omit<UserProfileRecord, keyof FirebaseRecord>;

export type AgendaEventRecord = FirebaseRecord & {
  title: string;
  detail: string;
  startsAt: number;
  endsAt: number;
  location: string;
  tag: string;
  status: 'active' | 'archived' | 'completed' | 'cancelled';
  allDay: boolean;
};

export type AgendaEventInput = Omit<AgendaEventRecord, keyof FirebaseRecord>;

export type ReminderRecord = FirebaseRecord & {
  title: string;
  detail: string;
  dueAt: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export type ReminderInput = Omit<ReminderRecord, keyof FirebaseRecord>;

export type TaskRecord = FirebaseRecord & {
  title: string;
  detail: string;
  dueAt: number | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  source: 'home' | 'agenda' | 'profile';
};

export type TaskInput = Omit<TaskRecord, keyof FirebaseRecord>;
