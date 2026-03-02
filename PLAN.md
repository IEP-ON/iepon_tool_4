# IEP-ON Tool4 — 종합 개발 플랜 (v2.0)

> **작성일**: 2026-03-02
> **목적**: 프로토타입 전면 백지화 후 Supabase 기반 새 프로젝트 구축
> **유지**: Next.js 15 (App Router) / Vercel CLI / GitHub 원격저장소
> **추가**: Supabase MCP (IEPON_TOOL, `cbdiiatkpppsfgijipsr`)

---

## 1. 시스템 개요

### 1.1 서비스 흐름
```
[교사] 기본정보 입력 → Supabase 저장 → iepId 발급
  → [미리보기] 안내장(문서1) 확인 + QR코드 생성
  → [학부모] QR 스캔 → iepId로 교사 정보 조회 → 의견서+동의서 작성 → 암호화 저장
  → [결과] iepId로 전체 데이터 조회 → 복호화 → 3개 문서 렌더링/인쇄
```

### 1.2 URL 구조
| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈 | `/` | 교사 진입점 |
| 교사 입력 | `/teacher` | TeacherInput 작성 |
| 미리보기 | `/preview?iepId=xxx` | 안내장 미리보기 + QR |
| 학부모 폼 | `/form?iepId=xxx` | 의견서 + 동의서 작성 |
| 결과 문서 | `/result?iepId=xxx#key=hex` | 3개 문서 인쇄용 |
| 빈 양식 인쇄 | `/print-empty` | 오프라인 배부용 빈 양식 |

---

## 2. 데이터 모델

### 2.1 TypeScript 인터페이스

#### `TeacherInput` — 교사 기본 정보 (비민감)
```typescript
interface TeacherInput {
  schoolName: string;       // 학교명
  schoolAddress: string;    // 학교 주소
  principalName: string;    // 교장 성명
  adminTeacherName: string; // 교무부장(개인정보보호책임자)
  studentName: string;      // 학생 성명 ← DB 저장 안 함 (해시만)
  grade: string;            // 학년
  classNum: string;         // 반
  year: string;             // 학년도
  semester: string;         // 학기
  teacherName: string;      // 특수교사 성명
  teacherPhone: string;     // 특수교사 연락처
  consultTime: string;      // 상담 가능 시간
  meetingStartDate: string; // 협의회 시작일
  meetingEndDate: string;   // 협의회 종료일
  meetingPlace: string;     // 협의회 장소
  submissionDeadline: string; // 제출 기한
  submissionDay: string;    // 제출 요일
}
```

#### `ParentOpinion` — 학부모 의견서 (민감 → 암호화 저장)
```typescript
interface ParentOpinion {
  // 기본 정보
  studentName: string;
  birthDate: string;
  guardianName: string;
  guardianRelation: string;
  guardianRelationOther: string;
  guardianPhone: string;

  // A. 장애인 등록 현황
  disabilityRegistration: string;
  primaryDisability: string;
  secondaryDisability: string;
  secondaryDisabilityType: string;
  disabilitySeverity: string;
  firstRegistrationDate: string;

  // B. 특수교육대상자 선정 현황
  specialEdArea: string;
  firstSelectionDate: string;

  // 1. 가정 환경
  primaryCaregiver: string;
  primaryCaregiverOther: string;
  multicultural: string;
  multiculturalLanguage: string;

  // 2. 협의회 참석
  attendanceMethod: string;
  hopeDate1: string; hopeTime1: string;
  hopeDate2: string; hopeTime2: string;
  hopeDate3: string; hopeTime3: string;

  // 3. 건강/의료
  hasMedication: string;
  medications: Array<{ name: string; dosage: string; time: string }>;
  schoolMedicationSupport: string;
  allergies: string[];
  allergyFoodDetail: string;
  allergyDrugDetail: string;
  allergyEnvDetail: string;
  hasSeizure: string;
  seizureRecent: string;
  seizureInstruction: string;
  dietaryRestriction: string[];
  dietaryDiseaseDetail: string;
  dietaryCultureDetail: string;
  sleepCharacteristics: string[];
  sensoryIssues: string[];
  sensoryOther: string;

  // 4. 보조기기/환경
  assistiveTech: string[];
  assistiveTechOther: string;
  assistiveDevice: string[];
  assistiveDeviceOther: string;
  envModification: string[];
  envModificationOther: string;

  // 5. 강점과 특성
  strengths: string;
  uniqueTraits: string;

  // 6. 현재 수준
  levelLearning: string;
  levelCommunication: string;
  levelSocial: string;
  levelSelfCare: string;
  levelMotor: string;
  levelBehavior: string;

  // 7. 교육 목표
  priorityGoal: string;
  preferredMethod: string;
  evaluationOpinion: string;
  homeConnection: string;

  // 8. 외부 지원
  afterSchoolActivity: string;

  // 9. 학교 서비스
  afterSchoolSpecialEd: string;
  afterSchoolSpecialEdInSchool: string;
  afterSchoolSpecialEdOutSchool: string;
  transportSupport: string;
  assistantSupport: string;
  assistantSupportDetail: string;
  therapySupportList: Array<{ institution: string; days: string; area: string }>;
  rehabServiceList: Array<{ institution: string; days: string; area: string }>;

  // 10. 행사/체험
  survivalSwimming: string;
  survivalSwimmingReason: string;
  schoolTrip: string;
  schoolTripReason: string;
  openClassObservation: string;
  fieldTrip: string;

  // 11. 진로/미래
  fiveYearVision: string;
  careerDirection: string;
  careerDirectionOther: string;
  educationValue: string;

  // 13. 기타
  healthChanges: string;
  familyChanges: string;
  messageToTeacher: string;
  writeDate: string;
}
```

