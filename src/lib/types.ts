export interface TeacherInput {
  schoolName: string;
  schoolAddress: string;
  principalName: string;
  adminTeacherName: string; // 교무부장 등 개인정보보호책임자
  studentName: string;
  grade: string;
  classNum: string;
  year: string;
  semester: string;
  teacherName: string;
  teacherPhone: string;
  consultTime: string;

  // 협의회 운영 기간 (새로 변경됨)
  meetingStartDate: string;
  meetingEndDate: string;
  meetingPlace: string;

  submissionDeadline: string;
  submissionDay: string;
}

export interface ParentOpinion {
  // 0. 기본 정보
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
  specialEdSelection: string;
  specialEdArea: string;
  firstSelectionDate: string;
  currentPlacement: string; // 특수학급, 일반학급 등

  // 1. 가정 환경
  primaryCaregiver: string;
  primaryCaregiverOther: string;
  siblings: string; // 있음/없음
  siblingTotal: string;
  siblingOrder: string;
  siblingDisability: string; // 형제자매 중 장애 유무
  multicultural: string; // 예/아니오
  multiculturalLanguage: string;
  afterSchoolCare: string; // 방과 후 주 양육/돌봄 형태
  afterSchoolCareOther: string;

  // 2. 협의회 참석 및 연락
  attendanceMethod: string;
  availableTime: string;
  // 새로 추가된 희망 일시
  hopeDate1: string;
  hopeTime1: string;
  hopeDate2: string;
  hopeTime2: string;
  hopeDate3: string;
  hopeTime3: string;

  preferredContact: string[]; // 선호 연락 방식 (전화, 문자, 알림장 등) - 다중 선택
  availableTimeSlot: string[]; // 연락 가능 시간대 - 다중 선택으로 변경
  emergencyContact2Name: string;
  emergencyContact2Relation: string;
  emergencyContact2Phone: string;

  // 3. 건강/의료
  hasMedication: string;
  medications: Array<{ name: string; dosage: string; time: string }>;
  schoolMedicationSupport: string; // 학교 투약 지원 필요 여부
  allergies: string[];
  allergyFoodDetail: string;
  allergyDrugDetail: string;
  allergyEnvDetail: string;
  hasSeizure: string;
  seizureRecent: string; // 최근 발작 시기
  seizureInstruction: string; // 대처 지침
  dietaryRestriction: string[]; // 종교, 질환 등 식단 제한
  dietaryDiseaseDetail: string;
  dietaryCultureDetail: string;
  sleepCharacteristics: string[];
  sensoryIssues: string[]; // 시각, 청각, 촉각 등 민감성
  sensoryOther: string;

  // 4. 보조기기/환경
  assistiveTech: string[]; // AAC, 시/청각 보조 등
  assistiveTechOther: string;
  assistiveDevice: string[]; // 휠체어, 워커, 보조기 등
  assistiveDeviceOther: string;
  envModification: string[]; // 좌석배치, 조명 등 환경 수정
  envModificationOther: string;

  // 5. 강점과 특성
  strengths: string;
  uniqueTraits: string;

  // 6. 현재 수준 (가정에서 관찰한)
  levelLearning: string;
  levelCommunication: string;
  levelSocial: string;
  levelSelfCare: string;
  levelMotor: string;
  levelBehavior: string;

  // 7. 교육 목표
  priorityGoal: string; // 가장 우선시하는 교육 목표
  preferredMethod: string; // 선호하는 지도 방법/접근법
  evaluationOpinion: string; // 평가 방식에 대한 의견 (예: 수행평가 시 수정 요구)
  homeConnection: string; // 학교와 연계하여 가정에서 지도하고 싶은 부분

  // 8. 외부 지원/치료
  afterSchoolActivity: string; // 학교 밖 활동 (학원, 복지관 등)
  therapyServices: Array<{ institution: string; area: string; type: string }>; // 치료/재활

  // 9. 학교 서비스 신청
  afterSchoolSpecialEd: string; // 방과후학교 특수교육 신청 여부
  afterSchoolSpecialEdInSchool: string; // 교내 이용 내용
  afterSchoolSpecialEdOutSchool: string; // 교외 이용 내용
  
