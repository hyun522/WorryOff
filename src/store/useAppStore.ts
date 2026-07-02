import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppStore as AppState, ChecklistItem, Settings } from "./types";
import {
  DEFAULT_CHECKLIST,
  DEFAULT_SETTINGS,
  DEFAULT_SPACE_NAME,
} from "./constants";
import { formatDate } from "./utils";

/**
 * Worry OFF Global Store
 *
 * State 스토어가 가지고 있는 데이터
 * - current
 * - history
 *
 * Actions 데이터를 변경하는 함수들
 * - checklist
 * - settings
 * - today
 */

interface AppActions {
  addChecklist(title: string): void;
  deleteChecklist(id: string): void;
  reorderChecklist(newChecklist: ChecklistItem[]): void;
  updateChecklistImage(id: string, imageUri: string | null): void;
  updateSpaceName(spaceName: string): void;
  updateSettings(settings: Settings): void;
  completeToday(): void;
  checkDateChange(): void;
}

type Store = AppState & AppActions;

export const useAppStore = create<Store>()(
  persist(
    (): Store => ({
      hasCompletedOnboarding: false,

      current: {
        checklist: DEFAULT_CHECKLIST,
        spaceName: DEFAULT_SPACE_NAME,
        settings: DEFAULT_SETTINGS,
        isTodayCompleted: false,
        lastActiveDate: formatDate(new Date()),
        completedAt: null,
      },

      history: [],

      addChecklist: () => {
        // TODO
      },
      deleteChecklist: () => {
        // TODO
      },
      reorderChecklist: () => {
        // TODO
      },
      updateChecklistImage: () => {
        // TODO
      },
      updateSpaceName: () => {
        // TODO
      },
      updateSettings: () => {
        // TODO
      },
      completeToday: () => {
        // TODO
      },
      checkDateChange: () => {
        // TODO
      },
    }),
    {
      name: "worryoff-storage",
    },
  ),
);
