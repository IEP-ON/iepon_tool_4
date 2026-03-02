"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { RadioOption } from "./RadioOption";
import { CheckboxGroup } from "./CheckboxGroup";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

export function Step2Health({ opinion, updateOpinion }: Props) {
  const handleExclusiveCheckbox = (key: keyof ParentOpinion, values: string[], exclusiveValue: string) => {
    const current = opinion[key] as string[];
    let newValues = [...values];

    // 방금 '없음'을 선택한 경우
    if (!current.includes(exclusiveValue) && values.includes(exclusiveValue)) {
      newValues = [exclusiveValue];
    }
    // 다른 항목을 선택했는데 '없음'이 있는 경우
    else if (current.includes(exclusiveValue) && values.length > 1) {
      newValues = values.filter((v) => v !== exclusiveValue);
    }
    
    updateOpinion(key, newValues);
  };

  const addMedication = () => {
    const current = opinion.medications || [];
    updateOpinion("medications", [...current, { name: "", dosage: "", time: "" }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const current = [...(opinion.medications || [])];
    current[index] = { ...current[index], [field]: value };
    updateOpinion("medications", current);
  };

  const removeMedication = (index: number) => {
    const current = [...(opinion.medications || [])];
    current.splice(index, 1);
    updateOpinion("medications", current);
  };

  return (
    <div className="space-y-6">
      {/* 1. 건강/의료 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">건강 및 의료 특이사항</CardTitle>
          <CardDescription>학교 생활 중 특별한 주의가 필요한 건강 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* 복약 */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">1. 정기 복약</h3>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.hasMedication ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["있음", "없음"]}
                value={opinion.hasMedication}
                onChange={(v) => {
                  updateOpinion("hasMedication", v);
                  if (v === "없음") {
                    updateOpinion("medications", []);
                    updateOpinion("schoolMedicationSupport", "");
                  } else if (opinion.medications.length === 0) {
                    addMedication();
                  }
                }}
                columns={2}
              />
            </div>
            {opinion.hasMedication === "있음" && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <Label className="text-sm font-bold text-gray-700">복약 정보</Label>
                <div className="space-y-3">
                  {(opinion.medications || []).map((med, idx) => (
                    <div key={idx} className="flex gap-2 items-start relative pb-2 sm:pb-0 border-b sm:border-0 border-gray-200">
                      <div className="flex-1 grid sm:grid-cols-3 gap-2">
                        <Input
                          placeholder="약물명 (예: 콘서타)"
                          value={med.name}
                          onChange={(e) => updateMedication(idx, "name", e.target.value)}
                          className="h-10 bg-white"
                        />
                        <Input
                          placeholder="복용량 (예: 1알)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(idx, "dosage", e.target.value)}
                          className="h-10 bg-white"
                        />
                        <Input
                          placeholder="시간 (예: 아침 식후)"
                          value={med.time}
                          onChange={(e) => updateMedication(idx, "time", e.target.value)}
                          className="h-10 bg-white"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedication(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 sm:relative absolute right-0 top-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addMedication} className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 border-dashed border-2">
                    <Plus className="h-4 w-4 mr-1" /> 약물 추가
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-sm font-bold text-gray-700">교내 투약 지원 여부</Label>
                  <RadioOption
                    options={["필요함", "필요없음(스스로 가능/가정에서만)"]}
                    value={opinion.schoolMedicationSupport}
                    onChange={(v) => updateOpinion("schoolMedicationSupport", v)}
                    columns={2}
                  />
                  {opinion.schoolMedicationSupport === "필요함" && (
                    <p className="text-xs text-blue-600 mt-1 pl-1">※ 교내 투약이 필요한 경우, 추후 '투약 의뢰서'를 별도로 제출해 주셔야 합니다.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 알레르기 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="font-bold text-gray-900 border-b pb-2">2. 알레르기 (복수 선택)</h3>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.allergies.length > 0 ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <CheckboxGroup
                options={["없음", "식품", "약물", "환경", "기타"]}
                selected={opinion.allergies}
                onChange={(v) => handleExclusiveCheckbox("allergies", v, "없음")}
                columns={3}
              />
            </div>
            
            <div className="space-y-3 pl-1">
              {opinion.allergies.includes("식품") && (
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">식품 알레르기 상세</Label>
                  <Input placeholder="예: 땅콩, 갑각류, 우유 등 (급식 관련)" value={opinion.allergyFoodDetail} onChange={(e) => updateOpinion("allergyFoodDetail", e.target.value)} />
                </div>
              )}
              {opinion.allergies.includes("약물") && (
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">약물 알레르기 상세</Label>
                  <Input placeholder="예: 페니실린 등" value={opinion.allergyDrugDetail} onChange={(e) => updateOpinion("allergyDrugDetail", e.target.value)} />
                </div>
              )}
              {(opinion.allergies.includes("환경") || opinion.allergies.includes("기타")) && (
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">환경/기타 알레르기 상세</Label>
                  <Input placeholder="예: 꽃가루, 동물 털 등" value={opinion.allergyEnvDetail} onChange={(e) => updateOpinion("allergyEnvDetail", e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {/* 발작/경련 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="font-bold text-gray-900 border-b pb-2">3. 발작(경련) 이력</h3>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.hasSeizure ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["있음", "없음"]}
                value={opinion.hasSeizure}
                onChange={(v) => updateOpinion("hasSeizure", v)}
                columns={2}
              />
            </div>
            {opinion.hasSeizure === "있음" && (
              <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">최근 발생 시기 및 빈도</Label>
                  <Input placeholder="예: 1년 전 마지막, 한 달에 1번 등" value={opinion.seizureRecent} onChange={(e) => updateOpinion("seizureRecent", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">학교에서 발생 시 대처 요령</Label>
                  <Input placeholder="예: 5분 이상 지속 시 119 신고 등" value={opinion.seizureInstruction} onChange={(e) => updateOpinion("seizureInstruction", e.target.value)} className="bg-white" />
                </div>
              </div>
            )}
          </div>

          {/* 식이/수면/감각 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="font-bold text-gray-900 border-b pb-2">4. 기타 건강 및 신체적 특성</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <Label className="text-base font-bold text-gray-900 block">식이 제한 (복수 선택)</Label>
              <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.dietaryRestriction.length > 0 ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                <CheckboxGroup
                  options={["제한 없음", "질병/체질", "종교/문화", "기타 편식"]}
                  selected={opinion.dietaryRestriction}
                  onChange={(v) => handleExclusiveCheckbox("dietaryRestriction", v, "제한 없음")}
                  columns={2}
                />
              </div>
              {opinion.dietaryRestriction.includes("질병/체질") && (
                <Input placeholder="질병/체질에 의한 식이 제한 (예: 당뇨식, 연하곤란 유동식 등)" value={opinion.dietaryDiseaseDetail} onChange={(e) => updateOpinion("dietaryDiseaseDetail", e.target.value)} className="bg-white" />
              )}
              {opinion.dietaryRestriction.includes("종교/문화") && (
                <Input placeholder="종교/문화적 식이 제한 (예: 할랄, 돼지고기 금지 등)" value={opinion.dietaryCultureDetail} onChange={(e) => updateOpinion("dietaryCultureDetail", e.target.value)} className="bg-white" />
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <Label className="text-base font-bold text-gray-900 block">수면 특성 (복수 선택)</Label>
              <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.sleepCharacteristics.length > 0 ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                <CheckboxGroup
                  options={["특이사항 없음", "입면 어려움", "수면 중 자주 깸", "수면시간 부족"]}
                  selected={opinion.sleepCharacteristics}
                  onChange={(v) => handleExclusiveCheckbox("sleepCharacteristics", v, "특이사항 없음")}
                  columns={2}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <Label className="text-base font-bold text-gray-900 block">감각 민감성 (복수 선택)</Label>
              <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.sensoryIssues.length > 0 ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                <CheckboxGroup
                  options={["없음", "소리", "빛", "촉각", "후각", "기타"]}
                  selected={opinion.sensoryIssues}
                  onChange={(v) => handleExclusiveCheckbox("sensoryIssues", v, "없음")}
                  columns={3}
                />
              </div>
              {opinion.sensoryIssues.includes("기타") && !opinion.sensoryIssues.includes("없음") && (
                <Input placeholder="기타 감각 민감성 (어떤 부분에 예민한지 적어주세요)" value={opinion.sensoryOther} onChange={(e) => updateOpinion("sensoryOther", e.target.value)} className="bg-white" />
              )}
            </div>
          </div>
          
          {/* 최근 건강 변동 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="font-bold text-gray-900 border-b pb-2">5. 최근 건강/복약 변동사항</h3>
            <Textarea
              placeholder="예: 최근 약 변경, 수술 예정, 새로운 진단 등 학교에서 알아야 할 변화가 있다면 적어주세요."
              value={opinion.healthChanges}
              onChange={(e) => updateOpinion("healthChanges", e.target.value)}
              rows={3}
              className={`transition-colors ${opinion.healthChanges ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. 보조기기 및 환경 수정 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">보조기기 및 환경 수정</CardTitle>
          <CardDescription>학습에 필요한 보조 기기와 환경 지원을 선택해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <Label className="text-base font-bold text-gray-900 block">사용 중인 보조공학기기</Label>
            <CheckboxGroup
              options={["해당 없음", "AAC(보완대체의사소통)", "청각보조기", "시각보조기", "기타"]}
              selected={opinion.assistiveTech.includes("없음") ? ["해당 없음"] : opinion.assistiveTech}
              onChange={(v) => {
                const mapped = v.map(item => item === "해당 없음" ? "없음" : item);
                handleExclusiveCheckbox("assistiveTech", mapped, "없음");
              }}
              columns={2}
            />
            {opinion.assistiveTech.includes("기타") && !opinion.assistiveTech.includes("없음") && (
              <Input placeholder="구체적인 기기명" value={opinion.assistiveTechOther} onChange={(e) => updateOpinion("assistiveTechOther", e.target.value)} className="bg-white" />
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <Label className="text-base font-bold text-gray-900 block">착용 중인 보조기구 (물리적)</Label>
            <CheckboxGroup
              options={["해당 없음", "하지보조기", "상지보조기", "휠체어", "보행보조기", "기타"]}
              selected={opinion.assistiveDevice.includes("없음") ? ["해당 없음"] : opinion.assistiveDevice}
              onChange={(v) => {
                const mapped = v.map(item => item === "해당 없음" ? "없음" : item);
                handleExclusiveCheckbox("assistiveDevice", mapped, "없음");
              }}
              columns={2}
            />
            {opinion.assistiveDevice.includes("기타") && !opinion.assistiveDevice.includes("없음") && (
              <Input placeholder="구체적인 기구명" value={opinion.assistiveDeviceOther} onChange={(e) => updateOpinion("assistiveDeviceOther", e.target.value)} className="bg-white" />
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <Label className="text-base font-bold text-gray-900 block">학교 환경 수정 요청 (복수 선택)</Label>
            <p className="text-sm text-gray-600 mb-3 -mt-2">학급 내에서 아이가 학습하기 위해 특별히 조정되어야 할 환경이 있다면 선택해 주세요.</p>
            <CheckboxGroup
              options={["필요 없음", "좌석 배치 (앞자리 등)", "조명 조절", "이동 동선 확보", "기타"]}
              selected={opinion.envModification.includes("없음") ? ["필요 없음"] : opinion.envModification}
              onChange={(v) => {
                const mapped = v.map(item => item === "필요 없음" ? "없음" : item);
                handleExclusiveCheckbox("envModification", mapped, "없음");
              }}
              columns={2}
            />
            {opinion.envModification.includes("기타") && !opinion.envModification.includes("없음") && (
              <Input placeholder="구체적인 요청 사항을 적어주세요." value={opinion.envModificationOther} onChange={(e) => updateOpinion("envModificationOther", e.target.value)} className="bg-white" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
