import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppStore as AppState,
  ChecklistItem,
  HistoryRecord,
  Settings,
} from "./types";
import {
  DEFAULT_CHECKLIST,
  DEFAULT_SETTINGS,
  DEFAULT_SPACE_NAME,
} from "./constants";
import { formatDate, isNewDay, isNewMonth } from "./utils";

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
  updateChecklistImage(id: string, imageUri: string): void;
  updateSpaceName(spaceName: string): void;
  updateSettings(settings: Settings): void;
  completeToday(): void;
  checkDateChange(): void;
}

type Store = AppState & AppActions;

export const useAppStore = create<Store>()(
  persist(
    (set): Store => ({
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

      // 새 ChecklistItem을 current.checklist 맨 뒤에 추가 (imageUri는 null로 시작)
      addChecklist: (title) => {
        set((state) => ({
          current: {
            ...state.current,
            checklist: [
              ...state.current.checklist,
              { id: crypto.randomUUID(), title, imageUri: null },
            ],
          },
        }));
      },
      // id가 일치하는 ChecklistItem만 current.checklist에서 제거 (History는 건드리지 않음)
      deleteChecklist: (id) => {
        set((state) => ({
          current: {
            ...state.current,
            checklist: state.current.checklist.filter(
              (item) => item.id !== id,
            ),
          },
        }));
      },
      // dnd-kit이 계산한 최종 배열을 그대로 저장 (순서 재계산 없음)
      reorderChecklist: (newChecklist) => {
        set((state) => ({
          current: {
            ...state.current,
            checklist: newChecklist,
          },
        }));
      },
      // id가 일치하는 ChecklistItem의 imageUri만 등록/교체 (삭제는 지원하지 않음, title/id는 불변)
      updateChecklistImage: (id, imageUri) => {
        set((state) => ({
          current: {
            ...state.current,
            checklist: state.current.checklist.map((item) =>
              item.id === id ? { ...item, imageUri } : item,
            ),
          },
        }));
      },
      // current.spaceName만 교체, current의 다른 필드는 유지
      updateSpaceName: (spaceName) => {
        set((state) => ({
          current: {
            ...state.current,
            spaceName,
          },
        }));
      },
      // current.settings를 통째로 교체 (부분 병합 아님, 새 Settings 객체 전체를 그대로 대입)
      updateSettings: (settings) => {
        set((state) => ({
          current: {
            ...state.current,
            settings,
          },
        }));
      },
      // 오늘 인증 완료 처리: current.isTodayCompleted/completedAt 갱신 + current를
      // Deep Copy한 HistoryRecord를 생성해 history 맨 앞(최신순)에 추가
      completeToday: () => {
        const completedAt = new Date().toISOString();

        set((state) => {
          const newHistory: HistoryRecord = {
            id: crypto.randomUUID(),
            date: state.current.lastActiveDate,
            completedAt,
            status: "completed",
            checklist: state.current.checklist.map((item) => ({ ...item })),
          };

          return {
            current: {
              ...state.current,
              isTodayCompleted: true,
              completedAt,
            },
            history: [newHistory, ...state.history],
          };
        });
      },
      // 날짜가 바뀌었으면: 지난 하루를 History로 스냅샷 저장하고,
      // 월이 바뀌었으면 지난 달 History를 전부 삭제한 뒤, Current(사진/인증 상태)를 초기화
      checkDateChange: () => {
        const today = formatDate(new Date());

        set((state) => {
          // 날짜가 바뀌지 않았다면 아무 작업도 하지 않음
          if (!isNewDay(state.current.lastActiveDate, today)) {
            return state;
          }

          const newHistory: HistoryRecord = {
            id: crypto.randomUUID(),
            date: state.current.lastActiveDate,
            completedAt: state.current.isTodayCompleted
              ? state.current.completedAt
              : null,
            status: state.current.isTodayCompleted
              ? "completed"
              : "incomplete",
            checklist: state.current.checklist.map((item) => ({ ...item })),
          };

          const history = [newHistory, ...state.history];

          // 월이 바뀌었다면 이전 달 History(방금 만든 기록 포함)를 모두 삭제
          const monthChanged = isNewMonth(state.current.lastActiveDate, today);

          return {
            current: {
              ...state.current,
              checklist: state.current.checklist.map((item) => ({
                ...item,
                imageUri: null,
              })),
              isTodayCompleted: false,
              completedAt: null,
              lastActiveDate: today,
            },
            history: monthChanged ? [] : history,
          };
        });
      },
    }),
    {
      name: "worryoff-storage",
    },
  ),
);
