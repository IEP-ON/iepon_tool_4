"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

const SELECT_CLS = "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";
const TEXTAREA_CLS = "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none";

export function Step3Education({ opinion, updateOpinion }: Props) {
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

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">교육 및 지원 요구</h2>
        <p className="text-gray-500 mt-1">이번 학기 목표와 필요한 학교 지원을 선택해주세요.</p>
      </div>

      {/* ───── 현재 수준 (6영역) ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">가정에서 관찰되는 현재 수준</CardTitle>
          <CardDescription>각 영역에서 아이의 현재 모습을 간략히 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "levelLearning", label: "학습 (읽기·쓰기·수 개념 등)", ph: "예: 한글 자음 모음을 읽을 수 있으나 받침 단어는 어려워합니다." },
            { key: "levelCommunication", label: "의사소통 (말하기·듣기·표현)", ph: "예: 2~3어절로 의사표현이 가능합니다." },
            { key: "levelSocial", label: "사회성 (또래관계·규칙 이해)", ph: "예: 또래에 관심은 있으나 대화 시작이 어렵습니다." },
            { key: "levelSelfCare", label: "자조·일상생활 (식사·위생·옷입기)", ph: "예: 혼자 밥먹기 가능, 세수/양치 보조 필요" },
            { key: "levelMotor", label: "운동 (대근육·소근육)", ph: "예: 달리기 가능, 가위질과 글씨쓰기는 어려워합니다." },
            { key: "levelBehavior", label: "행동 (특이행동·자기조절)", ph: "예: 관심 없는 활동 시 자리 이탈이 잦습니다." },
          ] as { key: keyof ParentOpinion; label: string; ph: string }[]).map(({ key, label, ph }) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm">{label}</Label>
              <textarea rows={2} className={TEXTAREA_CLS} placeholder={ph} value={(opinion[key] as string) || ""} onChange={(e) => updateOpinion(key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ───── 교육 목표 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">교육 목표 및 지도 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>이번 학기 최우선 교육 목표</Label>
            <textarea rows={3} className={TEXTAREA_CLS} placeholder="예: 친구들과 인사하기, 스스로 화장실 가기 등" value={opinion.priorityGoal} onChange={(e) => updateOpinion("priorityGoal", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>효과적인 지도 방법 (보상/벌 등)</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 잘했을 때 좋아하는 스티커를 주면 좋습니다." value={opinion.preferredMethod} onChange={(e) => updateOpinion("preferredMethod", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>평가 방식에 대한 의견</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 실기 평가보다 구술이나 관찰로 평가해 주시면 좋겠습니다." value={opinion.evaluationOpinion} onChange={(e) => updateOpinion("evaluationOpinion", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>가정과 연계하여 지도할 부분</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 가정에서도 매일 10분씩 한글 따라쓰기를 하고 있습니다." value={opinion.homeConnection} onChange={(e) => updateOpinion("homeConnection", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ───── 지원 서비스 ───── */}
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

      {/* ───── 학교 행사 및 체험 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">학교 행사 및 체험학습</CardTitle>
          <CardDescription>참여 의사를 미리 알려주시면 계획 수립에 도움이 됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>생존수영 참여</Label>
              <select className={SELECT_CLS} value={opinion.survivalSwimming} onChange={(e) => updateOpinion("survivalSwimming", e.target.value)}>
                <option value="">선택</option>
                <option value="참여">참여 희망</option>
                <option value="불참">불참</option>
                <option value="해당없음">해당 학년 아님</option>
              </select>
            </div>
            {opinion.survivalSwimming === "불참" && (
              <div className="space-y-2">
                <Label>불참 사유</Label>
                <Input placeholder="예: 물에 대한 공포가 심합니다" value={opinion.survivalSwimmingReason} onChange={(e) => updateOpinion("survivalSwimmingReason", e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>수학여행/수련활동 참여</Label>
              <select className={SELECT_CLS} value={opinion.schoolTrip} onChange={(e) => updateOpinion("schoolTrip", e.target.value)}>
                <option value="">선택</option>
                <option value="참여">참여 희망</option>
                <option value="불참">불참</option>
                <option value="해당없음">해당 학년 아님</option>
              </select>
            </div>
            {opinion.schoolTrip === "불참" && (
              <div className="space-y-2">
                <Label>불참 사유</Label>
                <Input placeholder="예: 외박이 어렵습니다" value={opinion.schoolTripReason} onChange={(e) => updateOpinion("schoolTripReason", e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>공개수업 참관 의향</Label>
              <select className={SELECT_CLS} value={opinion.openClassObservation} onChange={(e) => updateOpinion("openClassObservation", e.target.value)}>
                <option value="">선택</option>
                <option value="참관 희망">참관 희망</option>
                <option value="참관 불필요">참관 불필요</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>현장체험학습 참여 의향</Label>
              <select className={SELECT_CLS} value={opinion.fieldTrip} onChange={(e) => updateOpinion("fieldTrip", e.target.value)}>
                <option value="">선택</option>
                <option value="참여 희망">참여 희망</option>
                <option value="개별 상담 후 결정">개별 상담 후 결정</option>
                <option value="불참">불참</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── 진로 및 장기 비전 ───── */}
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

      {/* ───── 기타 사항 ───── */}
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
