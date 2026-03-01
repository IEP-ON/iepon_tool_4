import { FullFormData, TeacherInput, ParentOpinion, ConsentForm } from "./types";

export const defaultTeacherInput: TeacherInput = {
  schoolName: "",
  schoolAddress: "",
  principalName: "",
  adminTeacherName: "",
  studentName: "",
  grade: "",
  classNum: "",
  year: new Date().getFullYear().toString(),
  semester: new Date().getMonth() < 7 ? "1" : "2",
  teacherName: "",
  teacherPhone: "",
  consultTime: "",
  meetingStartDate: "",
  meetingEndDate: "",
  meetingPlace: "",
  submissionDeadline: "",
  submissionDay: "",
};

export const defaultParentOpinion: ParentOpinion = {
  studentName: "",
  birthDate: "",
  guardianName: "",
  guardianRelation: "",
  guardianRelationOther: "",
  guardianPhone: "",

  disabilityRegistration: "",
  primaryDisability: "",
  secondaryDisability: "없음",
  secondaryDisabilityType: "",
  disabilitySeverity: "",
  firstRegistrationDate: "",

  specialEdArea: "",
  firstSelectionDate: "",

  primaryCaregiver: "부모 공동 양육",
  primaryCaregiverOther: "",
  multicultural: "해당 없음",
  multiculturalLanguage: "",

  attendanceMethod: "대면 참석",
  hopeDate1: "",
  hopeTime1: "",
  hopeDate2: "",
  hopeTime2: "",
  hopeDate3: "",
  hopeTime3: "",

  hasMedication: "없음",
  medications: [],
  schoolMedicationSupport: "필요 없음",
  allergies: [],
  allergyFoodDetail: "",
  allergyDrugDetail: "",
  allergyEnvDetail: "",
  hasSeizure: "없음",
  seizureRecent: "",
  seizureInstruction: "",
  dietaryRestriction: [],
  dietaryDiseaseDetail: "",
  dietaryCultureDetail: "",
  sleepCharacteristics: [],
  sensoryIssues: [],
  sensoryOther: "",

  assistiveTech: [],
  assistiveTechOther: "",
  assistiveDevice: [],
  assistiveDeviceOther: "",
  envModification: [],
  envModificationOther: "",

  strengths: "",
  uniqueTraits: "",

  levelLearning: "",
  levelCommunication: "",
  levelSocial: "",
  levelSelfCare: "",
  levelMotor: "",
  levelBehavior: "",

  priorityGoal: "",
  preferredMethod: "",
  evaluationOpinion: "",
  homeConnection: "",

  afterSchoolActivity: "",

  afterSchoolSpecialEd: "이용하지 않음",
  afterSchoolSpecialEdInSchool: "",
  afterSchoolSpecialEdOutSchool: "",
  transportSupport: "해당 없음",
  assistantSupport: "필요 없음",
  assistantSupportDetail: "",
  
  therapySupportInstitution: "",
  therapySupportDays: "",
  therapySupportArea: "",
  therapySupportList: [],
  
  rehabServiceInstitution: "",
  rehabServiceDays: "",
  rehabServiceArea: "",
  rehabServiceList: [],

  survivalSwimming: "",
  survivalSwimmingReason: "",
  schoolTrip: "",
  schoolTripReason: "",
  openClassObservation: "",
  fieldTrip: "",

  fiveYearVision: "",
  careerDirection: "",
  careerDirectionOther: "",
  educationValue: "",

  healthChanges: "",
  familyChanges: "",
  messageToTeacher: "",

  writeDate: "",
};

export const defaultConsentForm: ConsentForm = {
  consentGuardianName: "",
  consentGuardianRelation: "",
  consentSignatureBase64: "",
  consentTypingConfirm: "",
  consentDate: "",

  consent1: null,
  consent2: null,
  consent3: null,
  consent4_iep: null,
  consent4_curriculum: null,
  consent4_services: null,
  consent4_records: null,
  consent4_handover: null,

  consent6_photoRecord: null,
  consent6_internalUse: null,
  consent6_parentShare: null,
  consent6_homepage: null,
  consent6_sns: null,
  consent6_classChannel: null,

  consent7_supervision: null,
  consent7_parentOpen: null,
  consent7_peerObservation: null,
  consent7_competition: null,
  consent7_externalMaterial: null,

  consent8_specialFieldTrip: null,
  consent8_inclusiveFieldTrip: null,
  consent8_otherActivities: null,
  consent8_publicTransport: null,
  consent8_schoolInsurance: null,
  consent8_survivalSwimming: null,
  consent8_schoolTrip: null,

  consent9_firstAid: null,
  consent9_119: null,
  consent9_priorTreatment: null,
  consent9_healthRoom: null,
  emergencyContacts: [{ name: "", relation: "", phone: "" }],

  consent11_participation: null,
};

export const initialFullData: FullFormData = {
  teacher: defaultTeacherInput,
  opinion: defaultParentOpinion,
  consent: defaultConsentForm,
};
