# WorryOff Server Data Model

## 목적

이 문서는 WorryOff 고도화 단계에서 Nest.js 서버와 데이터베이스로 이전하기 위한 데이터 모델 초안이다.

설계 기준은 다음과 같다.

- 개인 모드와 팀 모드를 하나의 구조로 다룬다.
- 개인 모드는 멤버가 1명인 Space로 표현한다.
- 인증 완료 후의 기록은 수정 불가능한 snapshot으로 보존한다.
- 현재 MVP의 월 단위 History 초기화 정책을 유지한다.
- 사진은 서버 또는 외부 object storage에 저장하고, DB에는 URL 또는 storage key를 저장한다.

## 핵심 관계 요약

```txt
User
  └─ SpaceMember
       └─ Space
            ├─ ChecklistItem
            ├─ Assignment
            ├─ Certification
            │    └─ CertificationPhoto
            ├─ Poke
            └─ Notification
```

## 엔티티 목록

### users

앱을 사용하는 사람이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 사용자 ID |
| provider | string | yes | 사용자 식별 제공자. 예: `apps_in_toss` |
| providerUserId | string | yes | 제공자 기준 사용자 식별자 |
| displayName | string | yes | 앱에서 표시할 이름 |
| profileImageUrl | string | no | 프로필 이미지 |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |
| deletedAt | datetime | no | 탈퇴 또는 비활성화 시각 |

#### 제약

- `(provider, providerUserId)`는 unique여야 한다.
- 삭제된 사용자는 과거 History에서 이름이 사라지지 않도록 snapshot 필드를 함께 사용한다.

### spaces

개인 또는 팀 인증 공간이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 공간 ID |
| name | string | yes | 공간 이름 |
| mode | enum | yes | `personal` 또는 `team` |
| createdByUserId | uuid | yes | 공간 생성자 |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |
| deletedAt | datetime | no | 삭제 시각 |

#### 제약

- 개인 모드도 `spaces`에 저장한다.
- 개인 모드는 기본적으로 멤버 1명을 가진다.
- 팀 모드는 2명 이상의 멤버를 가질 수 있다.
- 현재 정책상 별도 관리자 권한은 두지 않는다.

### space_members

사용자가 어떤 Space에 속해 있는지 나타낸다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 멤버십 ID |
| spaceId | uuid | yes | Space ID |
| userId | uuid | yes | User ID |
| displayNameSnapshot | string | yes | 멤버 추가 당시 또는 표시용 이름 snapshot |
| status | enum | yes | `active`, `removed`, `left` |
| joinedAt | datetime | yes | 참여 시각 |
| removedAt | datetime | no | 삭제 또는 나간 시각 |

#### 제약

- `(spaceId, userId)`는 active 상태에서 중복될 수 없다.
- 팀원 누구나 다른 팀원을 삭제할 수 있다.
- 팀원 삭제 후에도 과거 인증 기록은 유지한다.

### invites

팀 초대 정보를 저장한다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 초대 ID |
| spaceId | uuid | yes | 초대 대상 Space |
| invitedByUserId | uuid | yes | 초대한 사용자 |
| inviteCode | string | yes | 초대 코드 또는 링크 토큰 |
| status | enum | yes | `pending`, `accepted`, `expired`, `cancelled` |
| expiresAt | datetime | yes | 만료 시각 |
| acceptedByUserId | uuid | no | 초대를 수락한 사용자 |
| acceptedAt | datetime | no | 수락 시각 |
| createdAt | datetime | yes | 생성 시각 |

#### 제약

- 팀원 누구나 초대를 만들 수 있다.
- 만료된 초대는 사용할 수 없다.
- 초대 방식은 Apps in Toss 공유 방식과 연동할 수 있다.

### checklist_items

Space별 현재 체크리스트 항목이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 체크리스트 항목 ID |
| spaceId | uuid | yes | Space ID |
| title | string | yes | 항목 이름 |
| sortOrder | int | yes | 정렬 순서 |
| isActive | boolean | yes | 현재 사용 여부 |
| createdByUserId | uuid | yes | 생성한 사용자 |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |
| deletedAt | datetime | no | 삭제 시각 |

#### 제약

- 체크리스트 변경은 현재 Space의 이후 인증에만 영향을 준다.
- 이미 완료된 Certification snapshot은 수정하지 않는다.
- 팀 모드에서는 팀원 누구나 추가, 삭제, 순서 변경할 수 있다.

### assignments

