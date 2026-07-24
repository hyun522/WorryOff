import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoDocumentText } from "react-icons/io5";

function HistoryEmptyState() {
  return (
    <div style={containerStyle}>
      <div style={illustrationCircleStyle}>
        <IoDocumentText size={48} color={colors.blue500} />
      </div>

      <Text
        typography="t2"
        fontWeight="bold"
        color={colors.grey900}
        style={{ marginTop: 32, display: "block", textAlign: "center" }}
      >
        아직 완료한 기록이 없습니다.
      </Text>

      <Text
        typography="t5"
        fontWeight="regular"
        color={colors.grey500}
        style={{
          marginTop: 12,
          display: "block",
          whiteSpace: "pre-line",
        }}
      >
        {"오늘 첫 체크를 완료하면\n이곳에서 기록을 확인할 수 있습니다."}
      </Text>
    </div>
  );
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 20px",
  width: "100%",
  textAlign: "center",
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

export default HistoryEmptyState;
