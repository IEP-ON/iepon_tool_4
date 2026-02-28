"use client";

import type { TeacherInput, ConsentForm } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
  consent: ConsentForm;
}

function ConsentRow({ label, value }: { label: string; value: boolean | null }) {
  return (
    <tr>
      <td className="border px-2 py-0.5 text-[10px]">{label}</td>
      <td className="border px-2 py-0.5 text-center text-[10px] w-16">
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
    <div className="px-10 py-6 print:px-0 print:py-0 text-[11px] print:text-[9pt] leading-snug">
      <div className="text-center mb-3">
        <h1 className="text-base print:text-[12pt] font-bold">
          {teacher.year}학년도 {teacher.schoolName} 특수학급
        </h1>
        <h2 className="text-sm print:text-[10pt] font-bold">
          개인정보 수집·이용 및 교육활동 포괄 동의서
        </h2>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[필수] 동의 1 — 기본 개인정보 수집·이용</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="기본 개인정보 수집·이용" value={c.consent1} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[필수] 동의 2 — 건강·장애 정보 (민감정보)</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="건강·장애 정보 수집·이용" value={c.consent2} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[필수] 동의 3 — 개인정보 제3자 제공</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="개인정보 제3자 제공" value={c.consent3} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[필수] 동의 4 — 특수교육 운영 포괄</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="IEP 수립 및 실행" value={c.consent4_iep} />
          <ConsentRow label="교육과정 참여" value={c.consent4_curriculum} />
          <ConsentRow label="관련 서비스 제공" value={c.consent4_services} />
          <ConsentRow label="학교생활기록 작성·보관" value={c.consent4_records} />
          <ConsentRow label="IEP 결과 인계" value={c.consent4_handover} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[안내] 안내 5 — 특수교육실무사 역할 확인</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="교수·학습 활동 보조" value={c.notice5_teaching} />
          <ConsentRow label="식사 지원" value={c.notice5_meal} />
          <ConsentRow label="용변 지원" value={c.notice5_restroom} />
          <ConsentRow label="이동 동선 보조" value={c.notice5_mobility} />
          <ConsentRow label="등하교 지원" value={c.notice5_commute} />
        </tbody></table>
        {c.notice5_note && <p className="mt-1 text-[10px]"><strong>알려주실 사항:</strong> {c.notice5_note}</p>}
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[강력 권장] 동의 6 — 촬영 및 초상권</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="교육활동 기록용 촬영" value={c.consent6_photoRecord} />
          <ConsentRow label="학교 내부 문서 활용" value={c.consent6_internalUse} />
          <ConsentRow label="보호자 개인 전달" value={c.consent6_parentShare} />
          <ConsentRow label="학교 홈페이지·게시판" value={c.consent6_homepage} />
          <ConsentRow label="학교 공식 SNS" value={c.consent6_sns} />
          <ConsentRow label="학급 알림 채널" value={c.consent6_classChannel} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[강력 권장] 동의 7 — 공개수업·수업연구대회</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="장학공개수업" value={c.consent7_supervision} />
          <ConsentRow label="학부모 공개수업" value={c.consent7_parentOpen} />
          <ConsentRow label="동료 교사 상호 참관" value={c.consent7_peerObservation} />
          <ConsentRow label="수업연구대회 출품" value={c.consent7_competition} />
          <ConsentRow label="대외 연수·발표 활용" value={c.consent7_externalMaterial} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[강력 권장] 동의 8 — 현장체험학습</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="특수학급 현장체험학습" value={c.consent8_specialFieldTrip} />
          <ConsentRow label="통합학급 현장체험학습" value={c.consent8_regularFieldTrip} />
          <ConsentRow label="교내·교외 체험·행사" value={c.consent8_events} />
          <ConsentRow label="대중교통 이용 이동" value={c.consent8_publicTransport} />
          <ConsentRow label="학교안전공제 처리" value={c.consent8_insurance} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[필수] 동의 9 — 응급처치 및 의료 대리</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="학교 내 응급처치" value={c.consent9_firstAid} />
          <ConsentRow label="119 신고 및 병원 이송" value={c.consent9_119} />
          <ConsentRow label="보호자 연락 전 의료진 처치" value={c.consent9_priorTreatment} />
          <ConsentRow label="보건실 연결 및 처치" value={c.consent9_healthRoom} />
        </tbody></table>
        {c.emergencyContacts.some(ec => ec.name) && (
          <div className="mt-1">
            <p className="font-bold text-[10px]">응급 연락처:</p>
            <table className="w-full border-collapse text-[10px]">
              <thead><tr className="bg-gray-100">
                <th className="border px-2 py-0.5">순위</th>
                <th className="border px-2 py-0.5">성명</th>
                <th className="border px-2 py-0.5">관계</th>
                <th className="border px-2 py-0.5">연락처</th>
              </tr></thead>
              <tbody>
                {c.emergencyContacts.map((ec, i) => ec.name && (
                  <tr key={i}>
                    <td className="border px-2 py-0.5 text-center">{i + 1}</td>
                    <td className="border px-2 py-0.5">{ec.name}</td>
                    <td className="border px-2 py-0.5">{ec.relation}</td>
                    <td className="border px-2 py-0.5">{ec.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[선택] 동의 10 — 심리·정서 상담</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="담임·상담교사 상담" value={c.consent10_counseling} />
          <ConsentRow label="Wee 클래스·센터 연계" value={c.consent10_wee} />
          <ConsentRow label="정서·행동특성 검사" value={c.consent10_assessment} />
          <ConsentRow label="상담 결과 IEP 활용" value={c.consent10_iepUse} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[선택] 동의 11 — 장애인식개선교육</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="익명 사례 수업 자료 활용" value={c.consent11_anonymousCase} />
          <ConsentRow label="장애인식개선 활동 참가" value={c.consent11_participation} />
        </tbody></table>
      </div>

      <div className="mb-3">
        <h3 className="font-bold mb-0.5">[선택] 동의 12 — 통계·연구 활용</h3>
        <table className="w-full border-collapse"><tbody>
          <ConsentRow label="통계 연보용 자료 제공" value={c.consent12_statistics} />
          <ConsentRow label="정책 연구용 가명정보 활용" value={c.consent12_research} />
        </tbody></table>
      </div>

      <div className="mt-4 pt-2 border-t">
        <p className="text-[10px] mb-2">
          &quot;저는 위의 모든 내용을 충분히 읽고 이해하였으며, 각 항목에 대해 자유로운 의사에 따라 동의 여부를 표시하였음을 확인합니다.&quot;
        </p>
        <div className="text-[10px] space-y-0.5">
          <p>작성일: {formatDate(c.consentDate) || "온라인 제출"}</p>
          <p>보호자 성명: {c.consentGuardianName} / 관계: {c.consentGuardianRelation}</p>
          <p>서명: {c.consentGuardianName} (온라인 제출 &#8212; 「전자서명법」 제3조)</p>
        </div>
      </div>
    </div>
  );
}
