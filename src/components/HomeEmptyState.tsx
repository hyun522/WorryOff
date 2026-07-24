import type { CSSProperties } from "react";
import { Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function HomeEmptyState() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={illustrationCircleStyle}>
        <IoSettingsSharp size={48} color={colors.blue500} />
      </div>

      <Text
        typography="t2"
        fontWeight="bold"
        color={colors.grey900}
        style={{ marginTop: 32, display: "block", textAlign: "center" }}
      >
        아직 공간이 설정되지 않았습니다.
      </Text>

      <Text
        typography="t5"
        fontWeight="regular"
        color={colors.grey500}
        style={{
          marginTop: 12,
          display: "block",
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {"공간 이름과 체크리스트를 설정하면\n오늘의 확인을 시작할 수 있습니다."}
      </Text>

      <div style={ctaWrapperStyle}>
        <Button
          display="full"
          size="xlarge"
          onClick={() => navigate("/settings")}
          style={ctaButtonStyle}
        >
          설정하러 가기
        </Button>
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
  padding: "0 4px",
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

const ctaWrapperStyle: CSSProperties = {
  marginTop: 32,
  width: "100%",
};

const ctaButtonStyle = {
  "--button-background-color": colors.blue500,
  "--button-color": colors.white,
  borderRadius: 16,
} as CSSProperties;

export default HomeEmptyState;
