export interface ChecklistItem {
  id: string;
  title: string;
  imageUri: string | null;
}

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Settings {
  notificationEnabled: boolean;
  days: WeekDay[];
  time: string;
}

export interface CurrentState {
  checklist: ChecklistItem[];
  spaceName: string;
  settings: Settings;

  isTodayCompleted: boolean;
  /** "YYYY-MM-DD" — date comparison/grouping only, not a timestamp */
  lastActiveDate: string;
  /** ISO 8601 (e.g. "2026-07-02T08:42:15.432Z") */
  completedAt: string | null;
}

export type HistoryStatus = "completed" | "incomplete";

export interface HistoryRecord {
  id: string;
  /** "YYYY-MM-DD" — date comparison/grouping only, not a timestamp */
  date: string;
  /** ISO 8601 (e.g. "2026-07-02T08:42:15.432Z") */
  completedAt: string | null;
  status: HistoryStatus;
  checklist: ChecklistItem[];
}

export interface AppStore {
  hasCompletedOnboarding: boolean;
  current: CurrentState;
  history: HistoryRecord[];
}
