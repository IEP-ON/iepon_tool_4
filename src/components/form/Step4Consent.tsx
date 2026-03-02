"use client";

import type { ConsentForm } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SignaturePad } from "./SignaturePad";

interface Props {
  consent: ConsentForm;
  updateConsent: (key: keyof ConsentForm, value: any) => void;
}

export function Step4Consent({ consent, updateConsent }: Props) {
  const toggleConsent = (key: keyof ConsentForm, val: boolean) => {
    updateConsent(key, val);
  };

  const addEmergencyContact = () => {
    updateConsent("emergencyContacts", [...(consent.emergencyContacts || []), { name: "", relation: "", phone: "" }]);
  };
  const removeEmergencyContact = (idx: number) => {
    updateConsent("emergencyContacts", (consent.emergencyContacts || []).filter((_: any, i: number) => i !== idx));
  };
  const updateEmergencyContact = (idx: number, field: string, val: string) => {
    const copy = [...(consent.emergencyContacts || [])];
    copy[idx] = { ...copy[idx], [field]: val };
    updateConsent("emergencyContacts", copy);
  };

  const ConsentRow = ({ 
    title, 
    desc, 
    consentKey, 
    required = false 
  }: { 
    title: string; 
    desc?: string; 
    consentKey: keyof ConsentForm; 
    required?: boolean;
  }) => (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-sm text-gray-900">
            {title} {required && <span className="text-red-500 text-xs ml-1">(필수)</span>}
          </p>
          {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        </div>
        <div className="flex gap-4 shrink-0 bg-gray-50 p-1.5 rounded-lg w-fit">
          <label className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors ${consent[consentKey] === true ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
            <input type="radio" className="sr-only" checked={consent[consentKey] === true} onChange={() => toggleConsent(consentKey, true)} />
            <span className="text-sm font-medium">동의</span>
          </label>
          <label className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors ${consent[consentKey] === false ? 'bg-red-500 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
            <input type="radio" className="sr-only" checked={consent[consentKey] === false} onChange={() => toggleConsent(consentKey, false)} />
            <span className="text-sm font-medium">미동의</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">동의 및 서명</h2>
        <p className="text-gray-500 mt-1">교육 지원에 필요한 정보 제공 및 활동 참여에 동의해주세요.</p>
      </div>

      {/* ───── 필수 동의 ───── */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="pb-2 bg-blue-50/50 border-b border-blue-100 rounded-t-xl">
          <CardTitle className="text-lg text-blue-900">필수 동의 사항</CardTitle>
          <CardDescription className="text-blue-700/70">특수교육 및 원활한 학교 생활 지원을 위해 반드시 필요한 항목입니다.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ConsentRow title="1. 기본 개인정보 수집·이용" desc="IEP 수립, 성적, 출결 관리 등을 위한 기본 정보" consentKey="consent1" required />
          <ConsentRow title="2. 건강·장애 민감정보 수집·이용" desc="장애유형, 복약, 알레르기 등 지원에 필수적인 정보 (개인정보보호법 제23조)" consentKey="consent2" required />
          <ConsentRow title="3. 제3자 정보 제공" desc="교육청, 특수교육지원센터 등 관련 서비스 신청용" consentKey="consent3" required />
          <ConsentRow title="4. 교내 정보 공유 및 협력 지도" desc="통합학급 담임, 보건/영양교사 등과 원활한 학교생활 지원을 위해 공유" consentKey="consent4_handover" required />
        </CardContent>
      </Card>

      {/* ───── 생명·안전 (응급처치) ───── */}
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="pb-2 bg-red-50/50 border-b border-red-100 rounded-t-xl">
          <CardTitle className="text-lg text-red-900">생명 및 안전 보호 (응급처치 동의 — 필수)</CardTitle>
          <CardDescription className="text-red-700/70">위급 상황 시 신속한 대처를 위해 반드시 필요합니다.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ConsentRow title="1) 교직원에 의한 1차 응급처치 (심폐소생술 등)" consentKey="consent9_firstAid" required />
          <ConsentRow title="2) 응급 상황 시 119 신고 및 병원 이송" desc="보호자 연락 지연 시 학교 판단하에 응급조치 실시" consentKey="consent9_119" required />
          <ConsentRow title="3) 보호자 연락 불가 시 의료진의 즉각 처치" consentKey="consent9_priorTreatment" required />
          <ConsentRow title="4) 보건실 이용 및 처방약(학교 보관분) 투약 지원" consentKey="consent9_healthRoom" required />
        </CardContent>
      </Card>

      {/* ───── 응급 연락망 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">응급 연락망</CardTitle>
          <CardDescription>보호자 연락 불가 시 연락할 분을 등록해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(consent.emergencyContacts || []).map((c, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs">{idx + 1}순위 성명</Label>
                <Input placeholder="성명" value={c.name} onChange={(e) => updateEmergencyContact(idx, "name", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">관계</Label>
                <Input placeholder="예: 이모" value={c.relation} onChange={(e) => updateEmergencyContact(idx, "relation", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">연락처</Label>
                <Input type="tel" placeholder="010-0000-0000" value={c.phone} onChange={(e) => updateEmergencyContact(idx, "phone", e.target.value)} />
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-10 w-10" onClick={() => removeEmergencyContact(idx)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(consent.emergencyContacts || []).length < 3 && (
            <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact} className="w-full">
              <Plus className="w-4 h-4 mr-1" /> 연락처 추가
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ───── 선택 동의 (교육활동/초상권) ───── */}
      <Card>
        <CardHeader className="pb-2 bg-gray-50/50 border-b rounded-t-xl">
          <CardTitle className="text-lg">선택 동의 사항 (교육활동 참여 및 초상권)</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ConsentRow title="1) 교육활동 중 사진·영상 촬영" desc="학생 포트폴리오, 교내 행사 기록용" consentKey="consent6_photoRecord" />
          <ConsentRow title="2) 대외 홍보 및 게시" desc="학교 홈페이지, 학급 밴드, SNS, 소식지 등 (미동의 시 모자이크 처리)" consentKey="consent6_homepage" />
          <ConsentRow title="3) 특수학급 현장체험학습 참여" consentKey="consent8_specialFieldTrip" />
          <ConsentRow title="4) 통합학급 현장체험학습 참여" consentKey="consent8_inclusiveFieldTrip" />
          <ConsentRow title="5) 생존수영(안전체험 교육) 참여" desc="3·4학년 해당" consentKey="consent8_survivalSwimming" />
          <ConsentRow title="6) 수학여행 및 수련활동 참여" desc="5·6학년 해당" consentKey="consent8_schoolTrip" />
          <ConsentRow title="7) 교외 활동 시 대중교통 이용" consentKey="consent8_publicTransport" />
          <ConsentRow title="8) 공개수업·장학 참관 및 수업연구대회 출품" desc="학부모 공개수업, 동료 장학, 연구대회 출품 (미동의 시 불이익 없음)" consentKey="consent7_supervision" />
          <ConsentRow title="9) 장애인식개선 관련 활동 참여" consentKey="consent11_participation" />
        </CardContent>
      </Card>

      {/* ───── 최종 확인 및 서명 ───── */}
      <Card className="border-green-200">
        <CardHeader className="pb-4 bg-green-50/50 border-b border-green-100 rounded-t-xl">
          <CardTitle className="text-lg text-green-900">최종 확인 및 서명</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 font-medium">
            본인은 「개인정보보호법」 및 관련 법령에 의거하여 위 사항들을 충분히 숙지하였으며, 학생의 원활한 교육 지원을 위해 동의합니다.
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consentGuardianName">서명자 (보호자 성명) <span className="text-red-500">*</span></Label>
                <Input id="consentGuardianName" placeholder="예: 홍길동" value={consent.consentGuardianName} onChange={(e) => updateConsent("consentGuardianName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consentGuardianRelation">학생과의 관계</Label>
                <Input id="consentGuardianRelation" placeholder="예: 어머니" value={consent.consentGuardianRelation} onChange={(e) => updateConsent("consentGuardianRelation", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consentDate">작성일</Label>
                <Input id="consentDate" type="date" value={consent.consentDate} onChange={(e) => updateConsent("consentDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consentTypingConfirm">전자 서명 (확인 문구 입력) <span className="text-red-500">*</span></Label>
                <Input id="consentTypingConfirm" placeholder="'동의합니다' 라고 입력해주세요" value={consent.consentTypingConfirm} onChange={(e) => updateConsent("consentTypingConfirm", e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>자필 서명 (선택사항)</Label>
              <SignaturePad 
                initialSignature={consent.consentSignatureBase64}
                onSignatureChange={(base64) => updateConsent("consentSignatureBase64", base64)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
