"use client";

import type { ParentOpinion, ConsentForm } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  opinion: ParentOpinion;
  consent: ConsentForm;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
  updateConsent: (key: keyof ConsentForm, value: any) => void;
}

const SELECT_CLS = "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";
const TEXTAREA_CLS = "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none";

type EventConfig = {
  title: string;
  subtitle?: string;
  opinionKey?: keyof ParentOpinion;
  reasonKey?: keyof ParentOpinion;
  consentKey: keyof ConsentForm;
  reasonPlaceholder?: string;
};

const EVENT_ITEMS: EventConfig[] = [
  { title: "특수학급 현장체험학습", opinionKey: "specialFieldTrip", consentKey: "consent8_specialFieldTrip" },
  { title: "통합학급 현장체험학습", opinionKey: "inclusiveFieldTrip", consentKey: "consent8_inclusiveFieldTrip" },
  { title: "생존수영(안전체험 교육)", subtitle: "3·4학년 해당", opinionKey: "survivalSwimming", reasonKey: "survivalSwimmingReason", consentKey: "consent8_survivalSwimming", reasonPlaceholder: "예: 물에 대한 공포가 심합니다" },
  { title: "수학여행 및 수련활동", subtitle: "5·6학년 해당", opinionKey: "schoolTrip", reasonKey: "schoolTripReason", consentKey: "consent8_schoolTrip", reasonPlaceholder: "예: 외박이 어렵습니다" },
  { title: "교외 활동 시 대중교통 이용", consentKey: "consent8_publicTransport" },
  { title: "공개수업·장학 참관", opinionKey: "openClassObservation", consentKey: "consent7_supervision" },
];

