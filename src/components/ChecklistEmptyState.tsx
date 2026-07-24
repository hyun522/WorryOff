import type { CSSProperties } from "react";
import { Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoListOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ChecklistEmptyState() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={illustrationCircleStyle}>
        <IoListOutline size={40} color={colors.blue500} />
      </div>

      <Text
        typography="t3"
        fontWeight="bold"
        color={colors.grey900}
        style={{ marginTop: 20, display: "block", textAlign: "center" }}
      >
        아직 체크리스트가 없습니다.
      </Text>

      <Text
        typography="t6"
        fontWeight="regular"
        color={colors.grey500}
        style={{ marginTop: 8, display: "block", textAlign: "center" }}
      >
        외출 전에 확인할 물건을 추가해보세요.
      </Text>

      <div style={ctaWrapperStyle}>
        <Button
          display="full"
          size="large"
          onClick={() => navigate("/settings/checklist/add")}
          style={ctaButtonStyle}
        >
          + 체크리스트 추가
        </Button>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: "40px 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
  boxSizing: "border-box",
};

const illustrationCircleStyle: CSSProperties = {
  width: 88,
  height: 88,
  borderRadius: "50%",
  backgroundColor: colors.blue50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ctaWrapperStyle: CSSProperties = {
  marginTop: 24,
  width: "100%",
};

const ctaButtonStyle = {
  "--button-background-color": colors.blue500,
  "--button-color": colors.white,
  borderRadius: 14,
} as CSSProperties;

export default ChecklistEmptyState;
