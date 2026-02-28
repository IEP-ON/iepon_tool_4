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
    <span className="inline-flex items-center ml-4">
      <span className={`w-3.5 h-3.5 inline-block border border-black mr-1 ${isChecked(isAgreed, expected) ? 'bg-black text-white text-center text-[10px] leading-[14px]' : ''}`}>
        {isChecked(isAgreed, expected) ? '✓' : ''}
      </span>
      {label}
    </span>
  );

  return (
    <div className={`mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[10pt] leading-tight ${isEmptyForm ? 'print-empty-form' : ''}`}>
      <div className="text-center mb-6 border-b-2 border-black pb-3">
        <h1 className="text-xl font-bold tracking-tight">
          특수교육대상자 교육지원 및 정보제공 동의서
        </h1>
      </div>

      <div className="mb-4 text-[10pt]">
        <p className="text-justify mb-2">
          {teacher.schoolName}에서는 「장애인 등에 대한 특수교육법」 및 「개인정보보호법」에 따라 
          학생의 안전하고 효과적인 학교생활 지원을 위해 아래와 같이 동의를 구합니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. 필수 동의 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">1. 필수 동의 사항 (교육 및 지원을 위해 반드시 필요)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9.5pt]">
            <colgroup>
              <col className="w-[75%]" />
              <col className="w-[25%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">1) 개인정보 및 민감정보 수집·이용 (개별화교육계획 수립, 성적처리, 출결관리 등)</p>
                  <p className="text-gray-600 text-[8.5pt] ml-3">- 수집항목: 성명, 생년월일, 연락처, 장애유형/정도, 병력, 복약 정보 등</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent1, true)} {renderCheck("미동의", consent.consent1, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">2) 제3자 정보 제공 (교육청, 특수교육지원센터, 병원, 치료지원 기관 등)</p>
                  <p className="text-gray-600 text-[8.5pt] ml-3">- 제공목적: 관련 서비스(치료, 통학 등) 신청, 응급상황 대처, 진로/직업 연계 등</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent3, true)} {renderCheck("미동의", consent.consent3, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">3) 교내 정보 공유 및 협력 지도 (통합학급 담임, 교과교사, 보건/영양교사 등)</p>
                  <p className="text-gray-600 text-[8.5pt] ml-3">- 제공목적: 학교생활 적응 지원, 응급처치, 급식 지도, 통합교육 전반 협력</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent4_handover, true)} {renderCheck("미동의", consent.consent4_handover, false)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 2. 안전 및 응급처치 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">2. 생명 및 안전 보호 (응급처치 동의)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9.5pt]">
            <colgroup>
              <col className="w-[75%]" />
              <col className="w-[25%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">1) 응급 상황 발생 시 119 신고 및 병원 이송 조치</p>
                  <p className="text-gray-600 text-[8.5pt] ml-3">※ 보호자 연락 지연 시 학교의 판단하에 최우선적으로 응급조치를 실시함에 동의합니다.</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent9_119, true)} {renderCheck("미동의", consent.consent9_119, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">2) 보건실 이용 및 기본 응급처치, 처방약(학교 보관분) 투약 지원</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent9_healthRoom, true)} {renderCheck("미동의", consent.consent9_healthRoom, false)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 3. 교육활동 참여 및 권장 동의 */}
        <section>
          <h2 className="text-[11pt] font-bold bg-gray-100 p-1.5 border border-black">3. 교육활동 참여 및 초상권 (선택)</h2>
          <table className="w-full border-collapse border border-black mt-[-1px] text-[9.5pt]">
            <colgroup>
              <col className="w-[75%]" />
              <col className="w-[25%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">1) 교육활동 중 사진 및 영상 촬영 (학생 포트폴리오, 교내 행사 기록용)</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent6_photoRecord, true)} {renderCheck("미동의", consent.consent6_photoRecord, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">2) 대외 홍보 및 게시 (학교 홈페이지, 학급 밴드, 소식지 등)</p>
                  <p className="text-gray-600 text-[8.5pt] ml-3">※ 미동의 시 모자이크 처리 또는 뒷모습 위주로 활용됩니다.</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent6_homepage, true)} {renderCheck("미동의", consent.consent6_homepage, false)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">
                  <p className="font-bold mb-1">3) 교내외 체험학습 및 외부 행사 참여 (특수학급 주관 현장체험, 통합학급 행사 등)</p>
                </td>
                <td className="border border-black px-2 py-2 text-center align-middle">
                  {renderCheck("동의", consent.consent8_specialFieldTrip, true)} {renderCheck("미동의", consent.consent8_specialFieldTrip, false)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="border-2 border-black p-4 mt-6">
          <p className="text-[10pt] text-center font-bold mb-4">
            본인은 「개인정보보호법」 및 관련 법령에 의거하여, 위 사항들을 충분히 숙지하였으며 <br/>학생의 원활한 교육 지원을 위해 동의합니다.
          </p>
          <div className="flex justify-end gap-6 text-[11pt]">
            <p>작성일: {isEmptyForm ? "202  년   월   일" : consent.consentDate || `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`}</p>
            <p className="flex items-center gap-2">
              <span>보호자 성명:</span> 
              <span className={isEmptyForm ? "inline-block w-24 border-b border-black" : ""}>
                {!isEmptyForm ? consent.consentGuardianName : ""}
              </span> 
              <span>(서명 또는 인)</span>
            </p>
          </div>
        </section>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>※ 수집된 정보는 특수교육 지원 목적으로만 사용되며, 목적 달성 시 안전하게 파기됩니다.</p>
        </div>
      </div>
    </div>
  );
}
