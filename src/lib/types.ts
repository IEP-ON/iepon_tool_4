export interface TeacherInput {
  schoolName: string;
  schoolAddress: string;
  principalName: string;
  adminTeacherName: string;
  studentName: string;
  grade: string;
  classNum: string;
  year: string;
  semester: string;
  teacherName: string;
  teacherPhone: string;
  consultTime: string;
  meetingStartDate: string;
  meetingEndDate: string;
  meetingPlace: string;
  submissionDeadline: string;
  submissionDay: string;
}

export interface ParentOpinion {
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
  hopeDate1: string;
  hopeTime1: string;
  hopeDate2: string;
  hopeTime2: string;
  hopeDate3: string;
  hopeTime3: string;

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

  // 기타
  healthChanges: string;
  familyChanges: string;
  messageToTeacher: string;
  writeDate: string;
}

export interface ConsentForm {
  consentGuardianName: string;
  consentGuardianRelation: string;
  consentSignatureBase64: string;
  consentTypingConfirm: string;
  consentDate: string;

  // 필수 동의
  consent1: boolean | null;
  consent2: boolean | null;
  consent3: boolean | null;
  consent4_handover: boolean | null;

  // 초상권/활동
  consent6_photoRecord: boolean | null;
  consent6_homepage: boolean | null;

  // 수업 참관/장학
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

export interface FullFormData {
  teacher: TeacherInput;
  opinion: ParentOpinion;
  consent: ConsentForm;
}
