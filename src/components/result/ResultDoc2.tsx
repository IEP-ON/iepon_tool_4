"use client";

import type { TeacherInput, ParentOpinion } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
  opinion: ParentOpinion;
}

function Field({ label, value }: { label: string; value: string | string[] | undefined }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  if (!display) return null;
  return (
    <tr>
      <th className="border border-gray-300 px-4 py-2 font-medium bg-gray-50 text-left w-[25%] text-[11pt]">{label}</th>
      <td className="border border-gray-300 px-4 py-2 text-[11pt]">{display}</td>
    </tr>
  );
}

export function ResultDoc2({ teacher, opinion: o }: Props) {
  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일`;
  };

  const formatHopeDate = (date: string, time: string) => {
    if (!date) return "";
    return `${formatDate(date)} ${time ? time + " 경" : ""}`;
  };

  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[11pt] leading-relaxed">
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육계획 수립을 위한 보호자 의견서
        </h1>
        <p className="text-[12pt] font-medium text-gray-700">{teacher.schoolName} 특수학급</p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            0. 기본 정보
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="학년·반" value={`${teacher.grade}학년 ${teacher.classNum}반`} />
              <Field label="학생 성명" value={o.studentName} />
              <Field label="생년월일" value={formatDate(o.birthDate)} />
              <Field label="보호자 성명" value={o.guardianName} />
              <Field label="보호자 관계" value={o.guardianRelation === "기타" ? o.guardianRelationOther : o.guardianRelation} />
              <Field label="연락처" value={o.guardianPhone} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            A. 장애인 등록 현황 (복지부)
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="등록 여부" value={o.disabilityRegistration} />
              <Field label="주장애 유형" value={o.primaryDisability} />
              <Field label="부장애 유형" value={o.secondaryDisability === "있음" ? o.secondaryDisabilityType : o.secondaryDisability} />
              <Field label="장애 정도" value={o.disabilitySeverity} />
              <Field label="최초 등록일" value={formatDate(o.firstRegistrationDate)} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            B. 특수교육대상자 선정 현황 (교육청)
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="선정 여부" value={o.specialEdSelection} />
              <Field label="선정 장애 영역" value={o.specialEdArea} />
              <Field label="최초 선정일" value={formatDate(o.firstSelectionDate)} />
              <Field label="현재 배치 형태" value={o.currentPlacement} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ① 가정 환경
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="주양육자 구성" value={o.primaryCaregiver === "기타" ? o.primaryCaregiverOther : o.primaryCaregiver} />
              <Field label="형제자매" value={o.siblings === "있음" ? `총 ${o.siblingTotal}명 중 ${o.siblingOrder}째 / 형제 장애: ${o.siblingDisability}` : o.siblings} />
              <Field label="다문화 가정" value={o.multicultural === "예" ? `예 (주 사용 언어: ${o.multiculturalLanguage})` : o.multicultural} />
              <Field label="방과 후 주 돌봄" value={o.afterSchoolCare === "기타" ? o.afterSchoolCareOther : o.afterSchoolCare} />
            </tbody>
          </table>
        </section>

        <section className="page-break">
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ② 협의회 참석 희망 및 방법
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="참석 방법" value={o.attendanceMethod} />
              {o.attendanceMethod !== "의견서 제출로 갈음" && (
                <>
                  <Field label="희망 일시 (1순위)" value={formatHopeDate(o.hopeDate1, o.hopeTime1)} />
                  <Field label="희망 일시 (2순위)" value={formatHopeDate(o.hopeDate2, o.hopeTime2)} />
                  <Field label="희망 일시 (3순위)" value={formatHopeDate(o.hopeDate3, o.hopeTime3)} />
                </>
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ③ 건강·의료 정보
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="복약 여부" value={o.hasMedication} />
              {o.hasMedication === "있음" && o.medications.filter(m => m.name).map((m, i) => (
                <Field key={i} label={`약물 ${i + 1}`} value={`${m.name} / ${m.dosage} / ${m.time}`} />
              ))}
              <Field label="학교 내 투약 지원" value={o.schoolMedicationSupport} />
              <Field label="알레르기" value={o.allergies.length ? o.allergies.join(", ") + (o.allergyFoodDetail ? ` (식품: ${o.allergyFoodDetail})` : "") + (o.allergyDrugDetail ? ` (약물: ${o.allergyDrugDetail})` : "") + (o.allergyEnvDetail ? ` (환경: ${o.allergyEnvDetail})` : "") : undefined} />
              <Field label="발작·경련" value={o.hasSeizure === "있음" ? `있음 — 최근: ${o.seizureRecent} / 지침: ${o.seizureInstruction}` : o.hasSeizure} />
              <Field label="식이 제한" value={o.dietaryRestriction.length ? o.dietaryRestriction.join(", ") + (o.dietaryDiseaseDetail ? ` (${o.dietaryDiseaseDetail})` : "") + (o.dietaryCultureDetail ? ` (${o.dietaryCultureDetail})` : "") : undefined} />
              <Field label="수면 특성" value={o.sleepCharacteristics} />
              <Field label="감각 민감성" value={o.sensoryIssues.length ? o.sensoryIssues.join(", ") + (o.sensoryOther ? ` (${o.sensoryOther})` : "") : undefined} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ④ 보조기기 및 환경 수정
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="보조공학기기" value={o.assistiveTech.length ? o.assistiveTech.join(", ") + (o.assistiveTechOther ? ` (${o.assistiveTechOther})` : "") : undefined} />
              <Field label="보조기구" value={o.assistiveDevice.length ? o.assistiveDevice.join(", ") + (o.assistiveDeviceOther ? ` (${o.assistiveDeviceOther})` : "") : undefined} />
              <Field label="환경 수정 요청" value={o.envModification.length ? o.envModification.join(", ") + (o.envModificationOther ? ` (${o.envModificationOther})` : "") : undefined} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑤ 강점
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="잘하는 것, 좋아하는 것" value={o.strengths} />
              <Field label="특별한 특성이나 장점" value={o.uniqueTraits} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑥ 가정에서 바라본 현재 수준
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="학습" value={o.levelLearning} />
              <Field label="의사소통" value={o.levelCommunication} />
              <Field label="사회성·정서" value={o.levelSocial} />
              <Field label="자조기술" value={o.levelSelfCare} />
              <Field label="운동" value={o.levelMotor} />
              <Field label="행동 특성" value={o.levelBehavior} />
            </tbody>
          </table>
        </section>

        <section className="page-break">
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑦ 이번 학기 교육 목표 요구사항
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="우선 목표·영역" value={o.priorityGoal} />
              <Field label="선호 교육 방법" value={o.preferredMethod} />
              <Field label="평가 방식 의견" value={o.evaluationOpinion} />
              <Field label="가정 연계 내용" value={o.homeConnection} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑧ 외부 치료·방과후 지원 현황
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="방과 후 활동" value={o.afterSchoolActivity} />
              {o.therapyServices.filter(s => s.institution).map((s, i) => (
                <Field key={i} label={`치료 서비스 ${i + 1}`} value={`${s.institution} / ${s.area} / ${s.type}`} />
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑨ 특수교육 관련 서비스 신청 및 현황
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="방과후학교 특수교육" value={o.afterSchoolSpecialEd} />
              <Field label="통학지원" value={o.transportSupport} />
              <Field label="보조인력" value={o.assistantSupport} />
              <Field label="치료지원 (교육청)" value={o.therapySupportInstitution ? `${o.therapySupportInstitution} / ${o.therapySupportArea}` : undefined} />
              <Field label="발달재활서비스 (복지부)" value={o.rehabServiceInstitution ? `${o.rehabServiceInstitution} / ${o.rehabServiceArea}` : undefined} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑩ 학교 행사 및 활동
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="생존수영" value={o.survivalSwimming === "불참 희망" ? `불참 (사유: ${o.survivalSwimmingReason})` : o.survivalSwimming} />
              <Field label="공개수업 참관 방식" value={o.openClassObservation} />
              <Field label="현장체험학습" value={o.fieldTrip} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑪ 미래·전환교육 비전
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="5년 후 모습" value={o.fiveYearVision} />
              <Field label="졸업 후 진로" value={o.careerDirection === "기타" ? o.careerDirectionOther : o.careerDirection} />
              <Field label="교육 가치" value={o.educationValue} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑫ 보호자 소통 선호 방식
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="선호 연락 방식" value={o.preferredContact} />
              <Field label="연락 가능 시간대" value={o.availableTimeSlot} />
              <Field label="긴급 연락처 2순위" value={o.emergencyContact2Name ? `${o.emergencyContact2Name} (${o.emergencyContact2Relation}) ${o.emergencyContact2Phone}` : undefined} />
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            ⑬ 학교에 특별히 알려주실 내용
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <Field label="건강·복약 변경" value={o.healthChanges} />
              <Field label="가정 내 변화" value={o.familyChanges} />
              <Field label="선생님께 전하는 말" value={o.messageToTeacher} />
            </tbody>
          </table>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t-2 border-gray-800 text-right">
        <p className="text-[12pt] mb-2">작성일: {formatDate(o.writeDate) || "온라인 제출"}</p>
        <p className="text-[12pt] font-medium">보호자 성명: <span className="font-bold underline underline-offset-4">{o.guardianName}</span> (서명/인)</p>
        <p className="text-sm text-gray-500 mt-2">※ 본 문서는 온라인으로 제출되어 전자서명법 제3조에 따라 전자적 형태의 서명 효력을 가집니다.</p>
      </div>
    </div>
  );
}