#### `ConsentForm` — 동의서 (민감 → 암호화 저장)
```typescript
interface ConsentForm {
  consentGuardianName: string;
  consentGuardianRelation: string;
  consentSignatureBase64: string;
  consentTypingConfirm: string;
  consentDate: string;

  // 필수 동의
  consent1: boolean | null;    // 기본 개인정보 수집
  consent2: boolean | null;    // 건강/장애 민감정보
  consent3: boolean | null;    // 제3자 제공
  consent4_handover: boolean | null; // 교내 정보 공유

  // 초상권/활동
  consent6_photoRecord: boolean | null;
  consent6_homepage: boolean | null;

  // 수업 참관
  consent7_supervision: boolean | null;

  // 현장체험/활동
  consent8_specialFieldTrip: boolean | null;
  consent8_inclusiveFieldTrip: boolean | null;
  consent8_publicTransport: boolean | null;
  consent8_survivalSwimming: boolean | null;
  consent8_schoolTrip: boolean | null;

  // 응급처치
  consent9_firstAid: boolean | null;
  consent9_119: boolean | null;
  consent9_priorTreatment: boolean | null;
  consent9_healthRoom: boolean | null;
  emergencyContacts: Array<{ name: string; relation: string; phone: string }>;

  // 장애인식개선
  consent11_participation: boolean | null;
}
```

> **주의**: 프로토타입 대비 `consent4_iep`, `consent4_curriculum`, `consent4_services`, `consent4_records`, `consent6_internalUse`, `consent6_parentShare`, `consent6_sns`, `consent6_classChannel`, `consent7_parentOpen`, `consent7_peerObservation`, `consent7_competition`, `consent7_externalMaterial`, `consent8_otherActivities`, `consent8_schoolInsurance`는 동의서 문서(ResultDoc3)에서 실제 개별 표시하지 않고 통합 항목으로 처리됨. **새 프로젝트에서는 문서에 실제 표시되는 항목만 유지하여 인터페이스를 간소화함.**

### 2.2 Supabase 테이블 (이미 생성됨)

| 테이블 | 용도 | 민감정보 처리 |
|--------|------|--------------|
| `tool4_ieps` | 교사 입력 메타데이터 | `student_name_hash`만 저장 (원본 X) |
| `tool4_parent_opinions` | 학부모 의견서 | `opinion_data_encrypted` (AES-256-GCM) |
| `tool4_consent_forms` | 동의서 | `consent_data_encrypted` + Storage 서명 |
| `tool4_audit_logs` | 감사 로그 | 접근/수정 이력 |

---

## 3. 출력 문서 명세 (ResultDoc 1~3)

### 3.1 문서1: 협의회 안내장 (`ResultDoc1`)
- **데이터 소스**: `TeacherInput` + `formUrl` (QR용)
- **내용 구성**:
  1. 제목: `{year}학년도 {semester}학기 개별화교육지원팀 협의회 안내`
  2. 수신/발신: 학생명 보호자님 / 학교명 특수학급 담임교사
  3. 인사 본문 (안내 메시지)
  4. 협의회 일정 테이블: 운영 기간, 장소, 소요시간
  5. 참석 방법 3가지: 대면 / 유선 / 서면
  6. QR코드 + 제출 안내 (마감일 강조)
  7. 하단 문의처: 교사명 + 연락처
- **인쇄 규격**: A4, 12pt, w-[210mm]

