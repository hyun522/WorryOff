import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoCameraOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import BottomNavigation from "../components/BottomNavigation";
import type { TabType } from "../components/BottomNavigation";

interface HistoryRecord {
  id: number;
  date: string;
  time: string | null;
  isCompleted: boolean;
  photos: (string | null)[];
}

interface HistoryPageProps {
  onNavigate?: (tab: TabType) => void;
}

const mockRecords: HistoryRecord[] = [
  {
    id: 1,
    date: "2026.06.29 (일)",
    time: "오전 08:42",
    isCompleted: true,
    photos: [
      "https://picsum.photos/seed/wr1/120/120",
      "https://picsum.photos/seed/wr2/120/120",
      "https://picsum.photos/seed/wr3/120/120",
      "https://picsum.photos/seed/wr4/120/120",
      "https://picsum.photos/seed/wr5/120/120",
    ],
  },
  {
    id: 2,
    date: "2026.06.28 (토)",
    time: "오전 08:31",
    isCompleted: true,
    photos: [
      "https://picsum.photos/seed/wr6/120/120",
      "https://picsum.photos/seed/wr7/120/120",
      "https://picsum.photos/seed/wr8/120/120",
    ],
  },
  {
    id: 3,
    date: "2026.06.27 (금)",
    time: "오전 08:28",
    isCompleted: true,
    photos: [
      "https://picsum.photos/seed/wr9/120/120",
      "https://picsum.photos/seed/wr10/120/120",
    ],
  },
  {
    id: 4,
    date: "2026.06.01 (월)",
    time: null,
    isCompleted: false,
    photos: [null, null],
  },
  // 한 달 이전 기록 — isWithinLastMonth 필터에 의해 표시되지 않음
  {
    id: 5,
    date: "2026.05.20 (수)",
    time: "오전 09:15",
    isCompleted: true,
    photos: ["https://picsum.photos/seed/wr11/120/120"],
  },
];

const mockStats = {
  streakDays: 7,
  monthTotal: 22,
  monthCompleted: 20,
};

function isWithinLastMonth(dateStr: string): boolean {
  const match = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!match) return false;
  const [, year, month, day] = match;
  const recordDate = new Date(Number(year), Number(month) - 1, Number(day));
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return recordDate >= oneMonthAgo;
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
  record: HistoryRecord;
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

function HistoryPage({ onNavigate }: HistoryPageProps) {
  const recentRecords = mockRecords.filter((r) => isWithinLastMonth(r.date));

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
        {/* Summary Card */}
        <div style={summaryCardStyle}>
          <span style={emojiStyle}>🔥</span>
          <div style={summaryTextColStyle}>
            <Text typography="t2" fontWeight="bold" color={colors.white}>
              {mockStats.streakDays}일 연속 완료
            </Text>
            <Text
              typography="t5"
              fontWeight="regular"
              color={colors.white}
              style={{ marginTop: 6, display: "block" }}
            >
              이번 달 {mockStats.monthTotal}일 중 {mockStats.monthCompleted}일
              완료
            </Text>
          </div>
        </div>

        {/* Record List */}
        <div style={recordListStyle}>
          {recentRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onClick={() => {
                // 상세 페이지 이동 추후 구현
              }}
            />
          ))}
        </div>
      </div>

      {/* BottomNavigation — 고정 */}
      <BottomNavigation activeTab="history" onTabChange={onNavigate} />
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
  padding: "20px 20px",
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
