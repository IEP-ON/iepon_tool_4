"use client";

import type { TeacherInput, ParentOpinion } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
  opinion: ParentOpinion;
  isEmptyForm?: boolean;
}

export function ResultDoc2({ teacher, opinion, isEmptyForm = false }: Props) {
  // 빈 양식 모드일 경우 값을 빈 문자열로 처리하거나 밑줄로 표시
  const getValue = (val: any) => {
    if (isEmptyForm) return "";
    return val;
  };

  const getArrayValue = (arr: any[]) => {
    if (isEmptyForm) return "";
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "";
    return arr.join(", ");
  };

  const isChecked = (val: any, target: any) => {
    if (isEmptyForm) return false;
    if (Array.isArray(val)) return val.includes(target);
    return val === target;
  };

  const renderCheckbox = (label: string, checked: boolean) => (
    <span className="inline-flex items-center mr-4 mb-1">
      <span className={`w-3.5 h-3.5 inline-block border border-black mr-1 ${checked && !isEmptyForm ? 'bg-black text-white text-center text-[10px] leading-[14px]' : ''}`}>
        {checked && !isEmptyForm ? '✓' : ''}
      </span>
      {label}
    </span>
  );

  return (
    <div className={`mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[10.5pt] leading-snug ${isEmptyForm ? 'print-empty-form' : ''}`}>
      <div className="text-center mb-6 border-b-2 border-black pb-3">
        <h1 className="text-xl font-bold tracking-tight">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육계획(IEP) 수립을 위한 보호자 의견서
        </h1>
      </div>

      <div className="flex justify-between items-end mb-4 text-[10pt]">
        <div><span className="font-bold mr-2">학생 성명:</span> <span className={isEmptyForm ? "inline-block w-24 border-b border-black" : ""}>{getValue(opinion.studentName)}</span></div>
        <div className="text-right text-gray-600">
          <p>작성일: {isEmptyForm ? "202  년   월   일" : getValue(opinion.writeDate) || `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. 기본 정보 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">1. 학생 기본 정보</h2>
          <table className="w-full border-collapse border border-black mt-[-1px]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 w-[15%] text-left">생년월일</th>
                <td className="border border-black px-2 py-1.5 w-[35%]">{getValue(opinion.birthDate)}</td>
                <th className="border border-black bg-gray-50 px-2 py-1.5 w-[15%] text-left">장애 유형</th>
                <td className="border border-black px-2 py-1.5 w-[35%]">
                  {getValue(opinion.primaryDisability)}
                  {opinion.secondaryDisability === "있음" && !isEmptyForm ? ` (동반: ${opinion.secondaryDisabilityType})` : ""}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">보호자 성명</th>
                <td className="border border-black px-2 py-1.5">
                  {getValue(opinion.guardianName)} 
                  {!isEmptyForm && opinion.guardianRelation ? `(관계: ${opinion.guardianRelation === "기타" ? opinion.guardianRelationOther : opinion.guardianRelation})` : ""}
                </td>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">연락처</th>
                <td className="border border-black px-2 py-1.5">{getValue(opinion.guardianPhone)}</td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">긴급 연락망</th>
                <td className="border border-black px-2 py-1.5 text-gray-500 text-[9pt]" colSpan={3}>
                  {isEmptyForm ? "" : "→ 동의서(문서 3) 응급처치 동의 항목 참조"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 2. 협의회 참석 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">2. 협의회 참석 희망</h2>
          <table className="w-full border-collapse border border-black mt-[-1px]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 w-[15%] text-left">참석 방법</th>
                <td className="border border-black px-2 py-1.5" colSpan={3}>
                  {renderCheckbox("학교 방문(대면)", isChecked(opinion.attendanceMethod, "대면 참석"))}
                  {renderCheckbox("전화 상담(유선)", isChecked(opinion.attendanceMethod, "유선 참석"))}
                  {renderCheckbox("의견서 제출로 갈음", isChecked(opinion.attendanceMethod, "의견서 제출로 갈음"))}
                </td>
              </tr>
              {(!isEmptyForm && (opinion.attendanceMethod === "대면 참석" || opinion.attendanceMethod === "유선 참석")) || isEmptyForm ? (
                <tr>
                  <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">희망 일시</th>
                  <td className="border border-black px-2 py-1.5" colSpan={3}>
                    {isEmptyForm ? (
                      <div className="flex gap-4">
                        <span>1순위: _____월 _____일 _____시</span>
                        <span>2순위: _____월 _____일 _____시</span>
                        <span>3순위: _____월 _____일 _____시</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {opinion.hopeDate1 && <span><span className="font-bold">1순위:</span> {opinion.hopeDate1} {opinion.hopeTime1}</span>}
                        {opinion.hopeDate2 && <span><span className="font-bold">2순위:</span> {opinion.hopeDate2} {opinion.hopeTime2}</span>}
                        {opinion.hopeDate3 && <span><span className="font-bold">3순위:</span> {opinion.hopeDate3} {opinion.hopeTime3}</span>}
                      </div>
                    )}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        {/* 3. 건강 및 특성 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">3. 학생 특성 및 현행 수준</h2>
          <table className="w-full border-collapse border border-black mt-[-1px]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 w-[15%] text-left align-top">건강/의료 특이사항</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="space-y-1">
                    {!isEmptyForm && opinion.hasMedication === "있음" && opinion.medications.length > 0 && (
                      <p><span className="font-bold">[복약]</span> {opinion.medications.map(m => `${m.name}(${m.dosage}, ${m.time})`).join(", ")} {opinion.schoolMedicationSupport === "지원 필요" ? "(학교 지원 필요)" : ""}</p>
                    )}
                    {!isEmptyForm && opinion.allergies.length > 0 && !opinion.allergies.includes("없음") && (
                      <p><span className="font-bold">[알레르기]</span> {opinion.allergies.join(", ")} {opinion.allergyFoodDetail} {opinion.allergyDrugDetail} {opinion.allergyEnvDetail}</p>
                    )}
                    {!isEmptyForm && opinion.hasSeizure === "있음" && (
                      <p><span className="font-bold">[발작/경련]</span> 최근: {opinion.seizureRecent} / 대처: {opinion.seizureInstruction}</p>
                    )}
                    {!isEmptyForm && opinion.sensoryIssues.length > 0 && !opinion.sensoryIssues.includes("해당 없음") && (
                      <p><span className="font-bold">[감각특성]</span> {opinion.sensoryIssues.join(", ")} {opinion.sensoryOther}</p>
                    )}
                    {!isEmptyForm && opinion.dietaryRestriction.length > 0 && !opinion.dietaryRestriction.includes("제한 없음") && (
                      <p><span className="font-bold">[식단제한]</span> {opinion.dietaryRestriction.join(", ")}</p>
                    )}
                    {!isEmptyForm && opinion.assistiveDevice.length > 0 && !opinion.assistiveDevice.includes("사용 안 함") && (
                      <p><span className="font-bold">[보조기기]</span> {opinion.assistiveDevice.join(", ")}</p>
                    )}
                    {isEmptyForm && <div className="h-12 border-b border-dotted border-gray-400 mb-2"></div>}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">가정에서 보는 강점 및 관심사</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[2em] whitespace-pre-wrap">{getValue(opinion.strengths)}</div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">기본생활습관 및 행동 특성</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[2em] whitespace-pre-wrap">{getValue(opinion.levelBehavior)}<br/>{getValue(opinion.levelSelfCare)}</div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">학습 및 의사소통 수준</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[2em] whitespace-pre-wrap">{getValue(opinion.levelLearning)}<br/>{getValue(opinion.levelCommunication)}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 4. 교육 목표 및 지원 요구 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">4. 교육 목표 및 지원 요구</h2>
          <table className="w-full border-collapse border border-black mt-[-1px]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 w-[15%] text-left align-top">이번 학기 최우선 교육 목표</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[2em] whitespace-pre-wrap">{getValue(opinion.priorityGoal)}</div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">가정과 연계하여 지도할 부분</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[2em] whitespace-pre-wrap">{getValue(opinion.homeConnection)}</div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">학교 행사 및 체험학습 지원</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="space-y-1">
                    {!isEmptyForm && opinion.survivalSwimming && <p><span className="font-bold">[생존수영]</span> {opinion.survivalSwimming} {opinion.survivalSwimmingReason}</p>}
                    {!isEmptyForm && opinion.openClassObservation && <p><span className="font-bold">[공개수업]</span> {opinion.openClassObservation}</p>}
                    {!isEmptyForm && opinion.fieldTrip && <p><span className="font-bold">[현장체험]</span> {opinion.fieldTrip}</p>}
                    {isEmptyForm && <div className="h-6"></div>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 5. 서비스 지원 현황 (구조 변경 반영) */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">5. 특수교육 관련 서비스 신청 및 이용</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9.5pt]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 w-[15%] text-left">방과후 자유수강권</th>
                <td className="border border-black px-2 py-1.5">
                  {isEmptyForm ? "" : (
                    opinion.afterSchoolSpecialEd === "이용 중" ? 
                      `이용 중 (교내: ${opinion.afterSchoolSpecialEdInSchool || '-'} / 교외: ${opinion.afterSchoolSpecialEdOutSchool || '-'})` : 
                      opinion.afterSchoolSpecialEd
                  )}
                </td>
                <th className="border border-black bg-gray-50 px-2 py-1.5 w-[15%] text-left">통학비(교통비)</th>
                <td className="border border-black px-2 py-1.5">{getValue(opinion.transportSupport)}</td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">치료지원 (교육청)</th>
                <td className="border border-black px-2 py-1.5" colSpan={3}>
                  {isEmptyForm ? "" : (
                    opinion.therapySupportList && opinion.therapySupportList.length > 0 ? 
                      opinion.therapySupportList.map(t => `${t.institution}(${t.area}, ${t.days})`).join(" / ") : 
                      (opinion.therapySupportInstitution === "이용하지 않음" ? "이용하지 않음" : "")
                  )}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">발달재활 (복지부)</th>
                <td className="border border-black px-2 py-1.5" colSpan={3}>
                  {isEmptyForm ? "" : (
                    opinion.rehabServiceList && opinion.rehabServiceList.length > 0 ? 
                      opinion.rehabServiceList.map(t => `${t.institution}(${t.area}, ${t.days})`).join(" / ") : 
                      (opinion.rehabServiceInstitution === "이용하지 않음" ? "이용하지 않음" : "")
                  )}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left">특수교육 보조인력</th>
                <td className="border border-black px-2 py-1.5" colSpan={3}>{getValue(opinion.assistantSupport)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 6. 진로 및 기타 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">6. 장기적 비전 및 기타 사항</h2>
          <table className="w-full border-collapse border border-black mt-[-1px]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 w-[15%] text-left align-top">5년 후 기대하는 모습</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[1.5em] whitespace-pre-wrap">{getValue(opinion.fiveYearVision)}</div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">졸업 후 진로 희망</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[1.5em] whitespace-pre-wrap">
                    {!isEmptyForm && opinion.careerDirection ? 
                      (opinion.careerDirection === "기타" ? opinion.careerDirectionOther : opinion.careerDirection) : 
                      ""}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-2 text-left align-top">기타 참고사항</th>
                <td className="border border-black px-2 py-2" colSpan={3}>
                  <div className="min-h-[1.5em] whitespace-pre-wrap space-y-0.5">
                    {!isEmptyForm && opinion.familyChanges && <p>가정 내 변화: {opinion.familyChanges}</p>}
                    {!isEmptyForm && opinion.messageToTeacher && <p>담임 선생님께: {opinion.messageToTeacher}</p>}
                    {isEmptyForm && <div className="h-6"></div>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      
      {/* 빈 양식일 경우 추가 작성 팁 안내 */}
      {isEmptyForm && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>※ 칸이 부족할 경우 뒷면이나 별지를 활용하여 자유롭게 적어주셔도 좋습니다.</p>
        </div>
      )}
    </div>
  );
}