### 3.2 문서2: 보호자 의견서 (`ResultDoc2`)
- **데이터 소스**: `TeacherInput` + `ParentOpinion`
- **내용 구성**:
  1. 제목: `{year}학년도 {semester}학기 개별화교육계획(IEP) 수립을 위한 보호자 의견서`
  2. **§1 학생 기본 정보**: 생년월일, 장애유형, 보호자, 연락처, 등록현황, 선정현황, 양육자, 다문화
  3. **§2 협의회 참석 희망**: 참석방법(체크박스), 희망일시 3순위
  4. **§3 학생 특성 및 현행 수준**: 건강/의료 특이사항(복약, 알레르기, 발작, 감각, 식단, 보조기기, 보조공학, 환경수정, 수면), 강점/관심사, 고유특성, 기본생활/자조, 학습/의사소통, 사회성/운동
  5. **§4 교육 목표 및 지원 요구**: 우선교육목표, 선호지도법, 평가의견, 가정연계, 행사/체험(생존수영, 수학여행, 공개수업, 현장체험)
  6. **§5 서비스 신청 현황**: 방과후, 통학비, 치료지원, 발달재활, 보조인력, 학교밖활동
  7. **§6 장기적 비전**: 5년후 기대, 진로희망, 교육가치, 건강변화, 기타(가정변화, 교사메시지)
- **특수 기능**: `isEmptyForm` prop으로 빈 양식 인쇄 지원
- **인쇄 규격**: A4, 10.5pt

### 3.3 문서3: 동의서 (`ResultDoc3`)
- **데이터 소스**: `TeacherInput` + `ConsentForm`
- **내용 구성**:
  1. 제목: `특수교육대상자 교육지원 및 정보제공 동의서`
  2. 부제: 학교명 + 법적 근거
  3. **§1 필수 동의 사항**:
     - 기본 개인정보 수집·이용
     - 건강·장애 민감정보 수집·이용 (개인정보보호법 제23조)
     - 제3자 정보 제공 (교육청, 지원센터 등)
     - 교내 정보 공유 (통합학급 담임, 교과교사 등)
  4. **§2 생명 및 안전 보호 (필수)**:
     - 1차 응급처치 / 119 신고·이송 / 의료진 즉각 처치 / 보건실 이용
     - 응급 연락망 (순위별 성명/관계/연락처)
  5. **§3 교육활동 참여 및 초상권 (선택)**:
     - 사진·영상 촬영 / 대외 홍보 게시
     - 특수학급 현장체험 / 통합학급 현장체험
     - 생존수영 (3·4학년) / 수학여행 (5·6학년) — 조건부 표시
     - 대중교통 이용 / 공개수업·장학 / 장애인식개선
  6. 서명란: 안내문구 + 작성일 + 보호자명 + 서명 이미지
- **특수 기능**: `isEmptyForm` prop
- **인쇄 규격**: A4, 9.5pt

---

## 4. 암호화 원리

### 4.1 알고리즘
- **AES-256-GCM** (Web Crypto API, 브라우저 네이티브)
- IV: 12바이트 랜덤
- 키: 256비트 랜덤 → hex 문자열로 export

### 4.2 데이터 흐름
```
[학부모 브라우저]
  1. 랜덤 AES-256 키 생성
  2. ParentOpinion JSON → AES-256-GCM 암호화 → encryptedOpinion
  3. ConsentForm JSON → 같은 키로 AES-256-GCM 암호화 → encryptedConsent
  4. API 호출: encryptedOpinion + encryptedConsent → Supabase 저장
  5. 서명 이미지 → Supabase Storage 업로드
  6. 결과 URL: /result?iepId=xxx#key=hexKeyString

[결과 페이지]
  1. URL에서 iepId + #key 파싱
  2. API: iepId로 암호화된 데이터 조회
  3. 브라우저에서 #key로 복호화
  4. 복호화된 데이터로 문서 렌더링
```

### 4.3 키 관리
- 키는 URL Fragment(`#key=...`)로만 전달 → 서버에 절대 전송 안 됨
- 서버/DB에는 암호화된 데이터만 존재 (Zero-Knowledge)
- 교사에게 결과 URL(Fragment 포함)을 알림톡/문자로 전달

---

## 5. API 엔드포인트

### `POST /api/iep` — IEP 생성
```
Request: { teacherInput: TeacherInput }
Process:
  - nanoid(10)으로 iep_id 생성
  - studentName → SHA-256 해시
  - tool4_ieps INSERT (studentName은 저장 안 함)
  - tool4_audit_logs INSERT (action: 'create')
Response: { iepId: string, id: string }
```

### `GET /api/iep/[iepId]` — 교사 정보 조회 (학부모용)
```
Request: URL params iepId
Process:
  - tool4_ieps에서 iep_id로 조회
  - status='draft' 확인
Response: { teacherData: Partial<TeacherInput> } // studentName 포함 (hash 아닌 원본은 요청 시 teacher_data에서)
```

