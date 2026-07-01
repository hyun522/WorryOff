import { useState, type CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoChevronForward, IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";

type DayKey = "월" | "화" | "수" | "목" | "금" | "토" | "일";
type DropdownType = "ampm" | "hour" | "minute" | null;

const DAYS: DayKey[] = ["월", "화", "수", "목", "금", "토", "일"];
const AMPM_OPTIONS = ["오전", "오후"];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTE_OPTIONS = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

interface DropdownProps {
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function Dropdown({
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: DropdownProps) {
  return (
    <div style={{ ...dropdownWrapStyle, zIndex: isOpen ? 10 : 1 }}>
      <button
        style={dropdownTriggerStyle}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <Text typography="t5" fontWeight="regular" color={colors.grey900}>
          {value}
        </Text>
        <IoChevronDown size={16} color={colors.grey500} />
      </button>
      {isOpen && (
        <div style={dropdownMenuStyle}>
          {options.map((opt) => (
            <button
              key={opt}
              style={dropdownItemStyle}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(opt);
              }}
            >
              <Text
                typography="t6"
                fontWeight={opt === value ? "bold" : "regular"}
                color={opt === value ? colors.blue500 : colors.grey800}
              >
                {opt}
              </Text>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<DayKey[]>(["월"]);
  const [ampm, setAmpm] = useState("오전");
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  const toggleDay = (day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleDropdownToggle = (type: NonNullable<DropdownType>) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleDropdownSelect = (
    type: NonNullable<DropdownType>,
    value: string,
  ) => {
    if (type === "ampm") setAmpm(value);
    else if (type === "hour") setHour(value);
    else if (type === "minute") setMinute(value);
    setOpenDropdown(null);
  };

  return (
    <div style={containerStyle} onClick={() => setOpenDropdown(null)}>
      {/* Header */}
      <div style={headerStyle}>
        <Text typography="t2" fontWeight="bold" color={colors.grey900}>
          설정
        </Text>
      </div>

      {/* Scrollable Content */}
      <div style={scrollContentStyle}>
        {/* 공간 이름 설정 */}
        <Text
          typography="t6"
          fontWeight="regular"
          color={colors.grey500}
          style={{ marginBottom: 8, display: "block" }}
        >
          공간 이름 설정
        </Text>

        <button
          style={navCardStyle}
          onClick={() => navigate("/settings/space-name")}
        >
          <Text typography="t5" fontWeight="regular" color={colors.grey900}>
            우리집
          </Text>
          <IoChevronForward size={20} color={colors.grey400} />
        </button>

        <div style={{ height: 12 }} />

        <button
          style={navCardStyle}
          onClick={() => navigate("/settings/checklist")}
        >
          <Text typography="t5" fontWeight="regular" color={colors.grey900}>
            체크리스트 지정
          </Text>
          <IoChevronForward size={20} color={colors.grey400} />
        </button>

        <div style={{ height: 24 }} />

        {/* 알림 설정 카드 */}
        <div style={notificationCardStyle} onClick={(e) => e.stopPropagation()}>
          <Text typography="t4" fontWeight="bold" color={colors.grey900}>
            알림 설정
          </Text>

          {/* 반복 */}
          <div>
            <Text
              typography="t6"
              fontWeight="regular"
              color={colors.grey500}
              style={{ display: "block", marginBottom: 10 }}
            >
              반복
            </Text>
            <div style={dayRowStyle}>
              {DAYS.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    style={dayButtonStyle(active)}
                    onClick={() => toggleDay(day)}
                  >
                    <Text
                      typography="t6"
                      fontWeight={active ? "bold" : "regular"}
                      color={active ? colors.white : colors.grey600}
                    >
                      {day}
                    </Text>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={dividerStyle} />

          {/* 시간 */}
          <div>
            <Text
              typography="t6"
              fontWeight="regular"
              color={colors.grey500}
              style={{ display: "block", marginBottom: 10 }}
            >
              시간
            </Text>
            <div style={dropdownRowStyle}>
              <Dropdown
                value={ampm}
                options={AMPM_OPTIONS}
                isOpen={openDropdown === "ampm"}
                onToggle={() => handleDropdownToggle("ampm")}
                onSelect={(v) => handleDropdownSelect("ampm", v)}
              />
              <Dropdown
                value={hour}
                options={HOUR_OPTIONS}
                isOpen={openDropdown === "hour"}
                onToggle={() => handleDropdownToggle("hour")}
                onSelect={(v) => handleDropdownSelect("hour", v)}
              />
              <Dropdown
                value={minute}
                options={MINUTE_OPTIONS}
                isOpen={openDropdown === "minute"}
                onToggle={() => handleDropdownToggle("minute")}
                onSelect={(v) => handleDropdownSelect("minute", v)}
              />
            </div>
          </div>

          <div style={dividerStyle} />

          {/* 알림 활성화 */}
          <div style={toggleRowStyle}>
            <Text typography="t5" fontWeight="regular" color={colors.grey900}>
              알림 활성화
            </Text>
            <button
              style={toggleTrackStyle(notificationEnabled)}
              onClick={() => setNotificationEnabled((prev) => !prev)}
              role="switch"
              aria-checked={notificationEnabled}
            >
              <div style={toggleThumbStyle} />
            </button>
          </div>
        </div>
      </div>

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
  justifyContent: "center",
  padding: "20px 0 20px",
  flexShrink: 0,
};

const scrollContentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "16px 20px 16px",
  display: "flex",
  flexDirection: "column",
};

const navCardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 14,
  padding: "18px 20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  border: `1px solid ${colors.grey100}`,
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
};

const notificationCardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  border: `1px solid ${colors.grey100}`,
};

const dayRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: 6,
};

const dayButtonStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  minWidth: 0,
  aspectRatio: "1",
  borderRadius: 10,
  backgroundColor: active ? colors.blue500 : colors.white,
  border: `1.5px solid ${active ? colors.blue500 : colors.grey200}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
});

const dividerStyle: CSSProperties = {
  height: 1,
  backgroundColor: colors.grey100,
  margin: "0 -20px",
};

const dropdownRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: 8,
};

const dropdownWrapStyle: CSSProperties = {
  flex: 1,
  position: "relative",
};

const dropdownTriggerStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: `1.5px solid ${colors.grey200}`,
  backgroundColor: colors.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  boxSizing: "border-box",
};

const dropdownMenuStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  backgroundColor: colors.white,
  borderRadius: 10,
  border: `1.5px solid ${colors.grey200}`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
  zIndex: 100,
  maxHeight: 200,
  overflowY: "auto",
};

const dropdownItemStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "block",
  boxSizing: "border-box",
};

const toggleRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

const toggleTrackStyle = (enabled: boolean): CSSProperties => ({
  width: 51,
  height: 31,
  borderRadius: 15.5,
  backgroundColor: enabled ? colors.blue500 : colors.grey300,
  padding: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: enabled ? "flex-end" : "flex-start",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background-color 0.2s",
});

const toggleThumbStyle: CSSProperties = {
  width: 27,
  height: 27,
  borderRadius: "50%",
  backgroundColor: colors.white,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

export default SettingsPage;
