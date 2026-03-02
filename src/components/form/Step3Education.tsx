"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

export function Step3Education({ opinion, updateOpinion }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">교육 및 지원 요구</h2>
        <p className="text-gray-500 mt-1">이번 학기 목표와 필요한 학교 지원을 선택해주세요.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">교육 목표</CardTitle>
          <CardDescription>가정에서 가장 중요하게 생각하는 교육 영역입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priorityGoal">최우선 교육 목표</Label>
            <textarea
              id="priorityGoal"
              rows={3}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              placeholder="예: 친구들과 인사하기, 스스로 화장실 가기 등 이번 학기에 꼭 이루었으면 하는 목표"
              value={opinion.priorityGoal}
              onChange={(e) => updateOpinion("priorityGoal", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredMethod">효과적인 지도 방법 (보상/벌 등)</Label>
            <textarea
              id="preferredMethod"
              rows={2}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              placeholder="예: 잘했을 때 좋아하는 스티커를 주면 좋습니다."
              value={opinion.preferredMethod}
              onChange={(e) => updateOpinion("preferredMethod", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">지원 서비스 신청 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">1. 특수교육 보조인력 (실무사/사회복지요원 등)</h3>
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={opinion.assistantSupport}
              onChange={(e) => updateOpinion("assistantSupport", e.target.value)}
            >
              <option value="">선택</option>
              <option value="신청">신청함 (지원이 필요함)</option>
              <option value="미신청">신청 안 함 (지원 불필요)</option>
            </select>
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">2. 통학비 지원</h3>
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={opinion.transportSupport}
              onChange={(e) => updateOpinion("transportSupport", e.target.value)}
            >
              <option value="">선택</option>
              <option value="신청">신청함 (도보 불가, 원거리 통학 등)</option>
              <option value="미신청">신청 안 함</option>
            </select>
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium text-gray-900">3. 방과후학교 (특수)</h3>
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={opinion.afterSchoolSpecialEd}
              onChange={(e) => updateOpinion("afterSchoolSpecialEd", e.target.value)}
            >
              <option value="">선택</option>
              <option value="교내이용">교내 방과후 참여</option>
              <option value="교외이용">교외 (전자카드 이용)</option>
              <option value="미이용">이용 안 함</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">장기적 비전 (5년 후)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <textarea
              rows={3}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              placeholder="예: 5년 후, 중학교에 진학하여 스스로 대중교통을 이용하고 혼자 장보기를 할 수 있기를 바랍니다."
              value={opinion.fiveYearVision}
              onChange={(e) => updateOpinion("fiveYearVision", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
