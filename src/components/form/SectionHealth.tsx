"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import { CheckboxGroup } from "./CheckboxGroup";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
}

export function SectionHealth({ data, update }: Props) {
  const addMedication = () => {
    update("medications", [...data.medications, { name: "", dosage: "", time: "" }]);
  };

  const removeMedication = (index: number) => {
    update("medications", data.medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = data.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    update("medications", updated);
  };

  const handleExclusiveCheckbox = (key: keyof ParentOpinion, newValue: string[], exclusiveValue: string) => {
    const oldValue = data[key] as string[];
    const justAddedExclusive = newValue.includes(exclusiveValue) && !oldValue.includes(exclusiveValue);
    
    if (justAddedExclusive) {
      update(key, [exclusiveValue]);
    } else if (oldValue.includes(exclusiveValue) && newValue.length > 1) {
      update(key, newValue.filter(v => v !== exclusiveValue));
    } else {
      update(key, newValue);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2">③ 건강·의료 정보</h2>

        {/* 복약 */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Label className="text-base font-bold text-gray-900 mb-3 block">정기적인 복약 여부</Label>
          <RadioOption
            options={["없음", "있음"]}
            value={data.hasMedication}
            onChange={(v) => {
              update("hasMedication", v);
              if (v === "없음") {
                update("medications", []);
                update("schoolMedicationSupport", "없음");
              } else if (data.medications.length === 0) {
                update("medications", [{ name: "", dosage: "", time: "" }]);
              }
            }}
          />
          {data.hasMedication === "있음" && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm space-y-4">
              {data.medications.map((med, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">약물명</Label>
                    <Input
                      placeholder="예: 000정"
                      value={med.name}
                      onChange={(e) => updateMedication(i, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">용량</Label>
                    <Input
                      placeholder="예: 1알"
                      value={med.dosage}
                      onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">투약 시간</Label>
                    <Input
                      placeholder="예: 점심 식후"
                      value={med.time}
                      onChange={(e) => updateMedication(i, "time", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeMedication(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMedication} className="w-full border-dashed text-blue-600 border-blue-300 bg-blue-50/50 hover:bg-blue-100">
                <Plus className="h-4 w-4 mr-1" /> 약물 추가하기
              </Button>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <Label className="font-medium text-gray-700 mb-2 block">학교 내 투약 지원 필요 여부</Label>
                <RadioOption
                  options={["없음", "있음"]}
                  value={data.schoolMedicationSupport}
                  onChange={(v) => update("schoolMedicationSupport", v)}
                />
                {data.schoolMedicationSupport === "있음" && (
                  <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                    💡 해당 시 담임 및 보건교사와 별도의 투약 의뢰 절차를 거치게 됩니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 발작·경련 */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Label className="text-base font-bold text-gray-900 mb-3 block">발작·경련 이력</Label>
          <RadioOption
            options={["해당 없음", "있음"]}
            value={data.hasSeizure === "없음" ? "해당 없음" : data.hasSeizure}
            onChange={(v) => {
              const val = v === "해당 없음" ? "없음" : v;
              update("hasSeizure", val);
              if (val === "없음") {
                update("seizureRecent", "");
                update("seizureInstruction", "");
              }
            }}
          />
          {data.hasSeizure === "있음" && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-orange-100 shadow-sm space-y-4">
              <div>
                <Label className="text-xs text-gray-500">최근 발생 시기</Label>
                <Input
                  placeholder="예: 2025년 10월경"
                  value={data.seizureRecent}
                  onChange={(e) => update("seizureRecent", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">발생 시 학교 대응 지침 (구체적으로)</Label>
                <Textarea
                  placeholder="예: 발작이 시작되면 고개를 옆으로 돌려주시고 5분 이상 지속되면 119에 신고해주세요."
                  value={data.seizureInstruction}
                  onChange={(e) => update("seizureInstruction", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 알레르기 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">알레르기 (복수 선택)</Label>
            <CheckboxGroup
              options={["없음", "식품", "약물", "환경"]}
              selected={data.allergies}
              onChange={(v) => handleExclusiveCheckbox("allergies", v, "없음")}
              columns={2}
            />
            {!data.allergies.includes("없음") && data.allergies.length > 0 && (
              <div className="mt-3 space-y-2">
                {data.allergies.includes("식품") && (
                  <Input placeholder="식품 알레르기 원인 (예: 땅콩, 갑각류)" value={data.allergyFoodDetail} onChange={(e) => update("allergyFoodDetail", e.target.value)} className="bg-white" />
                )}
                {data.allergies.includes("약물") && (
                  <Input placeholder="약물 알레르기 원인 (예: 페니실린)" value={data.allergyDrugDetail} onChange={(e) => update("allergyDrugDetail", e.target.value)} className="bg-white" />
                )}
                {data.allergies.includes("환경") && (
                  <Input placeholder="환경 알레르기 원인 (예: 꽃가루, 먼지)" value={data.allergyEnvDetail} onChange={(e) => update("allergyEnvDetail", e.target.value)} className="bg-white" />
                )}
              </div>
            )}
          </div>

          {/* 식이 제한 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">식이 제한 (복수 선택)</Label>
            <CheckboxGroup
              options={["해당 없음", "질환으로 인한 제한", "종교·문화적 이유"]}
              selected={data.dietaryRestriction.includes("없음") ? ["해당 없음"] : data.dietaryRestriction}
              onChange={(v) => {
                const mapped = v.map(item => item === "해당 없음" ? "없음" : item);
                handleExclusiveCheckbox("dietaryRestriction", mapped, "없음");
              }}
              columns={1}
            />
            {!data.dietaryRestriction.includes("없음") && data.dietaryRestriction.length > 0 && (
              <div className="mt-3 space-y-2">
                {data.dietaryRestriction.includes("질환으로 인한 제한") && (
                  <Input placeholder="구체적 질환 및 제한 식품" value={data.dietaryDiseaseDetail} onChange={(e) => update("dietaryDiseaseDetail", e.target.value)} className="bg-white" />
                )}
                {data.dietaryRestriction.includes("종교·문화적 이유") && (
                  <Input placeholder="구체적 내용 (예: 할랄 식품만 가능)" value={data.dietaryCultureDetail} onChange={(e) => update("dietaryCultureDetail", e.target.value)} className="bg-white" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 수면 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">수면 특성 (복수 선택)</Label>
            <CheckboxGroup
              options={["특이사항 없음", "입면 어려움", "수면 중 자주 깸", "수면시간 부족"]}
              selected={data.sleepCharacteristics}
              onChange={(v) => handleExclusiveCheckbox("sleepCharacteristics", v, "특이사항 없음")}
              columns={2}
            />
          </div>

          {/* 감각 민감성 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">감각 민감성 (복수 선택)</Label>
            <CheckboxGroup
              options={["없음", "소리", "빛", "촉각", "후각", "기타"]}
              selected={data.sensoryIssues}
              onChange={(v) => handleExclusiveCheckbox("sensoryIssues", v, "없음")}
              columns={3}
            />
            {data.sensoryIssues.includes("기타") && !data.sensoryIssues.includes("없음") && (
              <Input
                className="mt-3 bg-white"
                placeholder="기타 감각 민감성 (어떤 부분에 예민한지 적어주세요)"
                value={data.sensoryOther}
                onChange={(e) => update("sensoryOther", e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2">④ 보조기기 및 환경 수정</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 보조공학기기 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">사용 중인 보조공학기기</Label>
            <CheckboxGroup
              options={["해당 없음", "AAC(보완대체의사소통)", "청각보조기", "시각보조기", "기타"]}
              selected={data.assistiveTech.includes("없음") ? ["해당 없음"] : data.assistiveTech}
              onChange={(v) => {
                const mapped = v.map(item => item === "해당 없음" ? "없음" : item);
                handleExclusiveCheckbox("assistiveTech", mapped, "없음");
              }}
              columns={2}
            />
            {data.assistiveTech.includes("기타") && !data.assistiveTech.includes("없음") && (
              <Input
                className="mt-3 bg-white"
                placeholder="구체적인 기기명"
                value={data.assistiveTechOther}
                onChange={(e) => update("assistiveTechOther", e.target.value)}
              />
            )}
          </div>

          {/* 보조기구 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="text-base font-bold text-gray-900 mb-3 block">착용 중인 보조기구 (물리적)</Label>
            <CheckboxGroup
              options={["해당 없음", "하지보조기", "상지보조기", "휠체어", "보행보조기", "기타"]}
              selected={data.assistiveDevice.includes("없음") ? ["해당 없음"] : data.assistiveDevice}
              onChange={(v) => {
                const mapped = v.map(item => item === "해당 없음" ? "없음" : item);
                handleExclusiveCheckbox("assistiveDevice", mapped, "없음");
              }}
              columns={2}
            />
            {data.assistiveDevice.includes("기타") && !data.assistiveDevice.includes("없음") && (
              <Input
                className="mt-3 bg-white"
                placeholder="구체적인 기구명"
                value={data.assistiveDeviceOther}
                onChange={(e) => update("assistiveDeviceOther", e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 환경 수정 */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Label className="text-base font-bold text-gray-900 mb-3 block">학교 환경 수정 요청 (복수 선택)</Label>
          <p className="text-sm text-gray-600 mb-3 -mt-2">학급 내에서 아이가 학습하기 위해 특별히 조정되어야 할 환경이 있다면 선택해 주세요.</p>
          <CheckboxGroup
            options={["필요 없음", "좌석 배치 (앞자리 등)", "조명 조절", "이동 동선 확보", "기타"]}
            selected={data.envModification.includes("없음") ? ["필요 없음"] : data.envModification}
            onChange={(v) => {
              const mapped = v.map(item => item === "필요 없음" ? "없음" : item);
              handleExclusiveCheckbox("envModification", mapped, "없음");
            }}
            columns={2}
          />
          {data.envModification.includes("기타") && !data.envModification.includes("없음") && (
            <Input
              className="mt-3 bg-white"
              placeholder="구체적인 요청 사항을 적어주세요."
              value={data.envModificationOther}
              onChange={(e) => update("envModificationOther", e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
