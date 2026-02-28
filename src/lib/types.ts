// 교사 입력 (문서1 안내장 생성용)
export interface TeacherInput {
  schoolName: string;
  studentName: string;
  grade: string;
  classNum: string;
  semester: string;
  year: string;
  teacherName: string;
  teacherPhone: string;
  consultTime: string; // 상담 가능 시간
  meetingDate: string; // 협의회 일시
  meetingDay: string; // 요일
  meetingAmPm: string; // 오전/오후
  meetingHour: string;
  meetingMinute: string;
  meetingPlace: string; // 장소 (교실 호수)
  submissionDeadline: string; // 제출 기한
  submissionDay: string; // 제출 기한 요일
  principalName: string; // 교장
  adminTeacherName: string; // 교무부장(개인정보보호책임자)
  schoolAddress: string;
}

// 보호자 의견서 (문서2)
export interface ParentOpinion {
  // 0. 기본정보
  studentName: string;
  birthDate: string;
  guardianName: string;
  guardianRelation: string;
  guardianRelationOther: string;
  guardianPhone: string;
  writeDate: string;

  // A. 장애인 등록 현황
  disabilityRegistration: string; // 등록됨 | 미등록 | 신청중
  primaryDisability: string;
  secondaryDisability: string;
  secondaryDisabilityType: string;
  disabilitySeverity: string;
  firstRegistrationDate: string;

  // B. 특수교육대상자 선정 현황
  specialEdSelection: string; // 선정됨 | 미선정 | 신청중
  specialEdArea: string;
  firstSelectionDate: string;
  currentPlacement: string;

  // ① 가정 환경
  primaryCaregiver: string;
  primaryCaregiverOther: string;
  siblings: string; // 없음 | 있음
  siblingTotal: string;
  siblingOrder: string;
  siblingDisability: string;
  multicultural: string; // 아니오 | 예
  multiculturalLanguage: string;
  afterSchoolCare: string;
  afterSchoolCareOther: string;

  // ② 협의회 참석 방법
  attendanceMethod: string; // 대면 | 유선 | 의견서
  availableTime: string;

  // ③ 건강·의료 정보
  hasMedication: string; // 없음 | 있음
  medications: { name: string; dosage: string; time: string }[];
  schoolMedicationSupport: string; // 없음 | 있음
  allergies: string[]; // 없음 | 식품 | 약물 | 환경
  allergyFoodDetail: string;
  allergyDrugDetail: string;
  allergyEnvDetail: string;
  hasSeizure: string; // 없음 | 있음
  seizureRecent: string;
  seizureInstruction: string;
  dietaryRestriction: string[]; // 없음 | 질환 | 종교·문화
  dietaryDiseaseDetail: string;
  dietaryCultureDetail: string;
  sleepCharacteristics: string[];
  sensoryIssues: string[];
  sensoryOther: string;

  // ④ 보조기기 및 환경 수정
  assistiveTech: string[];
  assistiveTechOther: string;
  assistiveDevice: string[];
  assistiveDeviceOther: string;
  envModification: string[];
  envModificationOther: string;

  // ⑤ 우리 아이의 강점과 특성
  strengths: string;
  uniqueTraits: string;

  // ⑥ 가정에서 바라본 현재 수준
  levelLearning: string;
  levelCommunication: string;
  levelSocial: string;
  levelSelfCare: string;
  levelMotor: string;
  levelBehavior: string;

  // ⑦ 이번 학기 교육 목표
  priorityGoal: string;
  preferredMethod: string;
  evaluationOpinion: string;
  homeConnection: string;

  // ⑧ 외부 치료·방과후 지원 현황
  afterSchoolActivity: string;
  therapyServices: { institution: string; area: string; type: string }[];

  // ⑨ 특수교육 관련 서비스 신청
  afterSchoolSpecialEd: string;
  transportSupport: string;
  assistantSupport: string;
  therapySupportInstitution: string;
  therapySupportArea: string;
  rehabServiceInstitution: string;
  rehabServiceArea: string;

  // ⑩ 학교 행사 및 활동
  survivalSwimming: string; // 참가 | 불참
  survivalSwimmingReason: string;
  openClassObservation: string;
  fieldTrip: string; // 참여 | 불참

  // ⑪ 미래·전환교육 비전
  fiveYearVision: string;
  careerDirection: string;
  careerDirectionOther: string;
  educationValue: string;

  // ⑫ 보호자 소통 선호 방식
  preferredContact: string[];
  availableTimeSlot: string[];
  emergencyContact2Name: string;
  emergencyContact2Relation: string;
  emergencyContact2Phone: string;

  // ⑬ 학교에 특별히 알려주실 내용
  healthChanges: string;
  familyChanges: string;
  messageToTeacher: string;
}

// 동의서 (문서3) - 각 항목별 동의/미동의
export interface ConsentForm {
  // 동의 1 — 기본 개인정보
  consent1: boolean | null;

  // 동의 2 — 건강·장애 정보 (민감정보)
  consent2: boolean | null;

  // 동의 3 — 제3자 제공
  consent3: boolean | null;

  // 동의 4 — 특수교육 운영 포괄
  consent4_iep: boolean | null;
  consent4_curriculum: boolean | null;
  consent4_services: boolean | null;
  consent4_records: boolean | null;
  consent4_handover: boolean | null;

  // 안내 5 — 특수교육실무사 확인
  notice5_teaching: boolean;
  notice5_meal: boolean;
  notice5_restroom: boolean;
  notice5_mobility: boolean;
  notice5_commute: boolean;
  notice5_note: string;

  // 동의 6 — 촬영 및 초상권
  consent6_photoRecord: boolean | null;
  consent6_internalUse: boolean | null;
  consent6_parentShare: boolean | null;
  consent6_homepage: boolean | null;
  consent6_sns: boolean | null;
  consent6_classChannel: boolean | null;

  // 동의 7 — 공개수업·수업연구대회
  consent7_supervision: boolean | null;
  consent7_parentOpen: boolean | null;
  consent7_peerObservation: boolean | null;
  consent7_competition: boolean | null;
  consent7_externalMaterial: boolean | null;

  // 동의 8 — 현장체험학습
  consent8_specialFieldTrip: boolean | null;
  consent8_regularFieldTrip: boolean | null;
  consent8_events: boolean | null;
  consent8_publicTransport: boolean | null;
  consent8_insurance: boolean | null;

  // 동의 9 — 응급처치
  consent9_firstAid: boolean | null;
  consent9_119: boolean | null;
  consent9_priorTreatment: boolean | null;
  consent9_healthRoom: boolean | null;
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];

  // 동의 10 — 심리·정서 상담
  consent10_counseling: boolean | null;
  consent10_wee: boolean | null;
  consent10_assessment: boolean | null;
  consent10_iepUse: boolean | null;

  // 동의 11 — 장애인식개선교육
  consent11_anonymousCase: boolean | null;
  consent11_participation: boolean | null;

  // 동의 12 — 통계·연구 활용
  consent12_statistics: boolean | null;
  consent12_research: boolean | null;

  // 서명
  consentGuardianName: string;
  consentGuardianRelation: string;
  consentDate: string;
}

// 전체 데이터 (URL에 담기는 최종 형태)
export interface FullFormData {
  teacher: TeacherInput;
  opinion: ParentOpinion;
  consent: ConsentForm;
}