> **중요**: studentName은 DB에 저장하지 않으므로, 학부모 폼에서 교사가 입력한 studentName을 보여주려면 **교사 제출 시 studentName을 별도로 전달하는 방식** 필요. → 해결: `tool4_ieps`에 `teacher_data` JSONB 컬럼 추가하여 전체 TeacherInput을 저장하되, studentName은 이 JSONB 안에만 존재 (별도 컬럼 아님).
> **수정**: 현재 스키마에는 개별 컬럼만 있음. **마이그레이션으로 `teacher_data JSONB` 컬럼 추가** 필요.

### `POST /api/iep/[iepId]/submit` — 의견서+동의서 제출
```
Request: {
  opinionEncrypted: string,  // AES-256-GCM 암호화된 ParentOpinion
  consentEncrypted: string,  // AES-256-GCM 암호화된 ConsentForm
  opinionIv: string,         // IV (hex)
  consentIv: string,         // IV (hex)
  guardianNameHash: string,  // SHA-256
  signatureBase64: string    // 서명 이미지 (base64)
}
Process:
  1. 서명 이미지 → Supabase Storage 업로드
  2. tool4_parent_opinions INSERT
  3. tool4_consent_forms INSERT
  4. tool4_ieps.status → 'submitted'
  5. tool4_audit_logs INSERT (action: 'submit')
Response: { success: true, resultUrl: '/result?iepId=xxx' }
```

### `GET /api/iep/[iepId]/result` — 전체 데이터 조회
```
Request: URL params iepId
Process:
  - tool4_ieps + tool4_parent_opinions + tool4_consent_forms 조회
Response: {
  teacher: { ...개별 컬럼 또는 teacher_data },
  opinionEncrypted: string,
  opinionIv: string,
  consentEncrypted: string,
  consentIv: string,
  signaturePath: string
}
```

---

## 6. 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 (교사 진입)
│   ├── teacher/page.tsx    # 교사 입력 폼
│   ├── preview/page.tsx    # 안내장 미리보기 + QR
│   ├── form/page.tsx       # 학부모 의견서+동의서
│   ├── result/page.tsx     # 결과 문서 3개
│   ├── print-empty/page.tsx # 빈 양식 인쇄
│   └── api/
│       └── iep/
│           ├── route.ts              # POST: IEP 생성
│           └── [iepId]/
│               ├── route.ts          # GET: 교사 정보 조회
│               ├── submit/route.ts   # POST: 의견서+동의서 제출
│               └── result/route.ts   # GET: 전체 데이터 조회
├── components/
│   ├── result/
│   │   ├── ResultDoc1.tsx  # 안내장
│   │   ├── ResultDoc2.tsx  # 의견서
│   │   └── ResultDoc3.tsx  # 동의서
│   ├── form/               # 학부모 폼 섹션 (디자인은 다른 LLM)
│   │   ├── SectionBasicInfo.tsx
│   │   ├── SectionDisability.tsx
│   │   ├── SectionFamily.tsx
│   │   ├── SectionHealth.tsx
│   │   ├── SectionEducation.tsx
│   │   ├── SectionServices.tsx
│   │   └── SectionConsent.tsx
│   └── ui/                 # shadcn/ui 컴포넌트 (디자인은 다른 LLM)
├── lib/
│   ├── types.ts            # TypeScript 인터페이스
│   ├── defaults.ts         # 기본값
│   ├── supabase.ts         # Supabase 클라이언트 (server/client)
│   ├── encryption.ts       # AES-256-GCM 암/복호화
│   └── utils.ts            # 공통 유틸 (cn, hash 등)
```

---

## 7. 환경변수

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://cbdiiatkpppsfgijipsr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>  # API Routes 전용 (서버측)
```

---

## 8. 개발 단계

### Phase 1: 기반 구축 (현재 LLM)
1. ~~프로젝트 백지화 및 Next.js 초기화~~
2. 환경변수 설정
3. 핵심 라이브러리: `types.ts`, `defaults.ts`, `supabase.ts`, `encryption.ts`
4. Supabase 스키마 보완 (teacher_data JSONB 추가 마이그레이션)
5. API Routes 구현
6. 결과 문서 컴포넌트 (ResultDoc1~3) — 로직만, 디자인은 기본

### Phase 2: 페이지 로직 (현재 LLM)
1. 교사 입력 → API 연동
2. 미리보기 → QR 생성
3. 학부모 폼 → 암호화 → API 제출
4. 결과 페이지 → 복호화 → 문서 렌더링
5. 전체 플로우 E2E 검증

### Phase 3: 디자인 (다른 LLM)
- UI/UX 전반, 모바일 최적화, 접근성
- 폼 섹션 컴포넌트 디자인
- shadcn/ui 컴포넌트 커스터마이징

---

## 9. 의존성

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "nanoid": "^5",
    "qrcode.react": "^4",
    "react-signature-canvas": "^1",
    "lucide-react": "^0.575",
    "clsx": "^2",
    "tailwind-merge": "^3"
  }
}
```
