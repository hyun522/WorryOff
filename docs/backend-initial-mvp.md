# backend 초기 mvp 구현

## 목적

초기 backend MVP는 LocalStorage에 base64 이미지를 저장하던 구조를 벗어나기 위한 첫 단계다.

현재 목표는 복잡한 사용자, 팀, 인증 데이터까지 한 번에 서버화하는 것이 아니라, 우선 사진 파일을 프론트 저장소 밖으로 빼서 LocalStorage 용량 문제를 완화하는 것이다.

## 현재 구현 요약

현재 backend는 Nest.js로 구성되어 있으며 이미지 업로드와 이미지 조회 기능을 담당한다.

- 서버 시작 시 `uploads` 폴더를 확인한다.
- `uploads` 폴더가 없으면 자동으로 생성한다.
- 이미지는 서버의 로컬 디스크 `uploads` 폴더에 저장한다.
- 업로드 API는 저장된 파일명만 반환한다.
- 조회 API는 파일명을 받아 `uploads` 폴더의 실제 이미지 파일을 응답한다.

## uploads 폴더 자동 생성의 의미

[backend/src/main.ts](../backend/src/main.ts)에는 다음 흐름이 있다.

```ts
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

이 코드는 서버가 시작될 때 현재 작업 디렉터리 기준으로 `uploads` 폴더가 있는지 확인한다.

폴더가 없으면 `fs.mkdirSync(uploadDir, { recursive: true })`로 폴더를 만든다. 따라서 이미지 업로드 시점에 저장 대상 폴더가 없어서 실패하는 상황을 줄일 수 있다.

이 코드는 이미지를 직접 저장하는 코드가 아니라, 이미지를 저장할 준비 공간을 만드는 코드다.

## 이미지 저장 방식

[backend/src/app.controller.ts](../backend/src/app.controller.ts)의 `POST /images/upload`는 `multer`와 `diskStorage`를 사용한다.

```txt
POST /images/upload
```

업로드된 이미지는 다음 위치에 저장된다.

```txt
backend/uploads
```

저장 파일명은 다음 조합으로 만든다.

```txt
Date.now() + random number + original extension
```

예시는 다음과 같다.

```txt
1722760000000-123456789.jpg
```

응답은 전체 URL이 아니라 파일명만 반환한다.

```json
{
  "fileName": "1722760000000-123456789.jpg"
}
```

## 이미지 조회 방식

저장된 이미지는 다음 API로 조회한다.

```txt
GET /images/:filename
```

예시는 다음과 같다.

```txt
GET /images/1722760000000-123456789.jpg
```

서버는 `uploads` 폴더 안에서 해당 파일명을 찾고, 파일이 있으면 `sendFile`로 응답한다.

경로 조작을 막기 위해 파일명에 다음 문자열이 포함되어 있으면 요청을 거부한다.

- `..`
- `/`
- `\`

## 네트워크 주소 변경과 이미지 보관

현재 방식에서 이미지는 URL 자체에 저장되는 것이 아니라, 서버를 실행하는 디바이스의 `backend/uploads` 폴더에 저장된다.

따라서 같은 디바이스에서 같은 backend 프로젝트를 계속 사용한다면, 네트워크 주소가 바뀌어도 이미지 파일 자체는 유지된다.

예를 들어 서버 주소가 다음과 같이 바뀌어도:

```txt
http://172.30.1.90:3000
http://192.168.0.12:3000
```

이미지 파일은 여전히 같은 위치에 남아 있다.

```txt
backend/uploads/1722760000000-123456789.jpg
```

단, 프론트에 전체 URL을 저장해두면 네트워크 주소가 바뀔 때 이미지 링크가 깨질 수 있다.

따라서 초기 MVP에서는 프론트 저장값을 전체 URL이 아니라 `fileName` 중심으로 가져가는 것이 좋다. 화면에서 이미지를 렌더링할 때 현재 backend base URL과 `fileName`을 조합하면 네트워크 주소 변경에 더 유연하게 대응할 수 있다.

## 보관되는 경우

다음 조건에서는 이미지가 계속 보관된다.

- 같은 디바이스에서 backend 서버를 실행한다.
- `backend/uploads` 폴더를 삭제하지 않는다.
- 서버 재시작 후에도 같은 프로젝트 폴더를 사용한다.
- 로컬 디스크가 유지된다.

## 사라질 수 있는 경우

다음 조건에서는 이미지가 사라지거나 조회되지 않을 수 있다.

- `backend/uploads` 폴더를 직접 삭제한다.
- 서버를 다른 디바이스에서 실행한다.
- 프로젝트 폴더를 새로 clone하고 기존 `uploads`를 옮기지 않는다.
- 배포 환경의 로컬 디스크가 재배포 또는 재시작 시 초기화된다.
- 프론트가 과거 IP 주소가 포함된 전체 이미지 URL을 저장하고 있다.

## 현재 방식의 장점

- 구현이 단순하다.
- LocalStorage base64 저장 문제를 빠르게 줄일 수 있다.
- Nest.js 업로드 흐름을 MVP 수준에서 검증할 수 있다.
- 서버가 같은 디바이스에서 실행되는 동안 이미지를 계속 조회할 수 있다.

## 현재 방식의 한계

- 로컬 디스크 저장이므로 운영 배포 환경에서는 영속성이 보장되지 않을 수 있다.
- 여러 서버 인스턴스를 띄우면 이미지 파일이 서버마다 분산될 수 있다.
- 백업, 삭제, 만료, 접근 권한 관리가 약하다.
- 이미지 URL을 public하게 열어두면 접근 제어가 어렵다.
- 현재는 DB에 이미지 메타데이터를 저장하지 않는다.

## 운영 전환 시 권장 방향

운영 또는 팀 기능까지 고려하면 최종적으로는 object storage를 사용하는 것이 안전하다.

후보는 다음과 같다.

- AWS S3
- Cloudflare R2
- Naver Cloud Object Storage
- Google Cloud Storage

운영 구조에서는 backend가 파일을 직접 로컬에 영구 보관하기보다, object storage에 업로드하고 DB에는 다음 값만 저장하는 방향이 좋다.

- `fileName`
- `storageKey`
- `photoUrl`
- `mimeType`
- `fileSize`
- `uploadedByUserId`
- `createdAt`

## 초기 MVP 정책

- 지금 단계에서는 로컬 `uploads` 저장 방식을 허용한다.
- 프론트에는 가능하면 전체 URL보다 `fileName`을 저장한다.
- 이미지 조회 시 현재 backend base URL과 `fileName`을 조합한다.
- 같은 디바이스와 같은 프로젝트 폴더를 유지하면 네트워크 주소가 바뀌어도 이미지는 유지된다.
- 장기 운영 단계에서는 object storage로 이전한다.

⚠️ 설치 중 npm warn으로 multer 1.x가 알려진 취약점이 있어 2.x로 업그레이드를 권장한다는 경고가 떴습니다. 다만 NestJS @nestjs/platform-express 10.x와의 공식 호환 조합은 아직 multer 1.4.x 기준이라, 내일 배포 일정을 고려해 지금은 그대로 두었습니다. 배포 후 여유 있을 때 multer 2.x 마이그레이션을 검토하시는 걸 권장드립니다.
