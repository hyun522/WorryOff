import type { ChecklistItem, Settings } from "./types";

export const DEFAULT_SPACE_NAME = "우리집";

export const DEFAULT_SETTINGS: Settings = {
  notificationEnabled: false,
  days: [],
  time: "09:00",
};

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "1", title: "가스 밸브 잠그기", imageUri: null },
  { id: "2", title: "창문 잠그기", imageUri: null },
  { id: "3", title: "전기 제품 끄기", imageUri: null },
  { id: "4", title: "현관 문 잠금", imageUri: null },
];
