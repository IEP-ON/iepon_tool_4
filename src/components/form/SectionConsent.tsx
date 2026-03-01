"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsentToggle } from "./ConsentToggle";
import type { ConsentForm } from "@/lib/types";
import { ChevronDown, ChevronUp, Plus, Trash2, Eraser } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface Props {
  data: ConsentForm;
  update: (key: keyof ConsentForm, value: ConsentForm[keyof ConsentForm]) => void;
  teacherContext?: any; // 학년 정보 등을 받아오기 위함
  schoolName?: string;
  teacherName?: string;
  teacherPhone?: string;
  principalName?: string;
  adminTeacherName?: string;
  schoolAddress?: string;
}

export function SectionConsent({
  data,
  update,
  teacherContext,
  schoolName = "○○○초등학교",
  teacherName = "○○○",
  teacherPhone = "053-○○○-○○○○",
  principalName = "○○○",
  adminTeacherName = "○○○",
  schoolAddress = "대구광역시 ○○구 ○○로 ○○",
}: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Resize canvas on window resize to prevent distortion
  useEffect(() => {
    const handleResize = () => {
      if (sigCanvas.current) {
        const canvas = sigCanvas.current.getCanvas();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d")?.scale(ratio, ratio);
        sigCanvas.current.clear(); // Clear on resize to avoid corrupted rendering
        // If we already had a signature, we would ideally redraw it, but for simplicity we just clear it.
        // It's best to only resize on load or orientation change.
      }
    };
    
    // Initial resize
    setTimeout(handleResize, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignatureEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      update("consentSignatureBase64", sigCanvas.current.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      update("consentSignatureBase64", "");
    }
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Accordion = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="mt-3 text-sm bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => toggleExpand(id)}
        className="w-full flex items-center justify-between p-3.5 bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
      >
        <span className="font-semibold text-[13px] sm:text-sm">{title}</span>
        {expanded[id] ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
      </button>
      {expanded[id] && <div className="p-4 border-t border-gray-100 text-gray-600 space-y-2 leading-relaxed text-[13px] sm:text-sm">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">개인정보 수집·이용 및 교육활동 포괄 동의서</h2>
        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 border border-gray-200">
          <p className="font-medium text-gray-800">이 동의서는 우리 아이의 원활한 학교생활과 맞춤형 교육 지원을 위해 꼭 필요한 절차입니다.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="destructive" className="font-normal text-xs">필수 항목</Badge>
            <Badge className="bg-orange-500 font-normal text-xs">적극 권장 항목</Badge>
            <Badge className="bg-yellow-500 text-black font-normal text-xs">선택 항목</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 모든 내용은 철저히 암호화되어 보호되며, 교육 목적으로만 안전하게 사용됩니다.</p>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs text-gray-600">
            <p><strong>[보관 기간]</strong> 수집된 정보는 해당 학년도 종료 후 3년간 보관 후 파기됩니다.</p>
            <p><strong>[동의 철회]</strong> 동의 철회는 담임교사에게 서면으로 요청할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-600">
        <p className="font-medium text-gray-800 mb-1">[개인정보처리자 명시]</p>
        <p>「개인정보 보호법」 제30조에 따라 아래와 같이 처리자를 명시합니다.</p>
        <p>• 처리기관: {schoolName} (책임자: 교장 {principalName}, 관리자: 교무부장 {adminTeacherName})</p>
        <p>• 담당부서: 특수학급 (담당교사: {teacherName}, ☎ {teacherPhone})</p>
      </div>

      {/* 동의 1 */}
      <div className="space-y-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">필수</Badge>
          <h3 className="font-bold text-gray-900">동의 1 — 기본 개인정보 수집·이용</h3>
        </div>
        <ConsentToggle
          label="기본 정보 수집·이용에 동의합니다."
          value={data.consent1}
          onChange={(v) => update("consent1", v)}
        />
        <Accordion id="consent1" title="자세한 내용 보기 (수집 목적 및 항목)">
          <p><strong>수집 목적:</strong> 개별화교육계획(IEP) 수립 및 실행, 특수교육 관련 서비스 제공, 학교생활 안전 관리, 출결 및 학적 관리</p>
          <p><strong>수집 항목:</strong> 학생(성명, 생년월일, 학년/반), 보호자(성명, 관계, 연락처), 가정환경 정보, 특수교육대상자 선정 현황, 보조기기 사용 현황</p>
          <p><strong>보유 기간:</strong> 재학 중 보유, 졸업 또는 전출 후 5년간 보존 후 파기</p>
          <p className="text-red-600 mt-1"><strong>※ 미동의 시:</strong> 아이에게 맞는 개별화교육계획 수립 및 기본 교육서비스 제공이 매우 어렵습니다.</p>
        </Accordion>
      </div>

      {/* 동의 2 */}
      <div className="space-y-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">필수</Badge>
          <h3 className="font-bold text-gray-900">동의 2 — 건강·장애 정보 수집·이용 (민감정보)</h3>
        </div>
        <ConsentToggle
          label="건강 및 장애 관련 정보 수집·이용에 동의합니다."
          value={data.consent2}
          onChange={(v) => update("consent2", v)}
        />
        <Accordion id="consent2" title="자세한 내용 보기 (민감정보 취급)">
          <p className="text-xs text-blue-600 mb-1">※ 「개인정보 보호법」 제23조에 따라 건강 등 민감정보는 별도로 동의를 받습니다.</p>
          <p><strong>수집 목적:</strong> 장애 유형별 맞춤 지원(행동, 학습, 생활), 학교 내 건강 및 응급 상황 대비, 복약 관리, 치료지원 연계</p>
          <p><strong>수집 항목:</strong> 장애 등록 여부·유형·정도, 복약 정보, 알레르기, 발작/경련 이력, 수면/식이 특성, 감각 민감성 등 건강 관련 모든 정보</p>
          <p><strong>보유 기간:</strong> 재학 중 보유, 전출/졸업 후 10년 보존 후 파기</p>
          <p className="text-red-600 mt-1"><strong>※ 미동의 시:</strong> 응급 상황 대처 및 아이의 건강/행동 특성에 맞는 안전한 맞춤 지원이 불가능합니다.</p>
        </Accordion>
      </div>

      {/* 동의 3 */}
      <div className="space-y-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">필수</Badge>
          <h3 className="font-bold text-gray-900">동의 3 — 개인정보 제3자 제공</h3>
        </div>
        <ConsentToggle
          label="필요 기관(보건교사, 교육청 등)으로의 정보 제공에 동의합니다."
          value={data.consent3}
          onChange={(v) => update("consent3", v)}
        />
        <Accordion id="consent3" title="자세한 내용 보기 (제공받는 기관 및 항목)">
          <table className="w-full text-xs text-left border-collapse mt-1">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-1">제공받는 자</th>
                <th className="py-2 px-1">목적</th>
                <th className="py-2 px-1">제공 항목</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 px-1">특수교육지원센터</td><td className="py-2 px-1">행정·통계·지원</td><td className="py-2 px-1">기본 정보, 선정 현황</td></tr>
              <tr><td className="py-2 px-1">통합학급 담임</td><td className="py-2 px-1">통합교육 협력</td><td className="py-2 px-1">학습·행동 특성 정보</td></tr>
              <tr><td className="py-2 px-1">보건교사</td><td className="py-2 px-1">응급 및 건강 관리</td><td className="py-2 px-1">복약·알레르기·질환 정보</td></tr>
              <tr><td className="py-2 px-1">영양교사</td><td className="py-2 px-1">급식 안전 관리</td><td className="py-2 px-1">식품 알레르기·식이 제한</td></tr>
              <tr><td className="py-2 px-1">치료지원 제공기관</td><td className="py-2 px-1">서비스 연계 및 실행</td><td className="py-2 px-1">장애 유형, 발달 수준</td></tr>
            </tbody>
          </table>
          <p className="mt-2"><strong>보유 기간:</strong> 제공 목적 달성 시 즉시 파기 (단, 법령에 정한 경우 해당 기간 보존)</p>
        </Accordion>
      </div>

      {/* 동의 4 */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">필수</Badge>
          <h3 className="font-bold text-gray-900">동의 4 — 특수교육 운영 포괄 동의</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">1년 동안 진행되는 필수 교육활동들에 대한 포괄적 동의입니다.</p>
        <div className="space-y-2">
          <ConsentToggle label="개별화교육계획(IEP) 수립 및 실행" value={data.consent4_iep} onChange={(v) => update("consent4_iep", v)} />
          <ConsentToggle label="특수학급 및 통합학급 교육과정 참여" value={data.consent4_curriculum} onChange={(v) => update("consent4_curriculum", v)} />
          <ConsentToggle label="특수교육 관련 서비스 제공 (치료·보조인력·통학 등)" value={data.consent4_services} onChange={(v) => update("consent4_services", v)} />
          <ConsentToggle label="학교생활기록부 특수교육 항목 작성·보관" value={data.consent4_records} onChange={(v) => update("consent4_records", v)} />
          <ConsentToggle label="IEP 결과의 차년도 담임교사 인계 (교육적 연속성 확보)" value={data.consent4_handover} onChange={(v) => update("consent4_handover", v)} />
        </div>
      </div>

      {/* 동의 6 */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-orange-500">적극 권장</Badge>
          <h3 className="font-bold text-gray-900">동의 6 — 영상·사진 촬영 및 초상권</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">교육활동 기록을 위한 촬영과, 그 사진을 어디까지 공유할지 결정합니다.</p>
        
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 mb-3">
          <p className="text-sm font-bold text-gray-800">[내부 기록용]</p>
          <ConsentToggle label="교육활동 기록용 사진·영상 촬영" value={data.consent6_photoRecord} onChange={(v) => update("consent6_photoRecord", v)} />
          <ConsentToggle label="촬영 자료의 학교 내부 문서 활용 (IEP 파일, 관찰기록지 등)" value={data.consent6_internalUse} onChange={(v) => update("consent6_internalUse", v)} />
          <ConsentToggle label="촬영 자료의 보호자 개인 전달 (개인 알림장, 카카오톡 등)" value={data.consent6_parentShare} onChange={(v) => update("consent6_parentShare", v)} />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
          <p className="text-sm font-bold text-gray-800">[학급/학교 공유용]</p>
          <ConsentToggle label="학급 알림 채널 (하이클래스, e학습터 등 학급 내 공유)" value={data.consent6_classChannel} onChange={(v) => update("consent6_classChannel", v)} />
          <ConsentToggle label="학교 홈페이지 및 교내 게시판 게시" value={data.consent6_homepage} onChange={(v) => update("consent6_homepage", v)} />
          <ConsentToggle label="학교 공식 외부 SNS 및 교육청 홍보물 활용" value={data.consent6_sns} onChange={(v) => update("consent6_sns", v)} />
        </div>
      </div>

      {/* 동의 7 */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-orange-500">적극 권장</Badge>
          <h3 className="font-bold text-gray-900">동의 7 — 공개수업·외부 참관·수업연구대회</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">미동의 시에도 교육활동에는 어떠한 불이익도 없습니다.</p>
        <div className="space-y-2">
          <ConsentToggle label="학부모 공개수업 참관" value={data.consent7_parentOpen} onChange={(v) => update("consent7_parentOpen", v)} />
          <ConsentToggle label="교내 동료 교사 수업 상호 참관" value={data.consent7_peerObservation} onChange={(v) => update("consent7_peerObservation", v)} />
          <ConsentToggle label="장학공개수업 (교육청 장학사·관리자 참관)" value={data.consent7_supervision} onChange={(v) => update("consent7_supervision", v)} />
          <ConsentToggle label="수업연구대회 출품 (영상·사진·기록물 대외 제출)" value={data.consent7_competition} onChange={(v) => update("consent7_competition", v)} />
          <ConsentToggle label="대외 연수·발표 자료 활용 (반드시 익명화 처리함)" value={data.consent7_externalMaterial} onChange={(v) => update("consent7_externalMaterial", v)} />
        </div>
      </div>

      {/* 동의 8 */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-orange-500">적극 권장</Badge>
          <h3 className="font-bold text-gray-900">동의 8 — 현장체험학습 및 교외 교육활동</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">이는 '원칙적으로 참여 의향이 있다'는 포괄 확인이며, 구체적인 행사는 매번 별도 안내를 드립니다.</p>
        <div className="space-y-2">
          <ConsentToggle label="특수학급 단독 현장체험학습 참여" value={data.consent8_specialFieldTrip} onChange={(v) => update("consent8_specialFieldTrip", v)} />
          <ConsentToggle label="통합학급 주관 현장체험학습 참여" value={data.consent8_inclusiveFieldTrip} onChange={(v) => update("consent8_inclusiveFieldTrip", v)} />
          {teacherContext?.grade && (teacherContext.grade === "3" || teacherContext.grade === "4") && (
            <ConsentToggle label="생존수영(안전체험 교육) 참여" value={data.consent8_survivalSwimming} onChange={(v) => update("consent8_survivalSwimming", v)} />
          )}
          {teacherContext?.grade && (teacherContext.grade === "5" || teacherContext.grade === "6") && (
            <ConsentToggle label="수학여행 및 수련활동 참여" value={data.consent8_schoolTrip} onChange={(v) => update("consent8_schoolTrip", v)} />
          )}
          <ConsentToggle label="기타 교내·교외 체험 활동 참여" value={data.consent8_otherActivities} onChange={(v) => update("consent8_otherActivities", v)} />
          <ConsentToggle label="교외 활동 시 대중교통(지하철, 버스 등) 이용" value={data.consent8_publicTransport} onChange={(v) => update("consent8_publicTransport", v)} />
          <ConsentToggle label="활동 중 사고 발생 시 학교안전공제회 보상 처리" value={data.consent8_schoolInsurance} onChange={(v) => update("consent8_schoolInsurance", v)} />
        </div>
      </div>

      {/* 동의 9 */}
      <div className="space-y-3 bg-red-50/50 p-4 rounded-xl shadow-sm border border-red-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">필수</Badge>
          <h3 className="font-bold text-red-900">동의 9 — 응급처치 및 의료 대리</h3>
        </div>
        <p className="text-sm text-red-800 mb-3 font-medium">우리 아이의 생명과 안전을 위해 매우 중요한 항목입니다.</p>
        <div className="space-y-2">
          <ConsentToggle label="응급 상황 발생 시 교직원에 의한 1차 응급처치(심폐소생술 등) 시행" value={data.consent9_firstAid} onChange={(v) => update("consent9_firstAid", v)} />
          <ConsentToggle label="위급 판단 시 119 즉시 신고 및 병원 구급차 이송" value={data.consent9_119} onChange={(v) => update("consent9_119", v)} />
          <ConsentToggle label="보호자 연락이 닿지 않을 경우 생명을 위한 의료진의 즉각 처치 동의" value={data.consent9_priorTreatment} onChange={(v) => update("consent9_priorTreatment", v)} />
          <ConsentToggle label="일반적 이상 증상 발생 시 보건실 안내 및 보건교사 처치" value={data.consent9_healthRoom} onChange={(v) => update("consent9_healthRoom", v)} />
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg border border-red-200">
          <Label className="font-bold text-red-700 text-base">응급 연락망 (최소 1명 이상 필수)</Label>
          <p className="text-xs text-gray-500 mb-4">가장 빨리 연락이 닿을 수 있는 순서대로 적어주세요.</p>
          {data.emergencyContacts.map((contact, i) => (
            <div key={i} className="mb-4 last:mb-0 relative pr-10">
              <p className="text-sm font-bold text-gray-700 mb-1">{i + 1}순위 연락처</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="성명 (예: 김아빠)"
                  value={contact.name}
                  onChange={(e) => {
                    const updated = [...data.emergencyContacts];
                    updated[i] = { ...updated[i], name: e.target.value };
                    update("emergencyContacts", updated);
                  }}
                  className="bg-gray-50 focus:bg-white"
                />
                <Input
                  placeholder="관계 (예: 부)"
                  value={contact.relation}
                  onChange={(e) => {
                    const updated = [...data.emergencyContacts];
                    updated[i] = { ...updated[i], relation: e.target.value };
                    update("emergencyContacts", updated);
                  }}
                  className="bg-gray-50 focus:bg-white"
                />
                <Input
                  placeholder="연락처 (예: 010-0000-0000)"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => {
                    const updated = [...data.emergencyContacts];
                    updated[i] = { ...updated[i], phone: e.target.value };
                    update("emergencyContacts", updated);
                  }}
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
              {data.emergencyContacts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = data.emergencyContacts.filter((_, idx) => idx !== i);
                    update("emergencyContacts", updated);
                  }}
                  className="absolute top-0 right-0 text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update("emergencyContacts", [...data.emergencyContacts, { name: "", relation: "", phone: "" }])}
            className="w-full border-dashed border-2 text-red-600 border-red-200 hover:bg-red-50 mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> 연락처 추가
          </Button>
        </div>
      </div>

      {/* 동의 11 */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-yellow-500 text-black">선택</Badge>
          <h3 className="font-bold text-gray-900">동의 11 — 장애인식개선교육</h3>
        </div>
        <div className="space-y-2">
          <ConsentToggle label="장애인식개선 관련 활동에 우리 아이가 직접 참여" value={data.consent11_participation} onChange={(v) => update("consent11_participation", v)} />
        </div>
      </div>

      {/* 서명 */}
      <div className="bg-blue-50/60 p-4 sm:p-6 rounded-2xl border border-blue-100 shadow-sm mt-8">
        <div className="mb-6 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-blue-200 shadow-sm">
            <p className="text-sm sm:text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs">필수 확인</span>
              아래 문장을 텍스트 칸에 똑같이 입력해 주세요.
            </p>
            <p className="text-sm sm:text-base text-gray-800 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 font-bold select-all text-center">
              동의합니다.
            </p>
            <Input
              value={data.consentTypingConfirm}
              onChange={(e) => update("consentTypingConfirm", e.target.value)}
              placeholder="'동의합니다.' 라고 입력해 주세요"
              className={`mt-4 h-12 sm:h-14 text-sm sm:text-base font-medium placeholder:text-gray-400 border-2 transition-colors ${
                data.consentTypingConfirm === "동의합니다."
                  ? "border-green-500 bg-green-50/30 text-green-700 ring-1 ring-green-500"
                  : "border-blue-200 focus:border-blue-400 bg-white"
              }`}
            />
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5 lg:col-span-1">
            <Label className="font-bold">보호자 성명 (서명)</Label>
            <Input
              value={data.consentGuardianName}
              onChange={(e) => update("consentGuardianName", e.target.value)}
              placeholder="예: 홍길동"
              className="bg-white border-blue-200 h-12 text-lg"
            />
          </div>
          <div className="space-y-1.5 lg:col-span-1">
            <Label className="font-bold">학생과의 관계</Label>
            <Input
              value={data.consentGuardianRelation}
              onChange={(e) => update("consentGuardianRelation", e.target.value)}
              placeholder="예: 모"
              className="bg-white border-blue-200 h-12 text-lg"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label className="font-bold">작성일</Label>
            <Input
              type="date"
              value={data.consentDate}
              onChange={(e) => update("consentDate", e.target.value)}
              className="bg-white border-blue-200 h-12"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-end">
            <Label className="font-bold text-blue-900">손글씨 서명</Label>
            <Button type="button" variant="ghost" size="sm" onClick={clearSignature} className="h-8 px-2 text-gray-500 hover:text-red-600">
              <Eraser className="w-4 h-4 mr-1" /> 다시 쓰기
            </Button>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden relative touch-none">
            <SignatureCanvas
              ref={sigCanvas}
              onEnd={handleSignatureEnd}
              canvasProps={{
                className: "w-full h-40 cursor-crosshair",
                style: { width: '100%', height: '160px' }
              }}
              backgroundColor="white"
            />
            {(!data.consentSignatureBase64 || data.consentSignatureBase64 === "") && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300">
                <span>여기에 서명해 주세요</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-blue-600 mt-6 pt-4 border-t border-blue-200">
          「전자문서 및 전자거래 기본법」 제4조 및 「전자정부법」 제30조에 따라, 본 온라인 서식을 통한 제출은 전자 문서로서 유효합니다.
          정식 법적 효력을 위한 원본 서류가 필요한 경우, 담당 교사에게 별도 요청하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
