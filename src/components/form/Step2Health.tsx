"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

export function Step2Health({ opinion, updateOpinion }: Props) {
  const handleArrayToggle = (key: keyof ParentOpinion, value: string) => {
    const current = (opinion[key] as string[]) || [];
    if (current.includes(value)) {
      updateOpinion(key, current.filter((v) => v !== value));
    } else {
      updateOpinion(key, [...current, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">건강 및 특성</h2>
        <p className="text-gray-500 mt-1">학생의 건강 상태와 일상생활의 특징을 알려주세요.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">건강 및 의료 특이사항</CardTitle>
          <CardDescription>학교 생활 중 특별한 주의가 필요한 건강 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">1. 정기 복약</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasMedication"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.hasMedication === "있음"}
                  onChange={() => updateOpinion("hasMedication", "있음")}
                />
                <span>있음</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasMedication"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.hasMedication === "없음"}
                  onChange={() => updateOpinion("hasMedication", "없음")}
                />
                <span>없음</span>
              </label>
            </div>
            {opinion.hasMedication === "있음" && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label>교내 투약 지원 여부</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={opinion.schoolMedicationSupport}
                    onChange={(e) => updateOpinion("schoolMedicationSupport", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="필요함">투약 지원 필요함</option>
                    <option value="필요없음(스스로 가능/가정에서만)">필요 없음</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">2. 알레르기</h3>
            <div className="flex flex-wrap gap-2">
              {["식품", "약물", "환경", "기타", "없음"].map((item) => (
                <label key={item} className="flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
                    checked={opinion.allergies?.includes(item)}
                    onChange={() => handleArrayToggle("allergies", item)}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            {opinion.allergies?.includes("식품") && (
              <Input
                placeholder="어떤 식품에 알레르기가 있나요?"
                value={opinion.allergyFoodDetail}
                onChange={(e) => updateOpinion("allergyFoodDetail", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">3. 발작(경련) 이력</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasSeizure"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.hasSeizure === "있음"}
                  onChange={() => updateOpinion("hasSeizure", "있음")}
                />
                <span>있음</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasSeizure"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.hasSeizure === "없음"}
                  onChange={() => updateOpinion("hasSeizure", "없음")}
                />
                <span>없음</span>
              </label>
            </div>
            {opinion.hasSeizure === "있음" && (
              <div className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>최근 발생 시기 및 빈도</Label>
                  <Input
                    placeholder="예: 1년 전 마지막, 한 달에 1번 등"
                    value={opinion.seizureRecent}
                    onChange={(e) => updateOpinion("seizureRecent", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>학교에서 발생 시 대처 요령</Label>
                  <Input
                    placeholder="예: 5분 이상 지속 시 119 신고 등"
                    value={opinion.seizureInstruction}
                    onChange={(e) => updateOpinion("seizureInstruction", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">강점 및 고유 특성</CardTitle>
          <CardDescription>학생이 잘하는 것과 특별한 성향을 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">학생의 강점 및 관심사</Label>
            <textarea
              id="strengths"
              rows={3}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              placeholder="예: 퍼즐 맞추기를 아주 좋아합니다. 숫자 기억력이 뛰어납니다."
              value={opinion.strengths}
              onChange={(e) => updateOpinion("strengths", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uniqueTraits">지도 시 유의해야 할 고유 특성</Label>
            <textarea
              id="uniqueTraits"
              rows={3}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              placeholder="예: 큰 소리가 나면 귀를 막고 불안해합니다."
              value={opinion.uniqueTraits}
              onChange={(e) => updateOpinion("uniqueTraits", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
