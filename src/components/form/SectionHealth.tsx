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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">③ 건강·의료 정보</h2>

      {/* 복약 */}
      <div>
        <Label>복약 여부</Label>
        <RadioOption
          options={["없음", "있음"]}
          value={data.hasMedication}
          onChange={(v) => update("hasMedication", v)}
        />
        {data.hasMedication === "있음" && (
          <div className="mt-3 space-y-3">
            {data.medications.map((med, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <Label className="text-xs">약물명</Label>
                  <Input
                    value={med.name}
                    onChange={(e) => updateMedication(i, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">용량</Label>
                  <Input
                    value={med.dosage}
                    onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">투약 시간</Label>
                  <Input
                    value={med.time}
                    onChange={(e) => updateMedication(i, "time", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addMedication}>
              <Plus className="h-4 w-4 mr-1" /> 약물 추가
            </Button>

            <div>
              <Label>학교 내 투약 지원 필요 여부</Label>
              <RadioOption
                options={["없음", "있음"]}
                value={data.schoolMedicationSupport}
                onChange={(v) => update("schoolMedicationSupport", v)}
              />
              {data.schoolMedicationSupport === "있음" && (
                <p className="text-xs text-blue-600 mt-1">
                  해당 시 보건교사와 별도 협의 예정
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 알레르기 */}
      <div>
        <Label>알레르기</Label>
        <CheckboxGroup
          options={["없음", "식품", "약물", "환경"]}
          selected={data.allergies}
          onChange={(v) => update("allergies", v)}
        />
        {data.allergies.includes("식품") && (
          <Input
            className="mt-2"
            placeholder="식품 알레르기 상세"
            value={data.allergyFoodDetail}
            onChange={(e) => update("allergyFoodDetail", e.target.value)}
          />
        )}
        {data.allergies.includes("약물") && (
          <Input
            className="mt-2"
            placeholder="약물 알레르기 상세"
            value={data.allergyDrugDetail}
            onChange={(e) => update("allergyDrugDetail", e.target.value)}
          />
        )}
        {data.allergies.includes("환경") && (
          <Input
            className="mt-2"
            placeholder="환경 알레르기 상세"
            value={data.allergyEnvDetail}
            onChange={(e) => update("allergyEnvDetail", e.target.value)}
          />
        )}
      </div>

      {/* 발작·경련 */}
      <div>
        <Label>발작·경련 이력</Label>
        <RadioOption
          options={["없음", "있음"]}
          value={data.hasSeizure}
          onChange={(v) => update("hasSeizure", v)}
        />
        {data.hasSeizure === "있음" && (
          <div className="mt-2 space-y-2">
            <Input
              placeholder="최근 발생 시기"
              value={data.seizureRecent}
              onChange={(e) => update("seizureRecent", e.target.value)}
            />
            <Textarea
              placeholder="학교 대응 지침 및 요청사항"
              value={data.seizureInstruction}
              onChange={(e) => update("seizureInstruction", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 식이 제한 */}
      <div>
        <Label>식이 제한</Label>
        <CheckboxGroup
          options={["없음", "질환으로 인한 제한", "종교·문화적 이유"]}
          selected={data.dietaryRestriction}
          onChange={(v) => update("dietaryRestriction", v)}
          columns={1}
        />
        {data.dietaryRestriction.includes("질환으로 인한 제한") && (
          <Input
            className="mt-2"
            placeholder="구체적 내용"
            value={data.dietaryDiseaseDetail}
            onChange={(e) => update("dietaryDiseaseDetail", e.target.value)}
          />
        )}
        {data.dietaryRestriction.includes("종교·문화적 이유") && (
          <Input
            className="mt-2"
            placeholder="구체적 내용"
            value={data.dietaryCultureDetail}
            onChange={(e) => update("dietaryCultureDetail", e.target.value)}
          />
        )}
      </div>

      {/* 수면 */}
      <div>
        <Label>수면 특성</Label>
        <CheckboxGroup
          options={["특이사항 없음", "입면 어려움", "수면 중 자주 깸", "수면시간 부족"]}
          selected={data.sleepCharacteristics}
          onChange={(v) => update("sleepCharacteristics", v)}
        />
      </div>

      {/* 감각 민감성 */}
      <div>
        <Label>감각 민감성 (복수 선택 가능)</Label>
        <CheckboxGroup
          options={["없음", "소리", "빛", "촉각", "후각", "기타"]}
          selected={data.sensoryIssues}
          onChange={(v) => update("sensoryIssues", v)}
          columns={3}
        />
        {data.sensoryIssues.includes("기타") && (
          <Input
            className="mt-2"
            placeholder="기타 감각 민감성"
            value={data.sensoryOther}
            onChange={(e) => update("sensoryOther", e.target.value)}
          />
        )}
      </div>

      {/* ④ 보조기기 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">④ 보조기기 및 환경 수정</h2>

      <div>
        <Label>사용 중인 보조공학기기</Label>
        <CheckboxGroup
          options={["없음", "AAC", "청각보조기", "시각보조기", "기타"]}
          selected={data.assistiveTech}
          onChange={(v) => update("assistiveTech", v)}
          columns={3}
        />
        {data.assistiveTech.includes("기타") && (
          <Input
            className="mt-2"
            placeholder="기타 보조공학기기"
            value={data.assistiveTechOther}
            onChange={(e) => update("assistiveTechOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>착용 중인 보조기구</Label>
        <CheckboxGroup
          options={["없음", "보조기", "휠체어", "보행보조기", "기타"]}
          selected={data.assistiveDevice}
          onChange={(v) => update("assistiveDevice", v)}
          columns={3}
        />
        {data.assistiveDevice.includes("기타") && (
          <Input
            className="mt-2"
            placeholder="기타 보조기구"
            value={data.assistiveDeviceOther}
            onChange={(e) => update("assistiveDeviceOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>학교 환경 수정 요청</Label>
        <CheckboxGroup
          options={["없음", "좌석 배치", "조명 조절", "이동 동선", "기타"]}
          selected={data.envModification}
          onChange={(v) => update("envModification", v)}
          columns={3}
        />
        {data.envModification.includes("기타") && (
          <Input
            className="mt-2"
            placeholder="기타 환경 수정"
            value={data.envModificationOther}
            onChange={(e) => update("envModificationOther", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