특정 날짜에 누가 당번인지 저장한다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 당번 ID |
| spaceId | uuid | yes | Space ID |
| assignedDate | date | yes | 당번 날짜. `YYYY-MM-DD` |
| assigneeUserId | uuid | yes | 당번 사용자 |
| assignedByUserId | uuid | yes | 당번을 지정한 사용자 |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |

#### 제약

- `(spaceId, assignedDate)`는 unique여야 한다.
- 팀원 누구나 오늘 당번을 변경할 수 있다.
- 오늘 당번만 사진 등록과 인증 완료를 할 수 있다.
- 개인 모드에서는 본인이 항상 당번으로 취급될 수 있다.

### certifications

특정 Space의 특정 날짜 인증 기록이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 인증 ID |
| spaceId | uuid | yes | Space ID |
| certificationDate | date | yes | 인증 날짜. `YYYY-MM-DD` |
| assigneeUserId | uuid | yes | 해당 날짜 당번 |
| assigneeNameSnapshot | string | yes | 인증 당시 당번 이름 snapshot |
| status | enum | yes | `in_progress`, `completed`, `incomplete` |
| completedAt | datetime | no | 인증 완료 시각 |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |

#### 제약

- `(spaceId, certificationDate)`는 unique여야 한다.
- 하루 1회 인증 정책은 이 unique 제약으로 보조한다.
- `completed` 상태가 된 Certification은 checklist snapshot과 photo를 수정할 수 없다.
- `incomplete` 기록은 해당 날짜가 지나고 미인증인 경우 생성할 수 있다.
- History 월 단위 초기화 정책에 따라 이전 달 certification은 삭제 또는 archive 대상이 된다.

### certification_checklist_snapshots

인증 당시 체크리스트 항목 snapshot이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | snapshot ID |
| certificationId | uuid | yes | Certification ID |
| checklistItemId | uuid | no | 원본 체크리스트 항목 ID |
| titleSnapshot | string | yes | 인증 당시 항목 이름 |
| sortOrderSnapshot | int | yes | 인증 당시 정렬 순서 |
| createdAt | datetime | yes | 생성 시각 |

#### 제약

- 인증 기록은 원본 checklist_items 변경과 무관해야 한다.
- 원본 체크리스트 항목이 삭제되어도 snapshot은 유지한다.

### certification_photos

인증 항목별 사진이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 사진 ID |
| certificationId | uuid | yes | Certification ID |
| checklistSnapshotId | uuid | yes | 연결된 checklist snapshot ID |
| uploadedByUserId | uuid | yes | 업로드한 사용자 |
| storageKey | string | yes | object storage key |
| photoUrl | string | no | 접근 가능한 URL |
| mimeType | string | yes | 이미지 MIME type |
| fileSize | int | no | 파일 크기 |
| width | int | no | 이미지 너비 |
| height | int | no | 이미지 높이 |
| createdAt | datetime | yes | 업로드 시각 |
| deletedAt | datetime | no | 삭제 시각 |

#### 제약

- 하나의 checklist snapshot에는 사진 1장만 연결한다.
- 인증 완료 전에는 당번이 사진을 교체할 수 있다.
- 인증 완료 후에는 사진을 수정하거나 삭제할 수 없다.
- 사진 삭제 정책은 기존 History 월 단위 삭제 정책과 맞춘다.

### pokes

팀원이 당번에게 보내는 콕 찌르기 기록이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 콕 찌르기 ID |
| spaceId | uuid | yes | Space ID |
| certificationDate | date | yes | 대상 날짜 |
| fromUserId | uuid | yes | 콕 찌른 사용자 |
| toUserId | uuid | yes | 당번 사용자 |
| createdAt | datetime | yes | 생성 시각 |

#### 제약

- 콕 찌르기는 팀 모드에서만 사용한다.
- 인증 미완료 상태에서만 생성할 수 있다.
- 인증 완료 후에는 생성할 수 없다.
- 당번 본인은 자기 자신에게 콕 찌르기를 보낼 수 없다.
- `fromUserId` 기준 하루 최대 3회까지만 생성할 수 있다.
- 하루가 바뀌면 횟수는 초기화된다.

### notifications

사용자에게 보낼 알림 예약과 발송 기록이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 알림 ID |
| spaceId | uuid | no | 관련 Space |
| recipientUserId | uuid | yes | 수신자 |
| actorUserId | uuid | no | 알림을 발생시킨 사용자 |
| type | enum | yes | `daily_reminder`, `poke`, `certification_completed` |
| title | string | yes | 알림 제목 |
| body | string | yes | 알림 본문 |
| status | enum | yes | `pending`, `sent`, `failed`, `cancelled` |
| scheduledAt | datetime | no | 예약 발송 시각 |
| sentAt | datetime | no | 발송 완료 시각 |
| createdAt | datetime | yes | 생성 시각 |

