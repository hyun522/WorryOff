import { useState, type CSSProperties } from "react";
import { Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import addChecklistDocument from "../assets/add-checklist-add-document.png";

const MAX_LENGTH = 20;

function AddChecklistItemPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const hasValue = value.length > 0;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => navigate("/settings/checklist")}
          aria-label="뒤로가기"
        >
          <IoChevronBack size={24} color={colors.grey900} />
        </button>
        <Text typography="t3" fontWeight="bold" color={colors.grey900}>
          항목 추가
        </Text>
        <div style={headerPlaceholderStyle} />
      </div>

      {/* Scrollable Content */}
      <div style={scrollContentStyle}>
        {/* 안내 이미지 */}
        <div style={illustrationWrapStyle}>
          <img
            src={addChecklistDocument}
            alt="체크리스트 항목 추가"
            style={illustrationStyle}
          />
        </div>

        {/* 안내 텍스트 */}
        <div style={descriptionWrapStyle}>
          <Text
            typography="t2"
            fontWeight="bold"
            color={colors.grey900}
            style={{ textAlign: "center", display: "block" }}
          >
            새 체크리스트 항목을
            <br />
            추가해주세요
          </Text>
        </div>

        {/* 입력 영역 */}
        <div style={inputSectionStyle}>
          <Text
            typography="t6"
            fontWeight="bold"
            color={colors.grey700}
            style={{ display: "block", marginBottom: 10 }}
          >
            항목 이름
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
              placeholder="예) 가스 밸브 잠그기"
              style={inputStyle}
              maxLength={MAX_LENGTH}
            />
          </div>
          <div style={inputInfoRowStyle}>
            <Text
              typography="t7"
              fontWeight="regular"
              color={colors.grey500}
              style={{ display: "block" }}
            >
              항목 이름은 20자 이내로 입력해주세요.
            </Text>
            <Text
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              style={{
                display: "block",
                textAlign: "right",
              }}
            >
              {value.length}/{MAX_LENGTH}
            </Text>
          </div>
        </div>
      </div>

      {/* 추가 버튼 */}
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
          onClick={() => navigate("/settings/checklist")}
        >
          추가
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
  padding: "24px 24px",
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
  paddingTop: 32,
  paddingBottom: 20,
};

const illustrationStyle: CSSProperties = {
  width: 180,
  height: 180,
  objectFit: "contain",
};

const descriptionWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBottom: 40,

  textAlign: "center",
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

const inputInfoRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "3px",
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

const ctaWrapStyle: CSSProperties = {
  padding: "12px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
  flexShrink: 0,
  backgroundColor: colors.white,
};

export default AddChecklistItemPage;
