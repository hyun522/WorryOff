# Worry OFF

>Turn off your worries before you leave. <br />
> 외출 전 체크리스트를 사진으로 인증하고, 매일의 인증 기록을 관리하여 안전한 외출 습관을 만들어주는 생활 인증 서비스입니다.

<br />

## 개발 기간

* 2026.06.22 ~

<br />

## 기술 스택

### Frontend

- React
- TypeScript
- Zustand
  

### UI

- Toss Design System Mobile (TDS Mobile)


### Storage

- LocalStorage

### Platform

- Apps in Toss (Granite)

<br /><br />

---

## 주요 기능

- 온보딩 (최초 1회)
- 체크리스트 추가 / 삭제 / 순서 변경
- 공간 이름 변경
- 사진 인증
- 오늘 인증 완료 처리
- 인증 History 관리
- 월 단위 History 자동 초기화

---

## 개발하면서 배운 점

- 데이터 모델 설계부터 시작하는 상태관리 (Current & History 분리)
- Snapshot 기반 History 설계로 과거 데이터의 무결성 유지
- Zustand에서 비즈니스 로직(Action)을 책임(SRP) 단위로 설계하기
- Apps in Toss(Granite) 환경에서 웹앱 개발하기
