# Architecture: Endfield-Optimization-for-Chen

이 문서는 Endfield-Optimization-for-Chen 프로젝트의 기술 스택, 디렉토리 구조 및 코딩 컨벤션을 정의합니다.

## 1. Project Context

- **목적**: Arknights: Endfield (Chen) 최적화 도구.
- **주요 기능**:
  - **Battery Optimization Calculator**: 무릉 배터리 최적화 계산기 (2분배/3합류).
  - **Auto-Update**: 실행 시 업데이트 체크 및 패치노트 제공.

### Tech Stack

- **Runtime**: Node.js (v24+)
- **Framework**: Electron (with Vite)
- **UI**: React
- **Language**: TypeScript (Target: `esnext`)
- **Builder**: electron-builder

### Build Commands

- `npm run dev`: 개발 모드 실행 (Vite + Electron)
- `npm run build`: TypeScript 컴파일 및 Vite 빌드.

## 2. Directory Structure

```text
/
├── dist/               # 빌드 결과물 (Electron entry)
├── dist-electron/      # Main Process 빌드 결과물
├── src/
│   ├── main/           # Electron Main Process
│   │   ├── main.ts     # Entry Point
│   │   └── events/     # EventBus & Handlers
│   ├── renderer/       # React UI (Vite Root)
│   │   ├── App.tsx
│   │   ├── features/   # Feature Components (Battery, etc.)
│   │   └── i18n/       # Internationalization
│   └── shared/         # 공용 타입 및 유틸리티
├── .github/
│   └── workflows/      # CI/CD (Release Please, PR Check)
├── electron-builder.json5 # Builder 설정
└── vite.config.ts      # Vite 설정
```

## 3. Coding Conventions

- **Language**: 한국어 주석 및 커밋 메시지 권장.
- **Naming**:
  - React Component: `PascalCase.tsx`
  - Logic/Utils: `camelCase.ts`
- **Linting**: ESLint + Prettier (Strict 모드 권장)
- **Architecture**: **Event-Driven (Pub/Sub)** 패턴을 준수합니다.

## 4. Architecture Decision Records (ADR)

### ADR-001: Event-Driven Architecture (Pub/Sub)

- **상황**: 메인 프로세스와 렌더러 간의 결합도를 낮추고 유지보수성을 높여야 함.
- **결정**: `EventBus` 싱글톤을 도입하여 모든 비즈니스 로직을 이벤트 기반으로 처리함.
- **결과**: `AppEvent` 타입을 통해 Type-Safe한 통신을 보장하고 확장이 용이해짐.

### ADR-002: Check-on-Start Update Policy

- **상황**: 상주 프로세스 없이 가볍게 동작해야 함.
- **결정**: 앱 실행 시(`app.on('ready')`) 1회만 업데이트를 체크하고, 업데이트가 있으면 알림을 표시함.
- **결과**: 백그라운드 리소스 소모를 최소화함.

### ADR-003: Mulung Battery Algorithm

- **상황**: 엔드필드의 배터리 효율을 계산하는 복잡한 로직이 필요함.
- **결정**: Arca Live 커뮤니티의 '2분배/3합류' 알고리즘을 TypeScript로 구현하여 최적의 청사진을 제공함.
- **결과**: 사용자가 입력한 전력량에 대해 수학적으로 증명된 최적의 구성을 제안함.
