"use client";

import type { TeacherInput, ConsentForm } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
  consent: ConsentForm;
  isEmptyForm?: boolean;
}

export function ResultDoc3({ teacher, consent, isEmptyForm = false }: Props) {
  const isChecked = (val: boolean | null, expected: boolean) => {
    if (isEmptyForm) return false;
    return val === expected;
  };

  const renderCheck = (label: string, isAgreed: boolean | null, expected: boolean) => (
    <span className="inline-flex items-center ml-3">
      <span className={`w-3.5 h-3.5 inline-block border border-black mr-1 ${isChecked(isAgreed, expected) ? 'bg-black text-white text-center text-[10px] leading-[14px]' : ''}`}>
        {isChecked(isAgreed, expected) ? '✓' : ''}
      </span>
      {label}
    </span>
  );

  const showSurvivalSwimming = isEmptyForm || consent.consent8_survivalSwimming !== null;
  const showSchoolTrip = isEmptyForm || consent.consent8_schoolTrip !== null;

  return (
    <div className={`mx-auto w-[210mm] min-h-[297mm] px-10 py-8 bg-white print:p-0 print:shadow-none text-[9.5pt] leading-snug ${isEmptyForm ? 'print-empty-form' : ''}`}>
      <div className="text-center mb-4 border-b-2 border-black pb-3">
        <h1 className="text-[18pt] font-bold tracking-tight">
          특수교육대상자 교육지원 및 정보제공 동의서
        </h1>
        <p className="text-[8.5pt] text-gray-600 mt-1">
          {teacher.schoolName} · 「장애인 등에 대한 특수교육법」 및 「개인정보보호법」에 근거
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. 필수 동의 */}
        <section>
          <h2 className="text-[10pt] font-bold bg-gray-100 p-1.5 border border-black">1. 필수 동의 사항 (교육 및 지원을 위해 반드시 필요)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9pt]">
            <colgroup>
              <col className="w-[73%]" />
              <col className="w-[27%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">1) 기본 개인정보 수집·이용 (IEP 수립, 성적·출결 관리 등)</p>
                  <p className="text-gray-500 text-[8pt]">성명, 생년월일, 연락처, 가정환경, 특수교육 선정 현황 등</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent1, true)} {renderCheck("미동의", consent.consent1, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">2) 건강·장애 민감정보 수집·이용</p>
                  <p className="text-gray-500 text-[8pt]">장애유형/정도, 복약정보, 알레르기, 발작이력, 감각특성 등 (개인정보보호법 제23조)</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent2, true)} {renderCheck("미동의", consent.consent2, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">3) 제3자 정보 제공 (교육청, 특수교육지원센터, 치료지원기관 등)</p>
                  <p className="text-gray-500 text-[8pt]">관련 서비스 신청, 응급상황 대처, 진로·직업 연계 목적</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent3, true)} {renderCheck("미동의", consent.consent3, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">4) 교내 정보 공유 및 협력 지도 (통합학급 담임, 교과·보건·영양교사 등)</p>
                  <p className="text-gray-500 text-[8pt]">학교생활 적응 지원, 통합교육 협력, 급식 지도, 응급처치 대비</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent4_handover, true)} {renderCheck("미동의", consent.consent4_handover, false)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 2. 생명·안전 (응급처치) */}
        <section>
          <h2 className="text-[10pt] font-bold bg-gray-100 p-1.5 border border-black">2. 생명 및 안전 보호 (응급처치 동의 — 필수)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9pt]">
            <colgroup>
              <col className="w-[73%]" />
              <col className="w-[27%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">1) 교직원에 의한 1차 응급처치 (심폐소생술 등) 시행</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent9_firstAid, true)} {renderCheck("미동의", consent.consent9_firstAid, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">2) 응급 상황 시 119 신고 및 병원 이송 조치</p>
                  <p className="text-gray-500 text-[8pt]">보호자 연락 지연 시 학교 판단하에 최우선으로 응급조치를 실시함에 동의</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent9_119, true)} {renderCheck("미동의", consent.consent9_119, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">3) 보호자 연락 불가 시 의료진의 즉각 처치 동의</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent9_priorTreatment, true)} {renderCheck("미동의", consent.consent9_priorTreatment, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">4) 보건실 이용 및 보건교사 처치, 처방약(학교 보관분) 투약 지원</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent9_healthRoom, true)} {renderCheck("미동의", consent.consent9_healthRoom, false)}
                </td>
              </tr>
            </tbody>
          </table>
          {/* 응급 연락망 */}
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9pt]">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-50 px-2 py-1.5 text-left font-bold text-[9pt]" colSpan={4}>
                  응급 연락망 (보호자 연락 불가 시 연락할 분)
                </th>
              </tr>
              {isEmptyForm ? (
                <>
                  {[1, 2].map((n) => (
                    <tr key={n}>
                      <td className="border border-black px-2 py-1.5 w-[8%] text-center text-gray-400">{n}순위</td>
                      <td className="border border-black px-2 py-1.5 w-[30%]">성명: ___________</td>
                      <td className="border border-black px-2 py-1.5 w-[20%]">관계: _______</td>
                      <td className="border border-black px-2 py-1.5">연락처: ___________________</td>
                    </tr>
                  ))}
                </>
              ) : consent.emergencyContacts && consent.emergencyContacts.length > 0 ? (
                consent.emergencyContacts.map((c, i) => (
                  <tr key={i}>
                    <td className="border border-black px-2 py-1.5 w-[8%] text-center text-gray-500">{i + 1}순위</td>
                    <td className="border border-black px-2 py-1.5 w-[30%]">성명: {c.name}</td>
                    <td className="border border-black px-2 py-1.5 w-[20%]">관계: {c.relation}</td>
                    <td className="border border-black px-2 py-1.5">연락처: {c.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-black px-2 py-1.5 text-gray-400 text-center" colSpan={4}>등록된 응급 연락망 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 3. 교육활동 참여 및 초상권 (선택/권장) */}
        <section>
          <h2 className="text-[10pt] font-bold bg-gray-100 p-1.5 border border-black">3. 교육활동 참여 및 초상권 (선택/권장)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9pt]">
            <colgroup>
              <col className="w-[73%]" />
              <col className="w-[27%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">1) 교육활동 중 사진·영상 촬영 (학생 포트폴리오, 교내 행사 기록용)</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent6_photoRecord, true)} {renderCheck("미동의", consent.consent6_photoRecord, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">2) 대외 홍보 및 게시 (학교 홈페이지, 학급 밴드, SNS, 소식지 등)</p>
                  <p className="text-gray-500 text-[8pt]">미동의 시 모자이크 처리 또는 뒷모습 위주로 활용됩니다.</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent6_homepage, true)} {renderCheck("미동의", consent.consent6_homepage, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">3) 특수학급 단독 현장체험학습 참여</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent8_specialFieldTrip, true)} {renderCheck("미동의", consent.consent8_specialFieldTrip, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">4) 통합학급 주관 현장체험학습 참여</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent8_inclusiveFieldTrip, true)} {renderCheck("미동의", consent.consent8_inclusiveFieldTrip, false)}
                </td>
              </tr>
              {showSurvivalSwimming && (
                <tr>
                  <td className="border border-black px-2 py-1.5">
                    <p className="font-bold">5) 생존수영(안전체험 교육) 참여 <span className="font-normal text-gray-500">(3·4학년 해당)</span></p>
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center align-middle">
                    {renderCheck("동의", consent.consent8_survivalSwimming, true)} {renderCheck("미동의", consent.consent8_survivalSwimming, false)}
                  </td>
                </tr>
              )}
              {showSchoolTrip && (
                <tr>
                  <td className="border border-black px-2 py-1.5">
                    <p className="font-bold">6) 수학여행 및 수련활동 참여 <span className="font-normal text-gray-500">(5·6학년 해당)</span></p>
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center align-middle">
                    {renderCheck("동의", consent.consent8_schoolTrip, true)} {renderCheck("미동의", consent.consent8_schoolTrip, false)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">7) 교외 활동 시 대중교통(지하철, 버스 등) 이용</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent8_publicTransport, true)} {renderCheck("미동의", consent.consent8_publicTransport, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">8) 공개수업·장학 참관 및 수업연구대회 출품</p>
                  <p className="text-gray-500 text-[8pt]">학부모 공개수업, 동료 장학, 장학공개수업, 연구대회 출품 포함 (미동의 시 불이익 없음)</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent7_supervision, true)} {renderCheck("미동의", consent.consent7_supervision, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5">
                  <p className="font-bold">9) 장애인식개선 관련 활동에 직접 참여</p>
                </td>
                <td className="border border-black px-2 py-1.5 text-center align-middle">
                  {renderCheck("동의", consent.consent11_participation, true)} {renderCheck("미동의", consent.consent11_participation, false)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className="border-2 border-black p-3 mt-4">
        <p className="text-[9pt] text-center font-bold mb-3">
          본인은 「개인정보보호법」 및 관련 법령에 의거하여 위 사항들을 충분히 숙지하였으며,
          학생의 원활한 교육 지원을 위해 동의합니다.
        </p>
        <div className="flex justify-end gap-6 text-[10pt] items-end h-14">
          <p className="mb-2">
            작성일: {isEmptyForm ? "202  년   월   일" : consent.consentDate || `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`}
          </p>
          <div className="flex items-end gap-2">
            <span className="mb-2">보호자 성명:</span>
            <span className={isEmptyForm ? "inline-block w-24 border-b border-black mb-2" : "mb-2 font-bold"}>
              {!isEmptyForm ? consent.consentGuardianName : ""}
            </span>
            <span className="mb-2">(서명)</span>
            {!isEmptyForm && consent.consentSignatureBase64 ? (
              <div className="w-24 h-12 border-b border-black relative inline-block">
                <img src={consent.consentSignatureBase64} alt="보호자 서명" className="absolute bottom-0 w-full max-h-[150%] object-contain" />
              </div>
            ) : (
              <span className="inline-block w-24 h-6 border-b border-black"></span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-3 text-center text-gray-500 text-[8pt]">
        <p>※ 수집된 정보는 특수교육 지원 목적으로만 사용되며, 목적 달성 시 안전하게 파기됩니다.</p>
      </div>
    </div>
  );
}
