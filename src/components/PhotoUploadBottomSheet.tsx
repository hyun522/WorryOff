import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoCameraOutline, IoImagesOutline, IoClose } from "react-icons/io5";

interface PhotoUploadBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto?: () => void;
  onSelectFromAlbum?: () => void;
}

function PhotoUploadBottomSheet({
  visible,
  onClose,
  onTakePhoto,
  onSelectFromAlbum,
}: PhotoUploadBottomSheetProps) {
  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={onClose} />

      {/* Sheet */}
      <div style={sheetStyle}>
        {/* Handle bar */}
        <div style={handleBarStyle} />

        {/* Camera icon + title */}
        <div style={headerSectionStyle}>
          <div style={cameraIconCircleStyle}>
            <IoCameraOutline size={32} color={colors.blue500} />
          </div>
          <Text
            typography="st2"
            fontWeight="bold"
            color={colors.grey900}
            style={{ marginTop: 20, display: "block", textAlign: "center" }}
          >
            사진을 등록해주세요
          </Text>
          <Text
            typography="t6"
            fontWeight="regular"
            color={colors.grey500}
            style={{ marginTop: 8, display: "block", textAlign: "center" }}
          >
            항목 인증을 위해 사진을 등록합니다.
          </Text>
        </div>

        {/* Divider */}
        <div style={sectionDividerStyle} />

        {/* 사진 촬영 */}
        <button style={menuItemStyle} onClick={onTakePhoto}>
          <div style={menuIconCircleStyle}>
            <IoCameraOutline size={22} color={colors.blue500} />
          </div>
          <Text typography="t5" fontWeight="regular" color={colors.grey900}>
            사진 촬영
          </Text>
        </button>

        {/* Divider */}
        <div style={menuDividerStyle} />

        {/* 앨범에서 선택 */}
        <button style={menuItemStyle} onClick={onSelectFromAlbum}>
          <div style={menuIconCircleStyle}>
            <IoImagesOutline size={22} color={colors.blue500} />
          </div>
          <Text typography="t5" fontWeight="regular" color={colors.grey900}>
            앨범에서 선택
          </Text>
        </button>

        {/* 취소 */}
        <div style={cancelWrapperStyle}>
          <button style={cancelButtonStyle} onClick={onClose}>
            <IoClose size={22} color={colors.grey500} />
            <Text
              typography="t5"
              fontWeight="bold"
              color={colors.grey900}
              style={{ marginLeft: 16 }}
            >
              취소
            </Text>
          </button>
        </div>

        {/* Safe area spacing */}
        <div
          style={{
            height: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          }}
        />
      </div>
    </>
  );
}

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 100,
};

const sheetStyle: CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: colors.white,
  borderRadius: "20px 20px 0 0",
  zIndex: 101,
  overflow: "hidden",
};

const handleBarStyle: CSSProperties = {
  width: 36,
  height: 4,
  borderRadius: 100,
  backgroundColor: colors.grey200,
  margin: "12px auto 0",
};

const headerSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "28px 24px 28px",
};

const cameraIconCircleStyle: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  backgroundColor: colors.blue50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionDividerStyle: CSSProperties = {
  height: 1,
  backgroundColor: colors.grey100,
  margin: "0 24px",
};

const menuItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "18px 24px",
  background: "none",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

const menuDividerStyle: CSSProperties = {
  height: 1,
  backgroundColor: colors.grey100,
  margin: "0 24px",
};

const menuIconCircleStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: colors.blue50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 16,
  flexShrink: 0,
};

const cancelWrapperStyle: CSSProperties = {
  padding: "12px 24px 12px",
};

const cancelButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "16px 20px",
  background: colors.grey100,
  border: "none",
  borderRadius: 16,
  cursor: "pointer",
  textAlign: "left",
};

export default PhotoUploadBottomSheet;
