import { useState, useRef, type CSSProperties } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { IoChevronBack, IoReorderThreeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ChecklistItem {
  id: number;
  label: string;
}

const mockItems: ChecklistItem[] = [
  { id: 1, label: "가스 밸브 잠그기" },
  { id: 2, label: "창문 잠그기" },
  { id: 3, label: "전기 제품 끄기" },
];

const DELETE_WIDTH = 80;

function SwipeableItem({
  item,
  onDelete,
}: {
  item: ChecklistItem;
  onDelete: (id: number) => void;
}) {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startXRef = useRef(0);
  const startTranslateXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
    startTranslateXRef.current = translateX;
    hasDraggedRef.current = false;
    setIsAnimating(false);
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const diff = startXRef.current - e.clientX;
    if (Math.abs(diff) > 5) {
      hasDraggedRef.current = true;
    }
    const next = startTranslateXRef.current + diff;
    setTranslateX(Math.max(0, Math.min(DELETE_WIDTH, next)));
  };

  const settle = () => {
    setIsAnimating(true);
    if (!hasDraggedRef.current && translateX > 0) {
      setTranslateX(0);
      return;
    }
    if (translateX > DELETE_WIDTH / 2) {
      setTranslateX(DELETE_WIDTH);
    } else {
      setTranslateX(0);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...swipeWrapperStyle,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        opacity: isDragging ? 0.85 : 1,
      }}
    >
      {/* Delete area — behind the card */}
      <div
        style={deleteAreaStyle}
        onClick={() => onDelete(item.id)}
        role="button"
        aria-label="삭제"
      >
        <Text typography="t6" fontWeight="bold" color={colors.white}>
          삭제
        </Text>
      </div>

      {/* Swipeable card */}
      <div
        ref={cardRef}
        style={{
          ...cardStyle,
          transform: `translateX(-${translateX}px)`,
          transition: isAnimating ? "transform 0.25s ease" : "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={settle}
        onPointerCancel={settle}
      >
        <div style={{ flex: 1 }}>
          <Text typography="t5" fontWeight="regular" color={colors.grey900}>
            {item.label}
          </Text>
        </div>
        <div
          {...listeners}
          {...attributes}
          onPointerDown={(e) => {
            e.stopPropagation();
            listeners?.onPointerDown?.(e);
          }}
          style={dragHandleStyle}
          aria-label="순서 변경"
        >
          <IoReorderThreeOutline size={22} color={colors.grey400} />
        </div>
      </div>
    </div>
  );
}

function ChecklistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistItem[]>(mockItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => navigate("/settings")}
          aria-label="뒤로가기"
        >
          <IoChevronBack size={24} color={colors.grey900} />
        </button>
        <Text typography="t3" fontWeight="bold" color={colors.grey900}>
          체크리스트 항목
        </Text>
        <div style={headerPlaceholderStyle} />
      </div>

      {/* Scrollable content */}
      <div style={scrollContentStyle}>
        <Text
          typography="t6"
          fontWeight="regular"
          color={colors.grey500}
          style={{ display: "block", marginBottom: 20 }}
        >
          체크리스트 항목을 관리하고 순서를 변경할 수 있어요.
        </Text>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={listStyle}>
              {items.map((item) => (
                <SwipeableItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add item button */}
        <button
          style={addButtonStyle}
          onClick={() => navigate("/settings/checklist/add")}
        >
          <Text typography="t5" fontWeight="regular" color={colors.blue500}>
            + 항목 추가
          </Text>
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
  backgroundColor: colors.grey50,
};

const headerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px 24px",
  flexShrink: 0,
  backgroundColor: colors.grey50,
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
  padding: "16px 20px",
  display: "flex",
  flexDirection: "column",
};

const listStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 12,
};

const swipeWrapperStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 14,
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
  backgroundColor: "#FF3B30",
};

const deleteAreaStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: DELETE_WIDTH,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const dragHandleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  touchAction: "none",
  cursor: "grab",
};

const cardStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  backgroundColor: colors.white,
  display: "flex",
  alignItems: "center",
  padding: "20px 16px",
  userSelect: "none",
  touchAction: "pan-y",
};

const addButtonStyle: CSSProperties = {
  backgroundColor: colors.blue50,
  border: `1.5px dashed ${colors.blue300}`,
  borderRadius: 14,
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 4,
};

export default ChecklistPage;
