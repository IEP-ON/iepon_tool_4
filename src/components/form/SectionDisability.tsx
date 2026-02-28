"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";
import { useEffect } from "react";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: string) => void;
}

export function SectionDisability({ data, update }: Props) {
  const disabilityTypes = [
    "시각장애",
    "청각장애",
    "지적장애",
    "지체장애",
    "정서·행동장애",
    "자폐성장애",
    "의사소통장애",
    "학습장애",
    "건강장애",
    "발달지체",
    "직접 입력",
  ];

  // 컴포넌트 마운트 시 기본적으로 미소지 상태와 유사하게 빈 값 유지 (이미 선택된 값이 없을 경우)
  useEffect(() => {
    if (!data.disabilityRegistration) {
      update("disabilityRegistration", "");
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* 안내 문구를 맨 위로 이동 */}
      <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
        💡 <b>안내:</b> 개별화교육지원팀 협의회 진행 전, 학생의 현재 지원 현황을 정확히 파악하기 위한 기초 자료입니다. 
        해당하는 항목만 작성해 주시면 됩니다.
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold border-b pb-2">A. 복지카드 소지 여부 (복지부 등록)</h2>
        <div>
          <Label className="font-medium text-gray-700 block mb-2">복지카드 소지</Label>
          <RadioOption
            options={["소지", "미소지"]}
            value={data.disabilityRegistration}
            onChange={(v) => {
              update("disabilityRegistration", v);
              if (v === "미소지") {
                update("primaryDisability", "");
                update("secondaryDisability", "없음");
                update("secondaryDisabilityType", "");
                update("disabilitySeverity", "");
                update("firstRegistrationDate", "");
              }
            }}
          />
        </div>

        {data.disabilityRegistration === "소지" && (
          <div className="space-y-6 pt-4 px-4 bg-gray-50/50 rounded-xl border border-gray-100 pb-4">
            <div className="space-y-3">
              <Label className="font-medium text-gray-700 block">주장애 유형</Label>
              <RadioOption
                options={disabilityTypes}
                value={disabilityTypes.includes(data.primaryDisability) ? data.primaryDisability : (data.primaryDisability ? "직접 입력" : "")}
                onChange={(v) => {
                  if (v === "직접 입력") {
                    update("primaryDisability", " "); // 임시값으로 '직접 입력' 상태 트리거
                  } else {
                    update("primaryDisability", v);
                  }
                }}
              />
              {(!disabilityTypes.slice(0, -1).includes(data.primaryDisability) && data.primaryDisability !== "") && (
                <Input
                  className="mt-2 bg-white"
                  placeholder="장애 유형 직접 입력"
                  value={data.primaryDisability.trim()}
                  onChange={(e) => update("primaryDisability", e.target.value)}
                />
              )}
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-gray-700 block">부장애 (중복장애) 여부</Label>
              <RadioOption
                options={["없음", "있음"]}
                value={data.secondaryDisability}
                onChange={(v) => {
                  update("secondaryDisability", v);
                  if (v === "없음") update("secondaryDisabilityType", "");
                }}
              />
              {data.secondaryDisability === "있음" && (
                <Input
                  className="mt-2 bg-white"
                  placeholder="부장애 유형을 입력해 주세요"
                  value={data.secondaryDisabilityType}
                  onChange={(e) => update("secondaryDisabilityType", e.target.value)}
                />
              )}
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-gray-700 block">장애 정도</Label>
              <RadioOption
                options={["심한 장애 (기존 1~3급)", "심하지 않은 장애 (기존 4~6급)"]}
                value={data.disabilitySeverity}
                onChange={(v) => update("disabilitySeverity", v)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-lg font-bold border-b pb-2">B. 특수교육대상자 선정 현황 (교육청)</h2>
        <div className="space-y-6 pt-2 px-4 bg-gray-50/50 rounded-xl border border-gray-100 pb-4">
          <div className="space-y-3 pt-2">
            <Label className="font-medium text-gray-700 block">특수교육 대상자 선정 장애 영역</Label>
            <RadioOption
              options={disabilityTypes}
              value={disabilityTypes.includes(data.specialEdArea) ? data.specialEdArea : (data.specialEdArea ? "직접 입력" : "")}
              onChange={(v) => {
                if (v === "직접 입력") {
                  update("specialEdArea", " ");
                } else {
                  update("specialEdArea", v);
                }
              }}
            />
            {(!disabilityTypes.slice(0, -1).includes(data.specialEdArea) && data.specialEdArea !== "") && (
              <Input
                className="mt-2 bg-white"
                placeholder="선정 장애 영역 직접 입력"
                value={data.specialEdArea.trim()}
                onChange={(e) => update("specialEdArea", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-3">
            <Label className="font-medium text-gray-700 block">최초 선정 연도/시기</Label>
            <Input
              type="month"
              className="bg-white max-w-[200px]"
              value={data.firstSelectionDate}
              onChange={(e) => update("firstSelectionDate", e.target.value)}
            />
          </div>
          {/* '현재 교육 배치 형태' 문항 삭제됨 */}
        </div>
      </div>
    </div>
  );
}
