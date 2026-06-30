import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";

function CompletedContent() {
  return (
    <div style={containerStyle}>
      <div style={illustrationCircleStyle}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M11 30L24 43L49 17"
            stroke={colors.blue500}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <Text
        typography="t2"
        fontWeight="bold"
        color={colors.grey900}
        style={{ marginTop: 32, display: "block", textAlign: "center" }}
      >
        오늘의 걱정 OFF!
      </Text>

      <div style={subtitleStyle}>
        <div>
          <Text typography="t5" fontWeight="regular" color={colors.grey500}>
            모든 체크리스트를 완료했어요.
          </Text>
        </div>
        <div>
          <Text typography="t5" fontWeight="regular" color={colors.grey500}>
            내일 다시 확인해주세요.
          </Text>
        </div>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 24,
};

const illustrationCircleStyle: CSSProperties = {
  width: 144,
  height: 144,
  borderRadius: "50%",
  backgroundColor: colors.blue50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const subtitleStyle: CSSProperties = {
  marginTop: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

export default CompletedContent;
