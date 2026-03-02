"use client";

import type { ConsentForm } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "./SignaturePad";

interface Props {
  consent: ConsentForm;
  updateConsent: (key: keyof ConsentForm, value: any) => void;
}

export function Step4Consent({ consent, updateConsent }: Props) {
  const toggleConsent = (key: keyof ConsentForm, val: boolean) => {
    updateConsent(key, val);
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
            <input
              type="radio"
              className="sr-only"
              checked={consent[consentKey] === true}
              onChange={() => toggleConsent(consentKey, true)}
            />
            <span className="text-sm font-medium">동의</span>
          </label>
          <label className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors ${consent[consentKey] === false ? 'bg-red-500 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
            <input
              type="radio"
              className="sr-only"
              checked={consent[consentKey] === false}
              onChange={() => toggleConsent(consentKey, false)}
            />
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

      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="pb-2 bg-blue-50/50 border-b border-blue-100 rounded-t-xl">
          <CardTitle className="text-lg text-blue-900">필수 동의 사항</CardTitle>
          <CardDescription className="text-blue-700/70">특수교육 및 원활한 학교 생활 지원을 위해 반드시 필요한 항목입니다.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ConsentRow 
            title="1. 기본 개인정보 수집·이용" 
            desc="IEP 수립, 성적, 출결 관리 등을 위한 기본 정보" 
            consentKey="consent1" required 
          />
          <ConsentRow 
            title="2. 건강·장애 민감정보 수집·이용" 
            desc="장애유형, 복약, 알레르기 등 지원에 필수적인 정보 (개인정보보호법 제23조)" 
            consentKey="consent2" required 
          />
          <ConsentRow 
            title="3. 제3자 정보 제공" 
            desc="교육청, 특수교육지원센터 등 관련 서비스 신청용" 
            consentKey="consent3" required 
          />
          <ConsentRow 
            title="4. 교내 정보 공유 및 협력 지도" 
            desc="통합학급 담임, 보건/영양교사 등과 원활한 학교생활 지원을 위해 공유" 
            consentKey="consent4_handover" required 
          />
          <ConsentRow 
            title="5. 생명 및 안전 보호 (응급처치)" 
            desc="119 신고, 심폐소생술, 응급 이송 및 즉각 처치 등 위급 상황 대처" 
            consentKey="consent9_firstAid" required 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 bg-gray-50/50 border-b rounded-t-xl">
          <CardTitle className="text-lg">선택 동의 사항 (교육활동 참여 및 초상권)</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ConsentRow 
            title="사진·영상 촬영 및 홍보 활용" 
            desc="포트폴리오, 교내 행사 기록, 학교 홈페이지, SNS 등 대외 홍보" 
            consentKey="consent6_photoRecord" 
          />
          <ConsentRow 
            title="특수학급 현장체험학습 참여" 
            consentKey="consent8_specialFieldTrip" 
          />
          <ConsentRow 
            title="통합학급 현장체험학습 참여" 
            consentKey="consent8_inclusiveFieldTrip" 
          />
          <ConsentRow 
            title="공개수업 참관 및 연구대회 출품" 
            desc="학부모, 동료 장학 등 (미동의 시 불이익 없음)"
            consentKey="consent7_supervision" 
          />
        </CardContent>
      </Card>

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
                <Input
                  id="consentGuardianName"
                  placeholder="예: 홍길동"
                  value={consent.consentGuardianName}
                  onChange={(e) => updateConsent("consentGuardianName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consentTypingConfirm">전자 서명 (확인 문구 입력) <span className="text-red-500">*</span></Label>
                <Input
                  id="consentTypingConfirm"
                  placeholder="'동의합니다' 라고 입력해주세요"
                  value={consent.consentTypingConfirm}
                  onChange={(e) => updateConsent("consentTypingConfirm", e.target.value)}
                />
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
