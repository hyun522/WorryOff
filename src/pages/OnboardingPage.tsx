import { Asset, Button, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import type { CSSProperties } from "react";

import onboardingHouse from "../assets/onboarding-house.png";

interface OnboardingPageProps {
  /**
   * "시작하기" 버튼을 눌렀을 때 실행돼요.
   * 네비게이션은 이번 작업 범위 밖이라, 기본값은 동작하지 않아요.
   */
  onStart?: () => void;
}

function OnboardingPage({ onStart }: OnboardingPageProps) {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <Asset.Image
          alt="집과 안전을 상징하는 일러스트"
          src={onboardingHouse}
          frameShape={{ width: 280, height: 220 }}
          backgroundColor="transparent"
        />

        <Text
          typography="st2"
          fontWeight="bold"
          color={colors.grey900}
          style={titleStyle}
        >
          {"오늘의 걱정을 끄셨나요?"}
        </Text>

        <Text
          typography="t6"
          fontWeight="regular"
          color={colors.grey500}
          style={descriptionStyle}
        >
          {
            "소중한 공간의 안전을 확인하고\n사진으로 기록해 보세요.\n하루 1번으로 걱정을 OFF!"
          }
        </Text>
      </div>

      <div style={ctaStyle}>
        <Button
          display="full"
          size="xlarge"
          onClick={onStart}
          style={primaryButtonStyle}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  boxSizing: "border-box",
  padding: "0 24px",
  backgroundColor: colors.white,
};

const contentStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const titleStyle: CSSProperties = {
  marginTop: 56,
  width: "100%",
  whiteSpace: "pre-line",
  textAlign: "center",
  lineHeight: 1.3,
};

const descriptionStyle: CSSProperties = {
  marginTop: 24,
  width: "100%",
  whiteSpace: "pre-line",
  textAlign: "center",
  lineHeight: 1.6,
};

const ctaStyle: CSSProperties = {
  paddingTop: 16,
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
};

const primaryButtonStyle = {
  "--button-background-color": colors.blue500,
  "--button-color": colors.white,
  borderRadius: 16,
} as CSSProperties;

export default OnboardingPage;
