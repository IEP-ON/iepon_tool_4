"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

export function Step1Basic({ opinion, updateOpinion }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
        <p className="text-gray-500 mt-1">학생과 보호자에 대한 기본 정보를 입력해주세요.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">보호자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">보호자 성명</Label>
              <Input
                id="guardianName"
                placeholder="성명 입력"
                value={opinion.guardianName}
                onChange={(e) => updateOpinion("guardianName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianRelation">학생과의 관계</Label>
              <select
                id="guardianRelation"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                value={opinion.guardianRelation}
                onChange={(e) => updateOpinion("guardianRelation", e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="어머니">어머니</option>
                <option value="아버지">아버지</option>
                <option value="조부모">조부모</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
          
          {opinion.guardianRelation === "기타" && (
            <div className="space-y-2">
              <Label htmlFor="guardianRelationOther">관계 상세 (기타 선택 시)</Label>
              <Input
                id="guardianRelationOther"
                placeholder="예: 이모, 삼촌 등"
                value={opinion.guardianRelationOther}
                onChange={(e) => updateOpinion("guardianRelationOther", e.target.value)}
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">연락처</Label>
              <Input
                id="guardianPhone"
                type="tel"
                placeholder="010-0000-0000"
                value={opinion.guardianPhone}
                onChange={(e) => updateOpinion("guardianPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">학생 생년월일</Label>
              <Input
                id="birthDate"
                type="date"
                value={opinion.birthDate}
                onChange={(e) => updateOpinion("birthDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">장애 및 특수교육 선정 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">장애인 등록 현황</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disabilityRegistration"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.disabilityRegistration === "등록"}
                  onChange={() => updateOpinion("disabilityRegistration", "등록")}
                />
                <span>등록</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disabilityRegistration"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  checked={opinion.disabilityRegistration === "미등록"}
                  onChange={() => updateOpinion("disabilityRegistration", "미등록")}
                />
                <span>미등록</span>
              </label>
            </div>
            
            {opinion.disabilityRegistration === "등록" && (
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryDisability">주장애</Label>
                  <Input
                    id="primaryDisability"
                    placeholder="예: 지적장애, 자폐성장애"
                    value={opinion.primaryDisability}
                    onChange={(e) => updateOpinion("primaryDisability", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabilitySeverity">장애 정도</Label>
                  <select
                    id="disabilitySeverity"
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    value={opinion.disabilitySeverity}
                    onChange={(e) => updateOpinion("disabilitySeverity", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="심한 장애">심한 장애(중증)</option>
                    <option value="심하지 않은 장애">심하지 않은 장애(경증)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-medium text-gray-900 border-b pb-2">특수교육대상자 선정 영역</h3>
            <div className="space-y-2">
              <select
                id="specialEdArea"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                value={opinion.specialEdArea}
                onChange={(e) => updateOpinion("specialEdArea", e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="지적장애">지적장애</option>
                <option value="자폐성장애">자폐성장애</option>
                <option value="발달지체">발달지체</option>
                <option value="시각장애">시각장애</option>
                <option value="청각장애">청각장애</option>
                <option value="지체장애">지체장애</option>
                <option value="정서행동장애">정서행동장애</option>
                <option value="의사소통장애">의사소통장애</option>
                <option value="학습장애">학습장애</option>
                <option value="건강장애">건강장애</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