#### 제약

- 정기 알림은 개인 모드에서는 본인에게, 팀 모드에서는 당번에게 보낸다.
- 콕 찌르기 알림은 현재 당번에게만 보낸다.
- 인증 완료 알림은 팀원 전체 발송을 기본 후보로 둔다.

### notification_settings

사용자별, Space별 알림 설정이다.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | uuid | yes | 설정 ID |
| userId | uuid | yes | 사용자 ID |
| spaceId | uuid | yes | Space ID |
| dailyReminderEnabled | boolean | yes | 정기 알림 여부 |
| completionNotificationEnabled | boolean | yes | 완료 알림 여부 |
| days | string[] | yes | 알림 요일 |
| time | string | yes | 알림 시간. `HH:mm` |
| createdAt | datetime | yes | 생성 시각 |
| updatedAt | datetime | yes | 수정 시각 |

#### 제약

- `(userId, spaceId)`는 unique여야 한다.
- 콕 찌르기 알림 수신 설정은 추후 별도 필드로 분리할 수 있다.

## 인증 상태 흐름

```txt
in_progress
  ├─ 모든 checklist snapshot에 photo 등록
  └─ 당번이 인증하기 클릭
       ↓
completed

in_progress
  └─ 날짜 변경 후 미완료 처리
       ↓
incomplete
```

### 상태별 수정 가능 여부

| Status | 사진 등록/교체 | 인증 완료 | 콕 찌르기 | History 표시 |
| --- | --- | --- | --- | --- |
| in_progress | 당번만 가능 | 당번만 가능 | 가능 | 선택 |
| completed | 불가 | 불가 | 불가 | 표시 |
| incomplete | 불가 | 불가 | 불가 | 표시 |

## 개인 모드 처리

개인 모드는 별도 테이블로 분리하지 않는다.

- `spaces.mode = personal`
- `space_members`에는 본인 1명만 active로 등록한다.
- `assignments`가 없더라도 본인을 오늘 당번으로 계산할 수 있다.
- 서버 구현에서는 일관성을 위해 개인 모드도 일별 `assignments`를 생성하는 방식을 선택할 수 있다.

## 팀 모드 처리

팀 모드는 `spaces.mode = team`으로 저장한다.

- 팀원은 `space_members`로 관리한다.
- 팀원 누구나 설정 변경, 초대, 삭제, 당번 변경이 가능하다.
- 인증 가능 여부는 `assignments.assigneeUserId === currentUser.id`로 판단한다.
- 비당번은 인증 사진 업로드와 인증 완료 API를 호출할 수 없다.

## History 월 단위 초기화

현재 정책은 매월 자동 초기화다.

서버에서는 다음 중 하나로 구현할 수 있다.

1. 월이 바뀌면 이전 달 `certifications`, `certification_checklist_snapshots`, `certification_photos`를 삭제한다.
2. 이전 달 기록은 `archived` 상태로 숨기고, 사진 파일만 삭제한다.

현재 정책과 가장 가까운 방식은 1번이다. 다만 서버 운영 관점에서는 삭제 작업 실패와 object storage 파일 정리를 함께 고려해야 한다.

## 주요 Unique Index 후보

| Table | Unique Index | Purpose |
| --- | --- | --- |
| users | `(provider, providerUserId)` | 외부 사용자 중복 방지 |
| space_members | `(spaceId, userId, status)` 또는 partial unique | active 멤버 중복 방지 |
| checklist_items | `(spaceId, sortOrder)` | 정렬 충돌 방지 |
| assignments | `(spaceId, assignedDate)` | 날짜별 당번 1명 유지 |
| certifications | `(spaceId, certificationDate)` | 하루 인증 1회 유지 |
| certification_photos | `(certificationId, checklistSnapshotId)` | 항목별 사진 1장 유지 |
| notification_settings | `(userId, spaceId)` | 사용자별 Space 설정 1개 유지 |

## API 설계로 넘길 주요 질문

- 개인 Space 생성은 온보딩 완료 시 자동으로 할지, 첫 설정 저장 시 할지
- 인증 시작 시점에 certification snapshot을 만들지, 첫 사진 업로드 시 만들지
- 당번 변경 시 이미 진행 중인 certification의 assignee를 바꿀지
- 월 단위 초기화는 사용자 진입 시 처리할지, 서버 batch로 처리할지
- object storage URL은 public URL로 둘지, signed URL로 내려줄지
- 기존 LocalStorage 데이터를 서버로 옮길지, 신규 서버 버전부터 새로 시작할지
