"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

const SELECT_CLS = "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";

export function Step1Basic({ opinion, updateOpinion }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
        <p className="text-gray-500 mt-1">학생과 보호자에 대한 기본 정보를 입력해주세요.</p>
      </div>

      {/* ───── 학생 정보 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">학생 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">학생 성명 <span className="text-red-500">*</span></Label>
              <Input id="studentName" placeholder="성명 입력" value={opinion.studentName} onChange={(e) => updateOpinion("studentName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input id="birthDate" type="date" value={opinion.birthDate} onChange={(e) => updateOpinion("birthDate", e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">학년 <span className="text-red-500">*</span></Label>
              <select id="grade" className={SELECT_CLS} value={opinion.grade} onChange={(e) => updateOpinion("grade", e.target.value)}>
                <option value="">선택해주세요</option>
                {["1학년","2학년","3학년","4학년","5학년","6학년","중1","중2","중3","고1","고2","고3"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classNum">반 <span className="text-red-500">*</span></Label>
              <Input id="classNum" placeholder="예: 3" value={opinion.classNum} onChange={(e) => updateOpinion("classNum", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── 보호자 정보 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">보호자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">보호자 성명 <span className="text-red-500">*</span></Label>
              <Input id="guardianName" placeholder="성명 입력" value={opinion.guardianName} onChange={(e) => updateOpinion("guardianName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianRelation">학생과의 관계</Label>
              <select id="guardianRelation" className={SELECT_CLS} value={opinion.guardianRelation} onChange={(e) => updateOpinion("guardianRelation", e.target.value)}>
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
              <Label htmlFor="guardianRelationOther">관계 상세</Label>
              <Input id="guardianRelationOther" placeholder="예: 이모, 삼촌 등" value={opinion.guardianRelationOther} onChange={(e) => updateOpinion("guardianRelationOther", e.target.value)} />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">연락처</Label>
              <Input id="guardianPhone" type="tel" placeholder="010-0000-0000" value={opinion.guardianPhone} onChange={(e) => updateOpinion("guardianPhone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCaregiver">주 양육자</Label>
              <select id="primaryCaregiver" className={SELECT_CLS} value={opinion.primaryCaregiver} onChange={(e) => updateOpinion("primaryCaregiver", e.target.value)}>
                <option value="부모 공동 양육">부모 공동 양육</option>
                <option value="어머니 중심">어머니 중심</option>
                <option value="아버지 중심">아버지 중심</option>
                <option value="조부모 양육">조부모 양육</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
          {opinion.primaryCaregiver === "기타" && (
            <div className="space-y-2">
              <Label htmlFor="primaryCaregiverOther">주 양육자 상세</Label>
              <Input id="primaryCaregiverOther" placeholder="예: 위탁가정, 시설 등" value={opinion.primaryCaregiverOther} onChange={(e) => updateOpinion("primaryCaregiverOther", e.target.value)} />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="multicultural">다문화 가정 여부</Label>
              <select id="multicultural" className={SELECT_CLS} value={opinion.multicultural} onChange={(e) => updateOpinion("multicultural", e.target.value)}>
                <option value="해당 없음">해당 없음</option>
                <option value="해당">해당</option>
              </select>
            </div>
            {opinion.multicultural === "해당" && (
              <div className="space-y-2">
                <Label htmlFor="multiculturalLanguage">가정 내 사용 언어</Label>
                <Input id="multiculturalLanguage" placeholder="예: 베트남어, 중국어 등" value={opinion.multiculturalLanguage} onChange={(e) => updateOpinion("multiculturalLanguage", e.target.value)} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ───── 장애 및 특수교육 선정 현황 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">장애 및 특수교육 선정 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">A. 장애인 등록 현황</h3>
            <div className="flex gap-4">
              {["등록", "미등록"].map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input type="radio" name="disabilityRegistration" className="w-4 h-4 text-blue-600 focus:ring-blue-600" checked={opinion.disabilityRegistration === v} onChange={() => updateOpinion("disabilityRegistration", v)} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
            {opinion.disabilityRegistration === "등록" && (
              <div className="space-y-4 pt-2 p-4 bg-gray-50 rounded-lg">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryDisability">주장애</Label>
                    <Input id="primaryDisability" placeholder="예: 지적장애, 자폐성장애" value={opinion.primaryDisability} onChange={(e) => updateOpinion("primaryDisability", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabilitySeverity">장애 정도</Label>
                    <select id="disabilitySeverity" className={SELECT_CLS} value={opinion.disabilitySeverity} onChange={(e) => updateOpinion("disabilitySeverity", e.target.value)}>
                      <option value="">선택</option>
                      <option value="심한 장애">심한 장애(중증)</option>
                      <option value="심하지 않은 장애">심하지 않은 장애(경증)</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondaryDisability">동반(부)장애</Label>
                    <select id="secondaryDisability" className={SELECT_CLS} value={opinion.secondaryDisability} onChange={(e) => updateOpinion("secondaryDisability", e.target.value)}>
                      <option value="없음">없음</option>
                      <option value="있음">있음</option>
                    </select>
                  </div>
                  {opinion.secondaryDisability === "있음" && (
                    <div className="space-y-2">
                      <Label htmlFor="secondaryDisabilityType">동반장애 유형</Label>
                      <Input id="secondaryDisabilityType" placeholder="예: 언어장애, 뇌병변 등" value={opinion.secondaryDisabilityType} onChange={(e) => updateOpinion("secondaryDisabilityType", e.target.value)} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstRegistrationDate">최초 장애등록일</Label>
                  <Input id="firstRegistrationDate" type="date" value={opinion.firstRegistrationDate} onChange={(e) => updateOpinion("firstRegistrationDate", e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-medium text-gray-900 border-b pb-2">B. 특수교육대상자 선정 현황</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialEdArea">선정 영역</Label>
                <select id="specialEdArea" className={SELECT_CLS} value={opinion.specialEdArea} onChange={(e) => updateOpinion("specialEdArea", e.target.value)}>
                  <option value="">선택해주세요</option>
                  {["지적장애","자폐성장애","발달지체","시각장애","청각장애","지체장애","정서행동장애","의사소통장애","학습장애","건강장애","기타"].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstSelectionDate">최초 선정 시기</Label>
                <Input id="firstSelectionDate" type="date" value={opinion.firstSelectionDate} onChange={(e) => updateOpinion("firstSelectionDate", e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── 협의회 참석 희망 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">협의회 참석 희망</CardTitle>
          <CardDescription>개별화교육지원팀 협의회에 어떤 방법으로 참석하시겠습니까?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { value: "대면 참석", label: "학교 방문 (대면)" },
              { value: "유선 참석", label: "전화 상담 (유선)" },
              { value: "의견서 제출로 갈음", label: "의견서 제출로 갈음 (방문 불가 시)" },
            ].map((opt) => (
              <label key={opt.value} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${opinion.attendanceMethod === opt.value ? "border-blue-600 bg-blue-50/80 shadow-sm" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                <input type="radio" name="attendanceMethod" className="w-4 h-4 text-blue-600" checked={opinion.attendanceMethod === opt.value} onChange={() => updateOpinion("attendanceMethod", opt.value)} />
                <span className={`font-medium ${opinion.attendanceMethod === opt.value ? "text-blue-900" : "text-gray-900"}`}>{opt.label}</span>
              </label>
            ))}
          </div>

          {(opinion.attendanceMethod === "대면 참석" || opinion.attendanceMethod === "유선 참석") && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <p className="text-sm text-gray-600 font-medium">희망 일시를 1~3순위로 적어주세요.</p>
              {[1, 2, 3].map((n) => {
                const dateKey = `hopeDate${n}` as keyof ParentOpinion;
                const timeKey = `hopeTime${n}` as keyof ParentOpinion;
                return (
                  <div key={n} className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center">
                    <span className="text-sm font-bold text-gray-500 w-14">{n}순위</span>
                    <Input type="date" value={(opinion[dateKey] as string) || ""} onChange={(e) => updateOpinion(dateKey, e.target.value)} />
                    <Input type="time" value={(opinion[timeKey] as string) || ""} onChange={(e) => updateOpinion(timeKey, e.target.value)} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
