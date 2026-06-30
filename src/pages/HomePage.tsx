import type { CSSProperties } from "react";
import { useState } from "react";
import { Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import {
  IoNotificationsOutline,
  IoCameraOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import PhotoUploadBottomSheet from "../components/PhotoUploadBottomSheet";
import ProgressCard from "../components/ProgressCard";

interface ChecklistItem {
  id: number;
  label: string;
  photoUrl?: string;
}

const initialChecklistItems: ChecklistItem[] = [
  { id: 1, label: "가스 밸브 잠그기", photoUrl: "mock" },
  { id: 2, label: "창문 잠그기", photoUrl: "mock" },
  { id: 3, label: "전기 제품 끄기" },
  { id: 4, label: "현관 문 잠금", photoUrl: "mock" },
];

function CheckCircleIcon({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <div style={checkCircleCompletedStyle}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke={colors.white}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return <div style={checkCircleEmptyStyle} />;
}

function PhotoThumbnail({
  photoUrl,
  onClick,
}: {
  photoUrl?: string;
  onClick: () => void;
}) {
  if (photoUrl && photoUrl !== "mock") {
    return (
      <button
        style={photoThumbnailButtonStyle}
        onClick={onClick}
        aria-label="사진 변경"
      >
        <img src={photoUrl} alt="인증 사진" style={photoImageStyle} />
      </button>
    );
  }
  if (photoUrl === "mock") {
    return (
      <button
        style={photoRegisteredThumbnailStyle}
        onClick={onClick}
        aria-label="사진 변경"
      >
        <IoCheckmarkCircle size={24} color={colors.blue500} />
      </button>
    );
  }
  return (
    <button
      style={photoThumbnailButtonStyle}
      onClick={onClick}
      aria-label="사진 등록"
    >
      <IoCameraOutline size={20} color={colors.grey400} />
    </button>
  );
}

function HomePage() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialChecklistItems,
  );
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const completedCount = checklistItems.filter(
    (item) => !!item.photoUrl,
  ).length;
  const totalCount = checklistItems.length;
  const progressPercent = (completedCount / totalCount) * 100;

  function handleThumbnailClick(itemId: number) {
    setSelectedItemId(itemId);
    setBottomSheetVisible(true);
  }

  function handlePhotoSelected() {
    if (selectedItemId !== null) {
      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === selectedItemId ? { ...item, photoUrl: "mock" } : item,
        ),
      );
    }
    setBottomSheetVisible(false);
    setSelectedItemId(null);
  }

  function handleCloseBottomSheet() {
    setBottomSheetVisible(false);
    setSelectedItemId(null);
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <Text typography="t2" fontWeight="bold" color={colors.grey900}>
          우리집
        </Text>
        <button style={iconButtonStyle} aria-label="알림">
          <IoNotificationsOutline size={24} color={colors.grey600} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={scrollContentStyle}>
        {/* Progress Card */}
        <ProgressCard
          title="오늘의 진행 상태"
          completedCount={completedCount}
          totalCount={totalCount}
          progress={progressPercent}
        />

        {/* Checklist Section */}
        <div style={checklistSectionStyle}>
          <div style={checklistHeaderRowStyle}>
            <Text typography="t4" fontWeight="bold" color={colors.grey900}>
              체크리스트
            </Text>
          </div>

          <div style={checklistListStyle}>
            {checklistItems.map((item, index) => {
              const completed = !!item.photoUrl;
              return (
                <div key={item.id}>
                  <div style={checklistItemStyle}>
                    <CheckCircleIcon completed={completed} />
                    <Text
                      typography="t5"
                      fontWeight="regular"
                      color={completed ? colors.grey900 : colors.grey500}
                      style={{ flex: 1, marginLeft: 12 }}
                    >
                      {item.label}
                    </Text>
                    <PhotoThumbnail
                      photoUrl={item.photoUrl}
                      onClick={() => handleThumbnailClick(item.id)}
                    />
                  </div>
                  {index < checklistItems.length - 1 && (
                    <div style={dividerStyle} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div>
        <div style={ctaWrapperStyle}>
          <Button display="full" size="xlarge" style={primaryButtonStyle}>
            인증하기
          </Button>
        </div>
        <BottomNavigation activeTab="home" />
      </div>

      {/* Photo Upload BottomSheet */}
      <PhotoUploadBottomSheet
        visible={bottomSheetVisible}
        onClose={handleCloseBottomSheet}
        onTakePhoto={handlePhotoSelected}
        onSelectFromAlbum={handlePhotoSelected}
      />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  backgroundColor: colors.grey50,
  boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 20px",
};

const iconButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const scrollContentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "16px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const checklistSectionStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: "20px 0",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
};

const checklistHeaderRowStyle: CSSProperties = {
  padding: "0 20px",
  marginBottom: 8,
};

const checklistListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const checklistItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "14px 20px",
};

const dividerStyle: CSSProperties = {
  height: 1,
  backgroundColor: colors.grey100,
  margin: "0 20px",
};

const checkCircleCompletedStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: colors.blue500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const checkCircleEmptyStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: `2px solid ${colors.grey200}`,
  backgroundColor: colors.white,
  flexShrink: 0,
  boxSizing: "border-box",
};

const photoThumbnailButtonStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 10,
  backgroundColor: colors.grey100,
  flexShrink: 0,
  marginLeft: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  overflow: "hidden",
  padding: 0,
};

const photoRegisteredThumbnailStyle: CSSProperties = {
  ...photoThumbnailButtonStyle,
  backgroundColor: colors.blue50,
};

const photoImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const ctaWrapperStyle: CSSProperties = {
  padding: "10px 20px 20px 20px",
};

const primaryButtonStyle = {
  "--button-background-color": colors.blue500,
  "--button-color": colors.white,
  borderRadius: 16,
} as CSSProperties;

export default HomePage;
