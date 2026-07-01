import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import homeCompletedContent from "../assets/home-completed-content.png";

interface CertificationCompleteModalProps {
  visible: boolean;
  onViewHistory: () => void;
  onClose: () => void;
}

function CertificationCompleteModal({
  visible,
  onViewHistory,
  onClose,
}: CertificationCompleteModalProps) {
  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Illustration */}
        <div style={illustrationAreaStyle}>
          <img
            src={homeCompletedContent}
            alt="인증 완료"
            style={illustrationImageStyle}
          />
        </div>

        {/* Title */}
        <div style={titleContainerStyle}>
          <Text typography="t2" fontWeight="bold" color={colors.grey900}>
            오늘 인증이
          </Text>
          <Text typography="t2" fontWeight="bold" color={colors.grey900}>
            완료되었습니다!
          </Text>
        </div>

        {/* Subtitle */}
        <div style={subtitleContainerStyle}>
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

        {/* Buttons */}
        <div style={buttonGroupStyle}>
          <button style={viewHistoryButtonStyle} onClick={onViewHistory}>
            <Text typography="t4" fontWeight="bold" color={colors.white}>
              기록 보기
            </Text>
          </button>
          <button style={closeButtonStyle} onClick={onClose}>
            <Text typography="t4" fontWeight="regular" color={colors.grey900}>
              닫기
            </Text>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "0 24px",
};

const modalStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: 24,
  padding: "32px 24px 24px",
  width: "100%",
};

const illustrationAreaStyle: CSSProperties = {
  position: "relative",
  height: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const illustrationImageStyle: CSSProperties = {
  height: 200,
  width: "auto",
  objectFit: "contain",
};

const titleContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 24,
};

const subtitleContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 10,
  gap: 4,
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 28,
};

const viewHistoryButtonStyle: CSSProperties = {
  width: "100%",
  height: 58,
  borderRadius: 16,
  backgroundColor: colors.blue500,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closeButtonStyle: CSSProperties = {
  width: "100%",
  height: 58,
  borderRadius: 16,
  backgroundColor: colors.grey100,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default CertificationCompleteModal;
