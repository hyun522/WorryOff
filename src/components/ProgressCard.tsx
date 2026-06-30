import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";

interface ProgressCardProps {
  title: string;
  completedCount: number;
  totalCount: number;
  progress: number;
}

function ProgressCard({
  title,
  completedCount,
  totalCount,
  progress,
}: ProgressCardProps) {
  return (
    <div style={progressCardStyle}>
      <Text typography="t6" fontWeight="bold" color={colors.grey600}>
        {title}
      </Text>
      <div>
        <Text
          typography="st2"
          fontWeight="bold"
          color={colors.grey900}
          style={{ marginTop: 6, display: "block" }}
        >
          {completedCount}{" "}
          <Text typography="st6" color={colors.grey500}>
            / {totalCount} 완료
          </Text>
        </Text>
      </div>
      <div style={progressBarTrackStyle}>
        <div
          style={{
            ...progressBarFillStyle,
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

const progressCardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: "20px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
};

const progressBarTrackStyle: CSSProperties = {
  marginTop: 14,
  height: 8,
  borderRadius: 100,
  backgroundColor: colors.grey100,
  overflow: "hidden",
};

const progressBarFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 100,
  backgroundColor: colors.blue500,
  transition: "width 0.3s ease",
};

export default ProgressCard;
