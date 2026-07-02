// "YYYY-MM-DD" 문자열을 로컬 타임존 기준 Date로 변환하는 내부 헬퍼
function parseDateOnly(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Date를 "YYYY-MM-DD" 형식 문자열로 변환 (lastActiveDate, HistoryRecord.date 저장용)
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 두 "YYYY-MM-DD" 문자열이 날짜(일) 단위로 다른지 판별 (하루 경과 여부 확인용)
export function isNewDay(prevDate: string, currentDate: string): boolean {
  const prev = parseDateOnly(prevDate);
  const current = parseDateOnly(currentDate);
  return prev.getTime() !== current.getTime();
}

// 두 "YYYY-MM-DD" 문자열의 연도 또는 월이 다른지 판별 (History 자동 삭제 정책용)
export function isNewMonth(prevDate: string, currentDate: string): boolean {
  const prev = parseDateOnly(prevDate);
  const current = parseDateOnly(currentDate);
  return (
    prev.getFullYear() !== current.getFullYear() ||
    prev.getMonth() !== current.getMonth()
  );
}