export function Step4Service({ opinion, consent, updateOpinion, updateConsent }: Props) {
  const addListItem = (key: "therapySupportList" | "rehabServiceList") => {
    updateOpinion(key, [...(opinion[key] || []), { institution: "", days: "", area: "" }]);
  };
  const removeListItem = (key: "therapySupportList" | "rehabServiceList", idx: number) => {
    updateOpinion(key, (opinion[key] as any[]).filter((_: any, i: number) => i !== idx));
  };
  const updateListItem = (key: "therapySupportList" | "rehabServiceList", idx: number, field: string, val: string) => {
    const copy = [...(opinion[key] as any[])];
    copy[idx] = { ...copy[idx], [field]: val };
    updateOpinion(key, copy);
  };

  const handleEventChange = (ev: EventConfig, value: string) => {
    if (ev.opinionKey) updateOpinion(ev.opinionKey, value);
    if (value === "참여 희망") {
      updateConsent(ev.consentKey, true);
    } else if (value === "불참") {
      updateConsent(ev.consentKey, false);
    } else if (value === "해당없음") {
      updateConsent(ev.consentKey, null);
      if (ev.reasonKey) updateOpinion(ev.reasonKey, "");
    }
    if (value !== "불참" && ev.reasonKey) {
      updateOpinion(ev.reasonKey, "");
    }
  };

  const handleConsentOnlyChange = (ev: EventConfig, value: string) => {
    if (value === "동의") {
      updateConsent(ev.consentKey, true);
    } else if (value === "미동의") {
      updateConsent(ev.consentKey, false);
    }
  };

  const getEventValue = (ev: EventConfig): string => {
    if (ev.opinionKey) return (opinion[ev.opinionKey] as string) || "";
    return "";
  };

  const getConsentOnlyValue = (ev: EventConfig): string => {
    const v = consent[ev.consentKey];
    if (v === true) return "동의";
    if (v === false) return "미동의";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">서비스 및 학교 행사</h2>
        <p className="text-gray-500 mt-1">지원 서비스, 행사 참여 의향, 진로 계획을 알려주세요.</p>
      </div>

      {/* ───── 카드1: 지원 서비스 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">지원 서비스 신청 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 보조인력 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">1. 특수교육 보조인력</h3>
            <select className={SELECT_CLS} value={opinion.assistantSupport} onChange={(e) => updateOpinion("assistantSupport", e.target.value)}>
              <option value="">선택</option>
              <option value="신청">신청함 (지원이 필요함)</option>
              <option value="미신청">신청 안 함</option>
            </select>
            {opinion.assistantSupport === "신청" && (
              <Input placeholder="필요한 지원 내용 (예: 이동 보조, 식사 보조 등)" value={opinion.assistantSupportDetail} onChange={(e) => updateOpinion("assistantSupportDetail", e.target.value)} />
            )}
          </div>

          {/* 통학비 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">2. 통학비 지원</h3>
            <select className={SELECT_CLS} value={opinion.transportSupport} onChange={(e) => updateOpinion("transportSupport", e.target.value)}>
              <option value="">선택</option>
              <option value="신청">신청함</option>
              <option value="미신청">신청 안 함</option>
            </select>
          </div>

          {/* 방과후 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">3. 방과후학교 (특수교육 자유수강권)</h3>
            <select className={SELECT_CLS} value={opinion.afterSchoolSpecialEd} onChange={(e) => updateOpinion("afterSchoolSpecialEd", e.target.value)}>
              <option value="">선택</option>
              <option value="교내이용">교내 방과후 참여</option>
              <option value="교외이용">교외 (전자카드 이용)</option>
              <option value="이용하지 않음">이용 안 함</option>
            </select>
            {(opinion.afterSchoolSpecialEd === "교내이용" || opinion.afterSchoolSpecialEd === "교외이용") && (
              <div className="grid sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-xs">교내 프로그램</Label>
                  <Input placeholder="예: 미술, 음악 등" value={opinion.afterSchoolSpecialEdInSchool} onChange={(e) => updateOpinion("afterSchoolSpecialEdInSchool", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">교외 프로그램</Label>
                  <Input placeholder="예: 수영, 피아노 등" value={opinion.afterSchoolSpecialEdOutSchool} onChange={(e) => updateOpinion("afterSchoolSpecialEdOutSchool", e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* 치료지원 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">4. 치료지원 (교육청 바우처)</h3>
            {(opinion.therapySupportList || []).map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1"><Label className="text-xs">기관명</Label><Input placeholder="기관명" value={item.institution} onChange={(e) => updateListItem("therapySupportList", idx, "institution", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">영역</Label><Input placeholder="예: 언어, 감각 등" value={item.area} onChange={(e) => updateListItem("therapySupportList", idx, "area", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">요일/횟수</Label><Input placeholder="예: 주2회" value={item.days} onChange={(e) => updateListItem("therapySupportList", idx, "days", e.target.value)} /></div>
                <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-10 w-10" onClick={() => removeListItem("therapySupportList", idx)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addListItem("therapySupportList")} className="w-full"><Plus className="w-4 h-4 mr-1" /> 치료지원 기관 추가</Button>
          </div>

          {/* 재활서비스 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">5. 발달재활서비스 (복지부 바우처)</h3>
            {(opinion.rehabServiceList || []).map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1"><Label className="text-xs">기관명</Label><Input placeholder="기관명" value={item.institution} onChange={(e) => updateListItem("rehabServiceList", idx, "institution", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">영역</Label><Input placeholder="예: 작업, 놀이 등" value={item.area} onChange={(e) => updateListItem("rehabServiceList", idx, "area", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">요일/횟수</Label><Input placeholder="예: 주1회" value={item.days} onChange={(e) => updateListItem("rehabServiceList", idx, "days", e.target.value)} /></div>
                <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-10 w-10" onClick={() => removeListItem("rehabServiceList", idx)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addListItem("rehabServiceList")} className="w-full"><Plus className="w-4 h-4 mr-1" /> 재활서비스 기관 추가</Button>
          </div>

          {/* 학교 밖 활동 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">6. 학교 밖 활동 (학원, 개인 치료 등)</h3>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 미술학원 주 2회, 개인 언어치료 주 1회" value={opinion.afterSchoolActivity} onChange={(e) => updateOpinion("afterSchoolActivity", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ───── 카드2: 학교 행사 참여 및 동의 (통합 UI) ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">학교 행사 참여 및 동의</CardTitle>
          <CardDescription>참여를 선택하시면 해당 활동 동의가 자동으로 처리됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {EVENT_ITEMS.map((ev) => {
            const hasOpinionKey = !!ev.opinionKey;
            const currentVal = hasOpinionKey ? getEventValue(ev) : "";
            const isDeclined = currentVal === "불참";

            return (
              <div key={ev.consentKey as string} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="flex items-baseline gap-2">
                  <Label className="text-sm font-medium">{ev.title}</Label>
                  {ev.subtitle && <span className="text-xs text-gray-400">({ev.subtitle})</span>}
                </div>

                {hasOpinionKey ? (
                  <select
                    className={SELECT_CLS}
                    value={currentVal}
                    onChange={(e) => handleEventChange(ev, e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="참여 희망">참여 희망</option>
                    <option value="불참">불참</option>
                    <option value="해당없음">해당 학년 아님 / 해당 없음</option>
                  </select>
                ) : (
                  <select
                    className={SELECT_CLS}
                    value={getConsentOnlyValue(ev)}
                    onChange={(e) => handleConsentOnlyChange(ev, e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="동의">동의</option>
                    <option value="미동의">미동의</option>
                  </select>
                )}

                {isDeclined && ev.reasonKey && (
                  <Input
                    placeholder={ev.reasonPlaceholder || "불참 사유를 적어주세요"}
                    value={(opinion[ev.reasonKey] as string) || ""}
                    onChange={(e) => updateOpinion(ev.reasonKey!, e.target.value)}
                    className="mt-1"
                  />
                )}

                {hasOpinionKey && currentVal && currentVal !== "해당없음" && (
                  <p className="text-xs text-gray-400 ml-1">
                    {currentVal === "참여 희망" ? "→ 동의 자동 처리됨" : "→ 미동의 자동 처리됨"}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ───── 카드3: 진로 및 장기 비전 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">진로 및 장기적 비전</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>5년 후 기대하는 모습</Label>
            <textarea rows={3} className={TEXTAREA_CLS} placeholder="예: 중학교에 진학하여 스스로 대중교통을 이용하고 혼자 장보기를 할 수 있기를 바랍니다." value={opinion.fiveYearVision} onChange={(e) => updateOpinion("fiveYearVision", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>졸업 후 진로 희망</Label>
              <select className={SELECT_CLS} value={opinion.careerDirection} onChange={(e) => updateOpinion("careerDirection", e.target.value)}>
                <option value="">선택</option>
                <option value="상급학교 진학">상급학교 진학</option>
                <option value="전공과 진학">전공과(전환교육) 진학</option>
                <option value="보호 작업장">보호 작업장</option>
                <option value="일반 취업">일반 취업</option>
                <option value="아직 모르겠음">아직 모르겠음</option>
                <option value="기타">기타</option>
              </select>
            </div>
            {opinion.careerDirection === "기타" && (
              <div className="space-y-2">
                <Label>기타 진로 상세</Label>
                <Input placeholder="희망하시는 진로를 적어주세요" value={opinion.careerDirectionOther} onChange={(e) => updateOpinion("careerDirectionOther", e.target.value)} />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>교육에서 가장 중요하게 여기는 가치</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 안전하게 생활하는 것, 자립 능력을 기르는 것이 가장 중요합니다." value={opinion.educationValue} onChange={(e) => updateOpinion("educationValue", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ───── 카드4: 기타 참고 사항 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">기타 참고 사항</CardTitle>
          <CardDescription>담임 선생님께 전하고 싶은 이야기가 있으시면 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>최근 건강·복약 변화</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 지난달 약 용량이 변경되었습니다." value={opinion.healthChanges} onChange={(e) => updateOpinion("healthChanges", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>가정 내 변화</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 최근 동생이 태어나 적응 중입니다." value={opinion.familyChanges} onChange={(e) => updateOpinion("familyChanges", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>담임 선생님께 하고 싶은 말</Label>
            <textarea rows={3} className={TEXTAREA_CLS} placeholder="자유롭게 적어주세요." value={opinion.messageToTeacher} onChange={(e) => updateOpinion("messageToTeacher", e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
