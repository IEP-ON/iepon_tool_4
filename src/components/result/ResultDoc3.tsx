"use client";

import type { TeacherInput, ConsentForm } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
  consent: ConsentForm;
}

function ConsentRow({ label, value }: { label: string; value: boolean | null }) {
  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2 text-[11pt]">{label}</td>
      <td className="border border-gray-300 px-4 py-2 text-center text-[12pt] font-bold w-20">
        {value === true ? "O" : value === false ? "X" : "-"}
      </td>
    </tr>
  );
}

export function ResultDoc3({ teacher, consent: c }: Props) {
  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일`;
  };

  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[11pt] leading-relaxed">
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-xl font-bold tracking-tight mb-2">
          {teacher.year}학년도 {teacher.schoolName} 특수학급
        </h1>
        <h2 className="text-2xl font-bold">
          개인정보 수집·이용 및 교육활동 포괄 동의서
        </h2>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-red-600 print:text-black mr-2">[필수]</span> 동의 1 — 기본 개인정보 수집·이용
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="기본 개인정보 수집·이용" value={c.consent1} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-red-600 print:text-black mr-2">[필수]</span> 동의 2 — 건강·장애 정보 (민감정보)
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="건강·장애 정보 수집·이용" value={c.consent2} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-red-600 print:text-black mr-2">[필수]</span> 동의 3 — 개인정보 제3자 제공
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="개인정보 제3자 제공" value={c.consent3} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-red-600 print:text-black mr-2">[필수]</span> 동의 4 — 특수교육 운영 포괄
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="IEP 수립 및 실행" value={c.consent4_iep} />
            <ConsentRow label="교육과정 참여" value={c.consent4_curriculum} />
            <ConsentRow label="관련 서비스 제공" value={c.consent4_services} />
            <ConsentRow label="학교생활기록 작성·보관" value={c.consent4_records} />
            <ConsentRow label="IEP 결과 인계" value={c.consent4_handover} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-gray-600 print:text-black mr-2">[안내]</span> 안내 5 — 특수교육실무사 역할 확인
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="교수·학습 활동 보조" value={c.notice5_teaching} />
            <ConsentRow label="식사 지원" value={c.notice5_meal} />
            <ConsentRow label="용변 지원" value={c.notice5_restroom} />
            <ConsentRow label="이동 동선 보조" value={c.notice5_mobility} />
            <ConsentRow label="등하교 지원" value={c.notice5_commute} />
          </tbody></table>
          {c.notice5_note && <p className="mt-2 pl-2 text-[11pt]"><strong>알려주실 사항:</strong> {c.notice5_note}</p>}
        </section>

        <section className="page-break">
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-orange-600 print:text-black mr-2">[권장]</span> 동의 6 — 촬영 및 초상권
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="교육활동 기록용 촬영" value={c.consent6_photoRecord} />
            <ConsentRow label="학교 내부 문서 활용" value={c.consent6_internalUse} />
            <ConsentRow label="보호자 개인 전달" value={c.consent6_parentShare} />
            <ConsentRow label="학교 홈페이지·게시판" value={c.consent6_homepage} />
            <ConsentRow label="학교 공식 SNS" value={c.consent6_sns} />
            <ConsentRow label="학급 알림 채널" value={c.consent6_classChannel} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-orange-600 print:text-black mr-2">[권장]</span> 동의 7 — 공개수업·수업연구대회
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="장학공개수업" value={c.consent7_supervision} />
            <ConsentRow label="학부모 공개수업" value={c.consent7_parentOpen} />
            <ConsentRow label="동료 교사 상호 참관" value={c.consent7_peerObservation} />
            <ConsentRow label="수업연구대회 출품" value={c.consent7_competition} />
            <ConsentRow label="대외 연수·발표 활용" value={c.consent7_externalMaterial} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-orange-600 print:text-black mr-2">[권장]</span> 동의 8 — 현장체험학습
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="특수학급 현장체험학습" value={c.consent8_specialFieldTrip} />
            <ConsentRow label="통합학급 현장체험학습" value={c.consent8_regularFieldTrip} />
            <ConsentRow label="교내·교외 체험·행사" value={c.consent8_events} />
            <ConsentRow label="대중교통 이용 이동" value={c.consent8_publicTransport} />
            <ConsentRow label="학교안전공제 처리" value={c.consent8_insurance} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-red-600 print:text-black mr-2">[필수]</span> 동의 9 — 응급처치 및 의료 대리
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="학교 내 응급처치" value={c.consent9_firstAid} />
            <ConsentRow label="119 신고 및 병원 이송" value={c.consent9_119} />
            <ConsentRow label="보호자 연락 전 의료진 처치" value={c.consent9_priorTreatment} />
            <ConsentRow label="보건실 연결 및 처치" value={c.consent9_healthRoom} />
          </tbody></table>
          {c.emergencyContacts.some(ec => ec.name) && (
            <div className="mt-3">
              <p className="font-bold text-[11pt] mb-1 pl-2">응급 연락처:</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50"><tr>
                  <th className="border border-gray-300 px-4 py-2 w-16 text-center">순위</th>
                  <th className="border border-gray-300 px-4 py-2">성명</th>
                  <th className="border border-gray-300 px-4 py-2">관계</th>
                  <th className="border border-gray-300 px-4 py-2">연락처</th>
                </tr></thead>
                <tbody>
                  {c.emergencyContacts.map((ec, i) => ec.name && (
                    <tr key={i}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{i + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{ec.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{ec.relation}</td>
                      <td className="border border-gray-300 px-4 py-2">{ec.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-yellow-600 print:text-black mr-2">[선택]</span> 동의 10 — 심리·정서 상담
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="담임·상담교사 상담" value={c.consent10_counseling} />
            <ConsentRow label="Wee 클래스·센터 연계" value={c.consent10_wee} />
            <ConsentRow label="정서·행동특성 검사" value={c.consent10_assessment} />
            <ConsentRow label="상담 결과 IEP 활용" value={c.consent10_iepUse} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-yellow-600 print:text-black mr-2">[선택]</span> 동의 11 — 장애인식개선교육
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="익명 사례 수업 자료 활용" value={c.consent11_anonymousCase} />
            <ConsentRow label="장애인식개선 활동 참가" value={c.consent11_participation} />
          </tbody></table>
        </section>

        <section>
          <h3 className="text-[12pt] font-bold mb-2 flex items-center bg-gray-100 p-2 rounded print:bg-transparent print:border-b-2 print:border-gray-800 print:rounded-none">
            <span className="text-yellow-600 print:text-black mr-2">[선택]</span> 동의 12 — 통계·연구 활용
          </h3>
          <table className="w-full border-collapse border border-gray-300"><tbody>
            <ConsentRow label="통계 연보용 자료 제공" value={c.consent12_statistics} />
            <ConsentRow label="정책 연구용 가명정보 활용" value={c.consent12_research} />
          </tbody></table>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t-2 border-gray-800">
        <p className="text-[11pt] font-medium mb-4 italic">
          &quot;저는 위의 모든 내용을 충분히 읽고 이해하였으며, 각 항목에 대해 자유로운 의사에 따라 동의 여부를 표시하였음을 확인합니다.&quot;
        </p>
        <div className="text-right space-y-2">
          <p className="text-[12pt]">작성일: {formatDate(c.consentDate) || "온라인 제출"}</p>
          <p className="text-[12pt] font-medium">보호자 성명: <span className="font-bold underline underline-offset-4">{c.consentGuardianName}</span> (관계: {c.consentGuardianRelation})</p>
          <p className="text-sm text-gray-500 mt-2">※ 본 문서는 온라인으로 제출되어 전자서명법 제3조에 따라 전자적 형태의 서명 효력을 가집니다.</p>
        </div>
      </div>
    </div>
  );
}
