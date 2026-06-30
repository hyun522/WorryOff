import { useState, type CSSProperties } from "react";
import { Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import settingHouse from "../assets/setting-house.png";

const MAX_LENGTH = 20;

function SpaceNamePage() {
  const navigate = useNavigate();
  const [value, setValue] = useState("우리집");

  const hasValue = value.length > 0;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate("/settings")} aria-label="뒤로가기">
          <IoChevronBack size={24} color={colors.grey900} />
        </button>
        <Text typography="t4" fontWeight="bold" color={colors.grey900}>
          공간 이름 설정
        </Text>
        <div style={headerPlaceholderStyle} />
      </div>

      {/* Scrollable Content */}
      <div style={scrollContentStyle}>
        {/* 집 일러스트 */}
        <div style={illustrationWrapStyle}>
          <img
            src={settingHouse}
            alt="집 일러스트"
            style={illustrationStyle}
          />
        </div>

        {/* 안내 텍스트 */}
        <div style={descriptionWrapStyle}>
          <Text typography="t2" fontWeight="bold" color={colors.grey900} style={{ textAlign: "center", display: "block" }}>
            공간의 이름을
          </Text>
          <Text typography="t2" fontWeight="bold" color={colors.grey900} style={{ textAlign: "center", display: "block" }}>
            설정해주세요
          </Text>
          <Text
            typography="t5"
            fontWeight="regular"
            color={colors.grey400}
            style={{ textAlign: "center", display: "block", marginTop: 10 }}
          >
            예) 우리집, 사무실, 원룸 등
          </Text>
        </div>

        {/* 입력 영역 */}
        <div style={inputSectionStyle}>
          <Text
            typography="t6"
            fontWeight="regular"
            color={colors.grey700}
            style={{ display: "block", marginBottom: 10 }}
          >
            공간 이름
          </Text>

          <div style={inputWrapStyle}>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                if (e.target.value.length <= MAX_LENGTH) {
                  setValue(e.target.value);
                }
              }}
              placeholder="공간 이름을 입력해주세요"
              style={inputStyle}
              maxLength={MAX_LENGTH}
            />
            {hasValue && (
              <button
                style={clearButtonStyle}
                onClick={() => setValue("")}
                aria-label="입력값 삭제"
              >
                <IoClose size={18} color={colors.grey400} />
              </button>
            )}
          </div>

          <Text
            typography="t7"
            fontWeight="regular"
            color={colors.grey400}
            style={{ display: "block", textAlign: "right", marginTop: 8 }}
          >
            {value.length}/{MAX_LENGTH}
          </Text>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div style={ctaWrapStyle}>
        <Button
          display="full"
          size="xlarge"
          disabled={!hasValue}
          style={
            {
              "--button-background-color": hasValue
                ? colors.blue500
                : colors.grey400,
              "--button-color": colors.white,
              borderRadius: 16,
            } as CSSProperties
          }
          onClick={() => navigate("/settings")}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
  backgroundColor: colors.white,
};

const headerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  flexShrink: 0,
};

const backButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const headerPlaceholderStyle: CSSProperties = {
  width: 32,
};

const scrollContentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  padding: "0 20px",
};

const illustrationWrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 24,
  paddingBottom: 8,
};

const illustrationStyle: CSSProperties = {
  width: 200,
  height: 200,
  objectFit: "contain",
};

const descriptionWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBottom: 36,
};

const inputSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.white,
  border: `1.5px solid ${colors.grey200}`,
  borderRadius: 14,
  padding: "0 16px",
  boxSizing: "border-box",
};

const inputStyle: CSSProperties = {
  flex: 1,
  height: 56,
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: 16,
  fontWeight: 400,
  color: colors.grey900,
  lineHeight: 1.5,
};

const clearButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const ctaWrapStyle: CSSProperties = {
  padding: "12px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
  flexShrink: 0,
  backgroundColor: colors.white,
};

export default SpaceNamePage;
