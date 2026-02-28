"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
  teacherStudentName?: string;
}

export function SectionBasicInfo({ data, update, teacherStudentName }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold border-b pb-2">0. 기본 정보</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>학생 성명</Label>
          <Input
            value={data.studentName || teacherStudentName || ""}
            onChange={(e) => update("studentName", e.target.value)}
          />
        </div>
        <div>
          <Label>생년월일</Label>
          <Input
            type="date"
            value={data.birthDate}
            onChange={(e) => update("birthDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>보호자 성명</Label>
          <Input
            value={data.guardianName}
            onChange={(e) => update("guardianName", e.target.value)}
          />
        </div>
        <div>
          <Label>보호자 관계</Label>
          <RadioOption
            options={["부", "모", "조부", "조모", "기타"]}
            value={data.guardianRelation}
            onChange={(v) => update("guardianRelation", v)}
            columns={3}
          />
          {data.guardianRelation === "기타" && (
            <Input
              className="mt-2"
              placeholder="관계를 입력하세요"
              value={data.guardianRelationOther}
              onChange={(e) => update("guardianRelationOther", e.target.value)}
            />
          )}
        </div>
      </div>

      <div>
        <Label>연락처</Label>
        <Input
          type="tel"
          placeholder="010-0000-0000"
          value={data.guardianPhone}
          onChange={(e) => update("guardianPhone", e.target.value)}
        />
      </div>
    </div>
  );
}
