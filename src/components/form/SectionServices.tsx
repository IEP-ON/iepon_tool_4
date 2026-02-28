"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import { CheckboxGroup } from "./CheckboxGroup";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
}

export function SectionServices({ data, update }: Props) {
  return (
    <div className="space-y-6">
      {/* ⑧ 외부 치료·방과후 */}
      <h2 className="text-lg font-bold border-b pb-2">⑧ 외부 치료·방과후 지원 현황</h2>

      <div>
        <Label>방과 후 주로 하는 활동</Label>
        <Textarea
          value={data.afterSchoolActivity}
          onChange={(e) => update("afterSchoolActivity", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>현재 이용 중인 치료·지원 서비스</Label>
        {data.therapyServices.map((svc, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mt-2">
            <Input
              placeholder="기관명"
              value={svc.institution}
              onChange={(e) => {
                const updated = [...data.therapyServices];
                updated[i] = { ...updated[i], institution: e.target.value };
                update("therapyServices", updated);
              }}
            />
            <Input
              placeholder="서비스 영역"
              value={svc.area}
              onChange={(e) => {
                const updated = [...data.therapyServices];
                updated[i] = { ...updated[i], area: e.target.value };
                update("therapyServices", updated);
              }}
            />
            <RadioOption
              options={["교육청 치료지원", "복지부 바우처"]}
              value={svc.type}
              onChange={(v) => {
                const updated = [...data.therapyServices];
                updated[i] = { ...updated[i], type: v };
                update("therapyServices", updated);
              }}
              columns={1}
            />
          </div>
        ))}
      </div>

      {/* ⑨ 특수교육 관련 서비스 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑨ 특수교육 관련 서비스 신청 및 현황</h2>

      {[
        { key: "afterSchoolSpecialEd" as const, label: "방과후학교 특수교육" },
        { key: "transportSupport" as const, label: "통학지원" },
        { key: "assistantSupport" as const, label: "보조인력(특수교육실무사)" },
      ].map(({ key, label }) => (
        <div key={key}>
          <Label>{label}</Label>
          <RadioOption
            options={["신청", "미신청"]}
            value={data[key] as string}
            onChange={(v) => update(key, v)}
          />
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>치료지원 (교육청) — 이용기관</Label>
          <Input
            value={data.therapySupportInstitution}
            onChange={(e) => update("therapySupportInstitution", e.target.value)}
          />
        </div>
        <div>
          <Label>치료지원 (교육청) — 영역</Label>
          <Input
            value={data.therapySupportArea}
            onChange={(e) => update("therapySupportArea", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>발달재활서비스 (복지부) — 이용기관</Label>
          <Input
            value={data.rehabServiceInstitution}
            onChange={(e) => update("rehabServiceInstitution", e.target.value)}
          />
        </div>
        <div>
          <Label>발달재활서비스 (복지부) — 영역</Label>
          <Input
            value={data.rehabServiceArea}
            onChange={(e) => update("rehabServiceArea", e.target.value)}
          />
        </div>
      </div>

      {/* ⑩ 학교 행사 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑩ 학교 행사 및 활동 관련 사전 의견</h2>

      <div>
        <Label>A. 생존수영 (3·4학년 해당)</Label>
        <RadioOption
          options={["참가 희망", "불참 희망"]}
          value={data.survivalSwimming}
          onChange={(v) => update("survivalSwimming", v)}
        />
        {data.survivalSwimming === "불참 희망" && (
          <Input
            className="mt-2"
            placeholder="사유"
            value={data.survivalSwimmingReason}
            onChange={(e) => update("survivalSwimmingReason", e.target.value)}
          />
        )}
        <p className="text-xs text-blue-600 mt-1">
          남학생의 경우 여성 실무사는 탈의실·샤워실 내부 지원이 어렵습니다.
        </p>
      </div>

      <div>
        <Label>B. 공개수업 참관 방식</Label>
        <RadioOption
          options={["특수학급만", "통합학급만", "모두 참관", "참관 불필요"]}
          value={data.openClassObservation}
          onChange={(v) => update("openClassObservation", v)}
        />
      </div>

      <div>
        <Label>C. 특수학급 현장체험학습 참여</Label>
        <RadioOption
          options={["참여 희망", "불참 희망"]}
          value={data.fieldTrip}
          onChange={(v) => update("fieldTrip", v)}
        />
        <p className="text-xs text-gray-500 mt-1">불참 시 학교 내 대체 활동 제공</p>
      </div>

      {/* ⑪ 미래·전환교육 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑪ 미래·전환교육 비전</h2>

      <div>
        <Label>보호자가 생각하는 우리 아이의 5년 후 모습</Label>
        <Textarea
          value={data.fiveYearVision}
          onChange={(e) => update("fiveYearVision", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>졸업 후 희망 진로 방향</Label>
        <RadioOption
          options={["일반고", "특수학교 고등부", "직업훈련", "미정", "기타"]}
          value={data.careerDirection}
          onChange={(v) => update("careerDirection", v)}
          columns={3}
        />
        {data.careerDirection === "기타" && (
          <Input
            className="mt-2"
            placeholder="구체적으로"
            value={data.careerDirectionOther}
            onChange={(e) => update("careerDirectionOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>장기적으로 가장 중요하게 생각하는 교육 가치</Label>
        <RadioOption
          options={["자립생활", "사회성·또래관계", "학업성취", "정서안정", "직업준비"]}
          value={data.educationValue}
          onChange={(v) => update("educationValue", v)}
          columns={3}
        />
      </div>

      {/* ⑫ 소통 선호 방식 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑫ 보호자 소통 선호 방식</h2>

      <div>
        <Label>선호 연락 방식 (복수 선택 가능)</Label>
        <CheckboxGroup
          options={["전화", "문자", "알림장", "학교앱", "이메일"]}
          selected={data.preferredContact}
          onChange={(v) => update("preferredContact", v)}
          columns={3}
        />
      </div>

      <div>
        <Label>연락 가능 시간대 (복수 선택 가능)</Label>
        <CheckboxGroup
          options={["오전", "오후", "저녁", "무관"]}
          selected={data.availableTimeSlot}
          onChange={(v) => update("availableTimeSlot", v)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>긴급 연락처 2순위 — 성명</Label>
          <Input
            value={data.emergencyContact2Name}
            onChange={(e) => update("emergencyContact2Name", e.target.value)}
          />
        </div>
        <div>
          <Label>관계</Label>
          <Input
            value={data.emergencyContact2Relation}
            onChange={(e) => update("emergencyContact2Relation", e.target.value)}
          />
        </div>
        <div>
          <Label>연락처</Label>
          <Input
            value={data.emergencyContact2Phone}
            onChange={(e) => update("emergencyContact2Phone", e.target.value)}
          />
        </div>
      </div>

      {/* ⑬ 기타 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑬ 학교에 특별히 알려주실 내용</h2>

      <div>
        <Label>최근 건강·복약 상태 변경 사항</Label>
        <Textarea
          value={data.healthChanges}
          onChange={(e) => update("healthChanges", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>최근 가정 내 변화 (이사, 가족 구성 변화 등)</Label>
        <Textarea
          value={data.familyChanges}
          onChange={(e) => update("familyChanges", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>선생님께 전하고 싶은 말</Label>
        <Textarea
          value={data.messageToTeacher}
          onChange={(e) => update("messageToTeacher", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
