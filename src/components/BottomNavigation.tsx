import type { CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { AiFillHome } from "react-icons/ai";
import { IoDocumentText, IoSettingsSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

interface TabConfig {
  key: string;
  path: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}

const tabs: TabConfig[] = [
  { key: "home", path: "/home", label: "홈", Icon: AiFillHome },
  { key: "history", path: "/history", label: "기록", Icon: IoDocumentText },
  { key: "settings", path: "/settings", label: "설정", Icon: IoSettingsSharp },
];

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = tabs.find((t) =>
    location.pathname.startsWith(t.path)
  )?.key;

  return (
    <div style={tabBarStyle}>
      {tabs.map(({ key, path, label, Icon }) => {
        const active = activeKey === key;
        const iconColor = active ? colors.blue500 : colors.grey400;
        return (
          <button
            key={key}
            style={tabItemStyle}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon size={24} color={iconColor} />
            <Text
              typography="t7"
              fontWeight={active ? "bold" : "regular"}
              color={iconColor}
              style={{ marginTop: 4 }}
            >
              {label}
            </Text>
          </button>
        );
      })}
    </div>
  );
}

const tabBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: `8px 0 calc(env(safe-area-inset-bottom, 0px) + 8px)`,
  borderTop: `1px solid ${colors.grey100}`,
  backgroundColor: colors.white,
};

const tabItemStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  padding: "10px 0",
  cursor: "pointer",
  background: colors.white,
  border: "none",
};

export default BottomNavigation;
