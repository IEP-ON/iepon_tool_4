"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import { CheckboxGroup } from "./CheckboxGroup";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

export function Step3Education({ opinion, updateOpinion }: Props) {
  const addTherapySupport = () => {
    const current = opinion.therapySupportList || [];
    updateOpinion("therapySupportList", [...current, { institution: "", days: "", area: "" }]);
  };

  const updateTherapySupport = (index: number, field: string, value: string) => {
    const current = [...(opinion.therapySupportList || [])];
    current[index] = { ...current[index], [field]: value };
    updateOpinion("therapySupportList", current);
  };

  const removeTherapySupport = (index: number) => {
    const current = [...(opinion.therapySupportList || [])];
    current.splice(index, 1);
    updateOpinion("therapySupportList", current);
  };

  const addRehabService = () => {
    const current = opinion.rehabServiceList || [];
    updateOpinion("rehabServiceList", [...current, { institution: "", days: "", area: "" }]);
  };

  const updateRehabService = (index: number, field: string, value: string) => {
    const current = [...(opinion.rehabServiceList || [])];
    current[index] = { ...current[index], [field]: value };
    updateOpinion("rehabServiceList", current);
  };

  const removeRehabService = (index: number) => {
    const current = [...(opinion.rehabServiceList || [])];
    current.splice(index, 1);
    updateOpinion("rehabServiceList", current);
  };

  const handleExclusiveCheckbox = (key: keyof ParentOpinion, values: string[], exclusiveValue: string) => {
    const current = opinion[key] as string[] || [];
    let newValues = [...values];
    if (!current.includes(exclusiveValue) && values.includes(exclusiveValue)) {
      newValues = [exclusiveValue];
    } else if (current.includes(exclusiveValue) && values.length > 1) {
      newValues = values.filter((v) => v !== exclusiveValue);
    }
    updateOpinion(key, newValues);
  };

  return (
    <div className="space-y-6">
      {/* 1. 현재 수준 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">가정에서 바라본 현재 수준</CardTitle>
          <CardDescription>가정에서 관찰되는 아이의 현재 모습을 편하게 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "levelLearning" as const, label: "학습", hint: "읽기·쓰기·수 개념 등" },
            { key: "levelCommunication" as const, label: "의사소통", hint: "표현 방법, 지시 이해 수준" },
            { key: "levelSocial" as const, label: "사회성·정서", hint: "또래·어른과의 관계, 감정 표현·조절" },
            { key: "levelSelfCare" as const, label: "자조기술", hint: "식사·용변·옷입기·손씻기" },
            { key: "levelMotor" as const, label: "운동", hint: "걷기·달리기·가위질·쓰기 등" },
            { key: "levelBehavior" as const, label: "행동 특성", hint: "어려움을 주는 행동이 있다면" },
          ].map(({ key, label, hint }) => (
            <div key={key} className="space-y-2">
              <Label>
                {label} <span className="text-xs text-gray-400 font-normal">({hint})</span>
              </Label>
              <Textarea
                placeholder="자유롭게 적어주세요"
                value={opinion[key] as string}
                onChange={(e) => updateOpinion(key, e.target.value)}
                rows={2}
                className={`transition-colors ${opinion[key] ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. 교육 목표 및 지원 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">교육 목표 및 지원 요구사항</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-bold">가장 우선적으로 지도받고 싶은 목표나 영역</Label>
            <Textarea
              value={opinion.priorityGoal}
              onChange={(e) => updateOpinion("priorityGoal", e.target.value)}
              className={`transition-colors ${opinion.priorityGoal ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold">선호하는 교육 방법</Label>
            <Textarea
              placeholder="예: 그림 자료, 반복 연습, 놀이 중심, 실물 교구 등"
              value={opinion.preferredMethod}
              onChange={(e) => updateOpinion("preferredMethod", e.target.value)}
              rows={2}
              className={`transition-colors ${opinion.preferredMethod ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold">가정에서 함께 연계하고 싶은 내용</Label>
            <Textarea
              value={opinion.homeConnection}
              onChange={(e) => updateOpinion("homeConnection", e.target.value)}
              rows={2}
              className={`transition-colors ${opinion.homeConnection ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. 방과후/치료지원/통학/보조인력 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">학교 특수교육 관련 서비스</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <Label className="text-base font-bold">1. 방과후학교 (특수교육대상자)</Label>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.afterSchoolSpecialEd ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["교내 방과후학교 (자유수강권)", "교외 방과후학교 (전자카드)", "미이용"]}
                value={opinion.afterSchoolSpecialEd}
                onChange={(v) => {
                  updateOpinion("afterSchoolSpecialEd", v);
                  if (v !== "교내 방과후학교 (자유수강권)") updateOpinion("afterSchoolSpecialEdInSchool", "");
                  if (v !== "교외 방과후학교 (전자카드)") updateOpinion("afterSchoolSpecialEdOutSchool", "");
                }}
                columns={1}
              />
            </div>
            {opinion.afterSchoolSpecialEd === "교내 방과후학교 (자유수강권)" && (
              <Input placeholder="수강 희망 프로그램 (예: 미술, 체육 등)" value={opinion.afterSchoolSpecialEdInSchool} onChange={(e) => updateOpinion("afterSchoolSpecialEdInSchool", e.target.value)} className="mt-2 bg-white" />
            )}
            {opinion.afterSchoolSpecialEd === "교외 방과후학교 (전자카드)" && (
              <Input placeholder="이용 기관 및 프로그램명" value={opinion.afterSchoolSpecialEdOutSchool} onChange={(e) => updateOpinion("afterSchoolSpecialEdOutSchool", e.target.value)} className="mt-2 bg-white" />
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-bold">2. 치료지원 (교육청)</Label>
            <div className="text-sm text-gray-600 -mt-2 mb-2">※ 교육청에서 발급된 전자카드로 이용하는 치료지원 서비스</div>
            <div className="space-y-3">
              {(opinion.therapySupportList || []).map((t, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 relative pr-10 sm:pr-3">
                  <div className="flex-1">
                    <Input placeholder="기관명" value={t.institution} onChange={(e) => updateTherapySupport(i, "institution", e.target.value)} className="bg-white" />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="요일 (예: 화, 목)" value={t.days} onChange={(e) => updateTherapySupport(i, "days", e.target.value)} className="bg-white" />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="영역 (예: 언어치료)" value={t.area} onChange={(e) => updateTherapySupport(i, "area", e.target.value)} className="bg-white" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTherapySupport(i)} className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addTherapySupport} className="w-full text-blue-600 border-dashed">
                <Plus className="w-4 h-4 mr-1" /> 치료지원 기관 추가
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-bold">3. 발달재활서비스 (보건복지부, 바우처)</Label>
            <div className="space-y-3">
              {(opinion.rehabServiceList || []).map((t, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 relative pr-10 sm:pr-3">
                  <div className="flex-1">
                    <Input placeholder="기관명" value={t.institution} onChange={(e) => updateRehabService(i, "institution", e.target.value)} className="bg-white" />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="요일" value={t.days} onChange={(e) => updateRehabService(i, "days", e.target.value)} className="bg-white" />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="영역" value={t.area} onChange={(e) => updateRehabService(i, "area", e.target.value)} className="bg-white" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRehabService(i)} className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRehabService} className="w-full text-blue-600 border-dashed">
                <Plus className="w-4 h-4 mr-1" /> 발달재활서비스 기관 추가
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-bold">4. 통학비(교통비) 지원</Label>
            <RadioOption
              options={["통학비 지원 신청", "해당 없음"]}
              value={opinion.transportSupport}
              onChange={(v) => updateOpinion("transportSupport", v)}
              columns={2}
            />
            {opinion.transportSupport === "통학비 지원 신청" && (
              <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded">💡 통학비 지원 신청을 선택하셨습니다. 추후 학교에서 관련 신청 서류를 별도로 안내해 드릴 예정입니다.</p>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-bold block mb-1">5. 특수교육보조인력 (실무사, 사회복무요원 등) 지원</Label>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-3">
              ⚠️ <b>안내:</b> 보조인력 지원을 신청하시더라도 학교의 인력 배치 상황 및 우선순위에 따라 무조건 반영되기는 어려울 수 있음을 양해 부탁드립니다.
            </div>
            <RadioOption
              options={["필요 없음", "학교 내 생활 전반 지원", "특정 시간/활동 지원"]}
              value={opinion.assistantSupport}
              onChange={(v) => {
                updateOpinion("assistantSupport", v);
                if (v === "필요 없음") updateOpinion("assistantSupportDetail", "");
              }}
              columns={1}
            />
            {opinion.assistantSupport && opinion.assistantSupport !== "필요 없음" && (
              <Textarea
                placeholder="예: 급식 시간 보조, 체육 시간 동선 지원 등"
                value={opinion.assistantSupportDetail}
                onChange={(e) => updateOpinion("assistantSupportDetail", e.target.value)}
                rows={2}
                className="mt-2 bg-white"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. 진로 및 장기적 비전 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">진로 및 장기적 비전 (선택)</CardTitle>
          <CardDescription>아이의 미래에 대한 기대를 공유해 주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-bold">졸업 후 진로 방향 (희망)</Label>
            <RadioOption
              options={["일반 직업", "복지관 연계 취업", "주간보호 이용", "자립생활", "기타"]}
              value={opinion.careerDirection}
              onChange={(v) => {
                updateOpinion("careerDirection", v);
                if (v !== "기타") updateOpinion("careerDirectionOther", "");
              }}
              columns={2}
            />
            {opinion.careerDirection === "기타" && (
              <Input
                placeholder="기타 진로 방향을 적어주세요"
                value={opinion.careerDirectionOther}
                onChange={(e) => updateOpinion("careerDirectionOther", e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold">5년 후 아이의 모습에 대한 기대</Label>
            <Textarea
              placeholder="예: 대중교통을 이용할 수 있으면 좋겠어요. 좋아하는 일을 하며 살았으면 해요."
              value={opinion.fiveYearVision}
              onChange={(e) => updateOpinion("fiveYearVision", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold">교육에서 가장 중요하게 생각하는 가치</Label>
            <Textarea
              placeholder="예: 자립심, 사회성, 행복감, 안전, 의사소통 능력 등"
              value={opinion.educationValue}
              onChange={(e) => updateOpinion("educationValue", e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-base font-bold">담임 선생님께 전하고 싶은 말</Label>
            <Textarea
              placeholder="학교에 바라는 점, 기타 하고 싶은 내용을 자유롭게 적어주세요."
              value={opinion.messageToTeacher}
              onChange={(e) => updateOpinion("messageToTeacher", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