  transportSupport: string; // 통학지원 신청 여부/방법
  assistantSupport: string; // 특수교육보조인력 지원 필요 여부
  
  therapySupportInstitution: string; // 교육청 치료지원(기관명)
  therapySupportDays: string; // 치료지원 이용 요일
  therapySupportArea: string; // 치료영역
  
  rehabServiceInstitution: string; // 복지부 발달재활(기관명)
  rehabServiceDays: string; // 발달재활 이용 요일
  rehabServiceArea: string; // 치료영역

  // 10. 행사/체험
  survivalSwimming: string; // 생존수영 (참여/불참/참관)
  survivalSwimmingReason: string;
  openClassObservation: string; // 공개수업 참관 여부
  fieldTrip: string; // 현장체험학습 참여 여부/유의사항

  // 11. 진로/미래
  fiveYearVision: string; // 5년 후 아이의 모습 기대
  careerDirection: string; // 졸업 후 진로 희망
  careerDirectionOther: string;
  educationValue: string; // 교육에서 가장 중요하게 생각하는 가치

  // 13. 기타
  healthChanges: string; // 최근 건강/복약 변동
  familyChanges: string; // 최근 가정 내 주요 변화
  messageToTeacher: string; // 교사에게 남길 말

  writeDate: string;
}

export interface ConsentForm {
  // 기본정보 (보호자 작성)
  consentGuardianName: string;
  consentGuardianRelation: string;
  consentDate: string;

  // 필수 동의 (거부 시 서비스 제한)
  consent1: boolean | null; // 기본 개인정보 수집
  consent2: boolean | null; // 건강/장애 민감정보 수집
  consent3: boolean | null; // 제3자 제공 (보건, 영양, 지원센터 등)
  consent4_iep: boolean | null;
  consent4_curriculum: boolean | null;
  consent4_services: boolean | null;
  consent4_records: boolean | null;
  consent4_handover: boolean | null;

  // 안내 및 확인
  notice5_teaching: boolean;
  notice5_meal: boolean;
  notice5_restroom: boolean;
  notice5_mobility: boolean;
  notice5_commute: boolean;
  notice5_note: string;

  // 권장 동의 (거부 가능, 교육활동 기록 및 홍보)
  consent6_photoRecord: boolean | null; // 초상권/촬영 (기록)
  consent6_internalUse: boolean | null; // 내부 활용
  consent6_parentShare: boolean | null; // 부모 공유
  consent6_homepage: boolean | null; // 홈페이지
  consent6_sns: boolean | null; // SNS/홍보
  consent6_classChannel: boolean | null; // 학급채널

  consent7_supervision: boolean | null; // 장학
  consent7_parentOpen: boolean | null; // 학부모 공개수업
  consent7_peerObservation: boolean | null; // 동료 장학
  consent7_competition: boolean | null; // 연구대회
  consent7_externalMaterial: boolean | null; // 대외 연수

  consent8_specialFieldTrip: boolean | null; // 특수 현체
  consent8_regularFieldTrip: boolean | null; // 통합 현체
  consent8_events: boolean | null; // 체험/행사
  consent8_publicTransport: boolean | null; // 대중교통
  consent8_insurance: boolean | null; // 안전공제

  // 필수: 생명/안전
  consent9_firstAid: boolean | null;
  consent9_119: boolean | null;
  consent9_priorTreatment: boolean | null;
  consent9_healthRoom: boolean | null;
  emergencyContacts: Array<{ name: string; relation: string; phone: string }>;

  // 선택 동의
  consent10_counseling: boolean | null; // 심리/정서
  consent10_wee: boolean | null;
  consent10_assessment: boolean | null;
  consent10_iepUse: boolean | null;

  consent11_anonymousCase: boolean | null; // 장애인식개선
  consent11_participation: boolean | null;

  consent12_statistics: boolean | null; // 통계/연구
  consent12_research: boolean | null;
}

export interface FullFormData {
  teacher: TeacherInput;
  opinion: ParentOpinion;
  consent: ConsentForm;
}
