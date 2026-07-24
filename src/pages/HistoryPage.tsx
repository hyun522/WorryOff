import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoCameraOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import BottomNavigation from "../components/BottomNavigation";
import HistoryEmptyState from "../components/HistoryEmptyState";
import { useAppStore } from "../store/useAppStore";
import type { HistoryRecord } from "../store/types";

// 화면 렌더링 전용 표시 형태 (store의 HistoryRecord를 사람이 읽는 문자열로 변환한 결과)
interface DisplayRecord {
  id: string;
  date: string;
  time: string | null;
  isCompleted: boolean;
  photos: (string | null)[];
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// "YYYY-MM-DD" -> "2026.06.29 (일)"
function formatDisplayDate(date: string): string {
  const [year, month, day] = date.split("-");
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  return `${year}.${month}.${day} (${DAY_LABELS[dateObj.getDay()]})`;
}

// ISO 8601 completedAt -> "오전 08:42" (미인증이면 null)
function formatDisplayTime(completedAt: string | null): string | null {
  if (!completedAt) return null;
  const d = new Date(completedAt);
  const hour24 = d.getHours();
  const ampm = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${ampm} ${String(hour12).padStart(2, "0")}:${minute}`;
}

// 두 "YYYY-MM-DD"가 정확히 하루 차이인지 확인 (streak 계산용)
function isConsecutiveDay(earlierDate: string, laterDate: string): boolean {
  const [ey, em, ed] = earlierDate.split("-").map(Number);
  const [ly, lm, ld] = laterDate.split("-").map(Number);
  const earlier = new Date(ey, em - 1, ed);
  const later = new Date(ly, lm - 1, ld);
  const diffDays = Math.round((later.getTime() - earlier.getTime()) / 86400000);
  return diffDays === 1;
}

// history는 최신순 배열 -> 맨 앞부터 "완료 + 하루 간격"이 끊기기 전까지의 연속 일수
function calculateStreakDays(history: HistoryRecord[]): number {
  let streak = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].status !== "completed") break;
    if (i > 0 && !isConsecutiveDay(history[i].date, history[i - 1].date)) {
      break;
    }
    streak++;
  }
  return streak;
}

function toDisplayRecord(record: HistoryRecord): DisplayRecord {
  return {
    id: record.id,
    date: formatDisplayDate(record.date),
    time: formatDisplayTime(record.completedAt),
    isCompleted: record.status === "completed",
    photos: record.checklist.map((item) => item.imageUri),
  };
}

function PhotoThumbnail({ photoUrl }: { photoUrl: string | null }) {
  if (!photoUrl) {
    return (
      <div style={photoPlaceholderStyle}>
        <IoCameraOutline size={20} color={colors.grey400} />
        <Text
          typography="t7"
          fontWeight="regular"
          color={colors.grey400}
          style={{ marginTop: 3, display: "block", textAlign: "center" }}
        >
          사진 없음
        </Text>
      </div>
    );
  }

  return (
    <div style={photoThumbnailStyle}>
      <img src={photoUrl} alt="인증 사진" style={photoImageStyle} />
    </div>
  );
}

function StatusBadge({ isCompleted }: { isCompleted: boolean }) {
  if (isCompleted) {
    return (
      <div style={statusRowStyle}>
        <FaCheckCircle size={16} color={colors.blue500} />
        <Text typography="t6" fontWeight="bold" color={colors.blue500}>
          100% 완료
        </Text>
      </div>
    );
  }
  return (
    <div style={statusRowStyle}>
      <div style={incompleteIconStyle}>
        <span style={exclamationStyle}>!</span>
      </div>
      <Text typography="t6" fontWeight="regular" color={colors.grey500}>
        미완료
      </Text>
    </div>
  );
}

function RecordCard({
  record,
  onClick,
}: {
  record: DisplayRecord;
  onClick: () => void;
}) {
  return (
    <div
      style={cardStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {/* 날짜/상태 정보 영역 */}
      <div style={cardInfoRowStyle}>
        <div style={cardTextColStyle}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            {record.date}
          </Text>
          <Text
            typography="t6"
            fontWeight="regular"
            color={colors.grey500}
            style={{ marginTop: 4, display: "block" }}
          >
            {record.time ?? "미인증"}
          </Text>
        </div>
        <StatusBadge isCompleted={record.isCompleted} />
      </div>

      {/* 사진 영역 — 가로 스크롤 */}
      <div style={photosRowStyle} className="no-scrollbar">
        {record.photos.map((photo, i) => (
          <PhotoThumbnail key={i} photoUrl={photo} />
        ))}
      </div>
    </div>
  );
}

function HistoryPage() {
  const history = useAppStore((state) => state.history);

  // checkDateChange()가 매달 이전 달 기록을 정리하므로, history는 항상 이번 달 기록만 담고 있음
  const streakDays = calculateStreakDays(history);
  const monthTotal = history.length;
  const monthCompleted = history.filter(
    (record) => record.status === "completed",
  ).length;
  const records = history.map(toDisplayRecord);

  return (
    <div style={containerStyle}>
      {/* Header — 고정 */}
      <div style={headerStyle}>
        <Text typography="t2" fontWeight="bold" color={colors.grey900}>
          기록
        </Text>
      </div>

      {/* Content — 세로 스크롤 */}
      <div style={scrollContentStyle}>
        {history.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <>
            {/* Summary Card */}
            <div style={summaryCardStyle}>
              <span style={emojiStyle}>🔥</span>
              <div style={summaryTextColStyle}>
                <Text typography="t2" fontWeight="bold" color={colors.white}>
                  {streakDays}일 연속 완료
                </Text>
                <Text
                  typography="t5"
                  fontWeight="regular"
                  color={colors.white}
                  style={{ marginTop: 6, display: "block" }}
                >
                  이번 달 {monthTotal}일 중 {monthCompleted}일 완료
                </Text>
              </div>
            </div>

            {/* Record List */}
            <div style={recordListStyle}>
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onClick={() => {
                    // 상세 페이지 이동 추후 구현
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* BottomNavigation — 고정 */}
      <BottomNavigation />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
  backgroundColor: colors.grey50,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "24px 24px",
  flexShrink: 0,
};

const scrollContentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0 20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const summaryCardStyle: CSSProperties = {
  backgroundColor: colors.blue500,
  borderRadius: 20,
  padding: "24px 20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
};
const summaryTextColStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const emojiStyle: CSSProperties = {
  fontSize: 44,
  lineHeight: 1,
  flexShrink: 0,
};

const recordListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const cardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
  cursor: "pointer",
  boxSizing: "border-box",
};

const cardInfoRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const cardTextColStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const photosRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: 6,
  overflowX: "auto",
  scrollbarWidth: "none",
};

const photoThumbnailStyle: CSSProperties = {
  width: 68,
  height: 68,
  borderRadius: 8,
  overflow: "hidden",
  flexShrink: 0,
};

const photoPlaceholderStyle: CSSProperties = {
  width: 68,
  height: 68,
  borderRadius: 8,
  backgroundColor: colors.grey50,
  border: `1.5px dashed ${colors.grey300}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
};

const photoImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const statusRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const incompleteIconStyle: CSSProperties = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  backgroundColor: colors.grey400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const exclamationStyle: CSSProperties = {
  color: "white",
  fontSize: 11,
  fontWeight: "bold",
  lineHeight: 1,
};

export default HistoryPage;
