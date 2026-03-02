"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

const SELECT_CLS = "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";
const TEXTAREA_CLS = "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none";

export function Step2Health({ opinion, updateOpinion }: Props) {
  const handleArrayToggle = (key: keyof ParentOpinion, value: string) => {
    const current = (opinion[key] as string[]) || [];
    if (current.includes(value)) {
      updateOpinion(key, current.filter((v: string) => v !== value));
    } else {
      updateOpinion(key, [...current, value]);
    }
  };

  const addMedication = () => {
    updateOpinion("medications", [...(opinion.medications || []), { name: "", dosage: "", time: "" }]);
  };
  const removeMedication = (idx: number) => {
    updateOpinion("medications", opinion.medications.filter((_: any, i: number) => i !== idx));
  };
  const updateMedication = (idx: number, field: string, val: string) => {
    const copy = [...opinion.medications];
    copy[idx] = { ...copy[idx], [field]: val };
    updateOpinion("medications", copy);
  };

  const ChipCheckbox = ({ items, stateKey, noneValue }: { items: string[]; stateKey: keyof ParentOpinion; noneValue?: string }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = ((opinion[stateKey] as string[]) || []).includes(item);
        return (
          <label key={item} className={`flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer transition-colors ${selected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-600" checked={selected} onChange={() => {
              if (noneValue && item === noneValue) {
                updateOpinion(stateKey, selected ? [] : [noneValue]);
              } else {
                const cur = ((opinion[stateKey] as string[]) || []).filter((v: string) => v !== noneValue);
                if (selected) updateOpinion(stateKey, cur.filter((v: string) => v !== item));
                else updateOpinion(stateKey, [...cur, item]);
              }
            }} />
            <span className="text-sm">{item}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">건강 및 특성</h2>
        <p className="text-gray-500 mt-1">학생의 건강 상태와 일상생활의 특징을 알려주세요.</p>
      </div>

      {/* ───── 건강/의료 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">건강 및 의료 특이사항</CardTitle>
          <CardDescription>학교 생활 중 특별한 주의가 필요한 건강 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. 정기 복약 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">1. 정기 복약</h3>
            <div className="flex gap-4">
              {["있음","없음"].map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input type="radio" name="hasMedication" className="w-4 h-4 text-blue-600 focus:ring-blue-600" checked={opinion.hasMedication === v} onChange={() => updateOpinion("hasMedication", v)} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
            {opinion.hasMedication === "있음" && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4">
                {opinion.medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">약물명</Label>
                      <Input placeholder="예: 리스페리돈" value={med.name} onChange={(e) => updateMedication(idx, "name", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">용량</Label>
                      <Input placeholder="예: 0.5mg" value={med.dosage} onChange={(e) => updateMedication(idx, "dosage", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">복용시간</Label>
                      <Input placeholder="예: 아침 식후" value={med.time} onChange={(e) => updateMedication(idx, "time", e.target.value)} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-10 w-10" onClick={() => removeMedication(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addMedication} className="w-full">
                  <Plus className="w-4 h-4 mr-1" /> 약물 추가
                </Button>
                <div className="space-y-2 pt-2 border-t">
                  <Label>교내 투약 지원 여부</Label>
                  <select className={SELECT_CLS} value={opinion.schoolMedicationSupport} onChange={(e) => updateOpinion("schoolMedicationSupport", e.target.value)}>
                    <option value="">선택</option>
                    <option value="필요함">투약 지원 필요함</option>
                    <option value="필요 없음">필요 없음 (스스로 가능/가정에서만)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 2. 알레르기 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">2. 알레르기</h3>
            <ChipCheckbox items={["식품","약물","환경","기타","없음"]} stateKey="allergies" noneValue="없음" />
            {opinion.allergies?.includes("식품") && (
              <Input placeholder="어떤 식품에 알레르기가 있나요?" value={opinion.allergyFoodDetail} onChange={(e) => updateOpinion("allergyFoodDetail", e.target.value)} />
            )}
            {opinion.allergies?.includes("약물") && (
              <Input placeholder="어떤 약물에 알레르기가 있나요?" value={opinion.allergyDrugDetail} onChange={(e) => updateOpinion("allergyDrugDetail", e.target.value)} />
            )}
            {opinion.allergies?.includes("환경") && (
              <Input placeholder="어떤 환경 요인에 알레르기가 있나요? (먼지, 꽃가루 등)" value={opinion.allergyEnvDetail} onChange={(e) => updateOpinion("allergyEnvDetail", e.target.value)} />
            )}
          </div>

          {/* 3. 발작/경련 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">3. 발작(경련) 이력</h3>
            <div className="flex gap-4">
              {["있음","없음"].map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input type="radio" name="hasSeizure" className="w-4 h-4 text-blue-600 focus:ring-blue-600" checked={opinion.hasSeizure === v} onChange={() => updateOpinion("hasSeizure", v)} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
            {opinion.hasSeizure === "있음" && (
              <div className="space-y-3 mt-3 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>최근 발생 시기 및 빈도</Label>
                  <Input placeholder="예: 1년 전 마지막, 한 달에 1번 등" value={opinion.seizureRecent} onChange={(e) => updateOpinion("seizureRecent", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>학교에서 발생 시 대처 요령</Label>
                  <Input placeholder="예: 5분 이상 지속 시 119 신고 등" value={opinion.seizureInstruction} onChange={(e) => updateOpinion("seizureInstruction", e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* 4. 식이 제한 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">4. 식이 제한</h3>
            <ChipCheckbox items={["질환(당뇨·신장 등)","종교/문화적","씹기/삼키기 어려움","편식 심함","제한 없음"]} stateKey="dietaryRestriction" noneValue="제한 없음" />
            {opinion.dietaryRestriction?.includes("질환(당뇨·신장 등)") && (
              <Input placeholder="질환 관련 상세 (예: 당뇨로 당분 제한)" value={opinion.dietaryDiseaseDetail} onChange={(e) => updateOpinion("dietaryDiseaseDetail", e.target.value)} />
            )}
            {opinion.dietaryRestriction?.includes("종교/문화적") && (
              <Input placeholder="종교/문화적 제한 상세 (예: 할랄, 채식 등)" value={opinion.dietaryCultureDetail} onChange={(e) => updateOpinion("dietaryCultureDetail", e.target.value)} />
            )}
          </div>

          {/* 5. 수면 특성 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">5. 수면 특성</h3>
            <ChipCheckbox items={["등교 후 졸림 빈번","수면무호흡 의심","야간 수면 불규칙","수면제 복용","특이사항 없음"]} stateKey="sleepCharacteristics" noneValue="특이사항 없음" />
          </div>

          {/* 6. 감각 특성 */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">6. 감각 특성 (과민/둔감)</h3>
            <ChipCheckbox items={["청각 과민","시각 과민","촉각 과민/회피","미각 과민(편식)","전정감각(흔들림 과민/추구)","고유수용감각(힘 조절 어려움)","기타","해당 없음"]} stateKey="sensoryIssues" noneValue="해당 없음" />
            {opinion.sensoryIssues?.includes("기타") && (
              <Input placeholder="기타 감각 특성 상세" value={opinion.sensoryOther} onChange={(e) => updateOpinion("sensoryOther", e.target.value)} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ───── 보조기기/환경 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">보조기기 및 환경 수정</CardTitle>
          <CardDescription>학교에서 사용하거나 필요한 보조 도구와 환경 변경 사항입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">1. 보조공학기기 (AAC, 태블릿 등)</h3>
            <ChipCheckbox items={["AAC(의사소통보조기기)","태블릿/터치스크린","특수 키보드/마우스","화면확대기/점자단말기","기타","사용 안 함"]} stateKey="assistiveTech" noneValue="사용 안 함" />
            {opinion.assistiveTech?.includes("기타") && (
              <Input placeholder="기타 보조공학기기 상세" value={opinion.assistiveTechOther} onChange={(e) => updateOpinion("assistiveTechOther", e.target.value)} />
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">2. 보조기구 (보행기, 보청기 등)</h3>
            <ChipCheckbox items={["보청기/인공와우","안경/저시력 보조기","보행기/휠체어","교정기구(AFO 등)","기타","사용 안 함"]} stateKey="assistiveDevice" noneValue="사용 안 함" />
            {opinion.assistiveDevice?.includes("기타") && (
              <Input placeholder="기타 보조기구 상세" value={opinion.assistiveDeviceOther} onChange={(e) => updateOpinion("assistiveDeviceOther", e.target.value)} />
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">3. 환경 수정 요구</h3>
            <ChipCheckbox items={["좌석 배치 조정","조명/소음 조절","별도 휴식 공간","경사로/엘리베이터","기타","필요 없음"]} stateKey="envModification" noneValue="필요 없음" />
            {opinion.envModification?.includes("기타") && (
              <Input placeholder="기타 환경 수정 상세" value={opinion.envModificationOther} onChange={(e) => updateOpinion("envModificationOther", e.target.value)} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ───── 강점 및 고유 특성 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">강점 및 고유 특성</CardTitle>
          <CardDescription>학생이 잘하는 것과 특별한 성향을 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">학생의 강점 및 관심사</Label>
            <textarea id="strengths" rows={3} className={TEXTAREA_CLS} placeholder="예: 퍼즐 맞추기를 아주 좋아합니다. 숫자 기억력이 뛰어납니다." value={opinion.strengths} onChange={(e) => updateOpinion("strengths", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uniqueTraits">지도 시 유의해야 할 고유 특성</Label>
            <textarea id="uniqueTraits" rows={3} className={TEXTAREA_CLS} placeholder="예: 큰 소리가 나면 귀를 막고 불안해합니다." value={opinion.uniqueTraits} onChange={(e) => updateOpinion("uniqueTraits", e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
