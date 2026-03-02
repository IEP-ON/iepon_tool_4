"use client";

import type { ConsentForm, TeacherInput } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Info, AlertCircle, FileCheck, Shield, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { SignaturePad } from "./SignaturePad";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Props {
  consent: ConsentForm;
  updateConsent: (key: keyof ConsentForm, value: any) => void;
  teacher: TeacherInput;
}

export function Step4Consent({ consent, updateConsent, teacher }: Props) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showTypoAlert, setShowTypoAlert] = useState(false);

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleConsent = (key: keyof ConsentForm, val: boolean) => {
    updateConsent(key, val);
  };

  const handleTypingConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val && val !== "동의합니다") {
      setShowTypoAlert(true);
    }
  };

  const autoFixTypo = () => {
    updateConsent("consentTypingConfirm", "동의합니다");
    setShowTypoAlert(false);
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
    detail,
    consentKey, 
    required = false,
    disagreeWarning
  }: { 
    title: string; 
    desc?: string;
    detail?: string;
    consentKey: keyof ConsentForm; 
    required?: boolean;
    disagreeWarning?: string;
  }) => {
    const isExpanded = expandedItems[consentKey];
    const isDisagreed = consent[consentKey] === false;
    
    return (
      <div className="py-4 border-b last:border-b-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <button 
              type="button"
              onClick={() => toggleExpand(consentKey)}
              className="flex items-center text-left w-full group"
            >
              <p className="font-medium text-sm text-gray-900 leading-relaxed pr-2">
                {title} {required && <span className="text-red-500 text-xs ml-1">(필수)</span>}
              </p>
              {(desc || detail) && (
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-auto">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              )}
            </button>
            
            {(desc || detail) && isExpanded && (
              <div className="mt-2.5 animate-in slide-in-from-top-1 fade-in duration-200">
                {desc && (
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{desc}</p>
                )}
                {detail && (
                  <div className="flex items-start gap-1.5 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-md border border-gray-100">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                    <span className="leading-relaxed">{detail}</span>
                  </div>
                )}
              </div>
            )}

            {isDisagreed && disagreeWarning && (
              <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-md border border-red-100 animate-in slide-in-from-top-2 fade-in">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span className="leading-relaxed font-medium">{disagreeWarning}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 shrink-0 bg-gray-50 p-1.5 rounded-lg w-fit mt-1 sm:mt-0">
            <label className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-all ${consent[consentKey] === true ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-200 text-gray-700'}`}>
              <input type="radio" className="sr-only" checked={consent[consentKey] === true} onChange={() => toggleConsent(consentKey, true)} />
              <span className="text-sm font-medium">동의</span>
            </label>
            <label className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-all ${consent[consentKey] === false ? 'bg-red-500 text-white shadow-sm' : 'hover:bg-gray-200 text-gray-700'}`}>
              <input type="radio" className="sr-only" checked={consent[consentKey] === false} onChange={() => toggleConsent(consentKey, false)} />
              <span className="text-sm font-medium">미동의</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">특수교육대상자 교육지원 및 정보제공 동의서</h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {teacher.schoolName} · 「장애인 등에 대한 특수교육법」 및 「개인정보보호법」에 근거
        </p>
        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          교육 지원에 필요한 정보 제공 및 활동 참여에 동의해주세요. 각 항목을 신중히 검토하신 후 선택해 주시기 바랍니다.
        </p>
      </div>

      {/* ───── 필수 동의 ───── */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="pb-3 bg-blue-50/50 border-b border-blue-100 rounded-t-xl">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-lg text-blue-900">1. 필수 동의 사항</CardTitle>
              <CardDescription className="text-blue-700/80 mt-1.5 leading-relaxed">
                특수교육 및 원활한 학교 생활 지원을 위해 반드시 필요한 항목입니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ConsentRow 
            title="1) 기본 개인정보 수집·이용 (IEP 수립, 성적·출결 관리 등)" 
            detail="성명, 생년월일, 연락처, 가정환경, 특수교육 선정 현황 등"
            consentKey="consent1" 
            required 
            disagreeWarning="기본 정보 수집 미동의 시, 개별화교육계획(IEP) 수립 및 특수교육 지원이 불가능하여 학교 생활에 심각한 어려움이 발생할 수 있습니다."
          />
          <ConsentRow 
            title="2) 건강·장애 민감정보 수집·이용" 
            detail="장애유형/정도, 복약정보, 알레르기, 발작이력, 감각특성 등 (개인정보보호법 제23조)"
            consentKey="consent2" 
            required 
            disagreeWarning="건강 정보 미동의 시, 발작, 알레르기 등 돌발 상황에서 적절하고 신속한 대처가 불가능할 수 있습니다."
          />
          <ConsentRow 
            title="3) 제3자 정보 제공 (교육청, 특수교육지원센터, 치료지원기관 등)" 
            detail="관련 서비스 신청, 응급상황 대처, 진로·직업 연계 목적"
            consentKey="consent3" 
            required 
            disagreeWarning="제3자 정보 제공 미동의 시, 방과후학교, 치료지원 등 교육청 연계 서비스 신청 및 지원이 제한됩니다."
          />
          <ConsentRow 
            title="4) 교내 정보 공유 및 협력 지도 (통합학급 담임, 교과·보건·영양교사 등)" 
            detail="학교생활 적응 지원, 통합교육 협력, 급식 지도, 응급처치 대비"
            consentKey="consent4_handover" 
            required 
            disagreeWarning="교내 정보 공유 미동의 시, 통합학급 생활, 급식, 보건실 이용 등에서 교직원 간 협력이 어려워 학생 지원에 차질이 생깁니다."
          />
        </CardContent>
      </Card>

      {/* ───── 생명·안전 (응급처치) ───── */}
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="pb-3 bg-red-50/50 border-b border-red-100 rounded-t-xl">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <CardTitle className="text-lg text-red-900">2. 생명 및 안전 보호 (응급처치 동의 — 필수)</CardTitle>
              <CardDescription className="text-red-700/80 mt-1.5 leading-relaxed">
                위급 상황 시 신속한 대처를 위해 반드시 필요합니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ConsentRow 
            title="1) 교직원에 의한 1차 응급처치 (심폐소생술 등) 시행" 
            consentKey="consent9_firstAid" 
            required 
            disagreeWarning="응급처치 미동의 시, 위급 상황에서 교직원의 즉각적인 구호 조치가 법적으로 제한되어 학생의 생명이 위험해질 수 있습니다."
          />
          <ConsentRow 
            title="2) 응급 상황 시 119 신고 및 병원 이송 조치" 
            detail="보호자 연락 지연 시 학교 판단하에 최우선으로 응급조치를 실시함에 동의"
            consentKey="consent9_119" 
            required 
            disagreeWarning="미동의 시, 보호자와 연락이 닿을 때까지 119 신고 및 병원 이송이 지연되어 골든타임을 놓칠 수 있습니다."
          />
          <ConsentRow 
            title="3) 보호자 연락 불가 시 의료진의 즉각 처치 동의" 
            consentKey="consent9_priorTreatment" 
            required 
            disagreeWarning="병원 이송 후에도 보호자 연락이 닿기 전까지는 의료진의 수술 등 즉각적인 의료 처치가 제한될 수 있습니다."
          />
          <ConsentRow 
            title="4) 보건실 이용 및 보건교사 처치, 처방약(학교 보관분) 투약 지원" 
            consentKey="consent9_healthRoom" 
            required 
            disagreeWarning="보건실 처치 미동의 시, 가벼운 상처나 질병 발생 시에도 교내에서 기본적인 처치나 약 복용이 불가능합니다."
          />
        </CardContent>
      </Card>

      {/* ───── 응급 연락망 ───── */}
      <Card className="border-orange-200">
        <CardHeader className="pb-4 bg-orange-50/30">
          <CardTitle className="text-lg text-orange-900">응급 연락망</CardTitle>
          <CardDescription className="text-orange-700/80 leading-relaxed">보호자 연락 불가 시 연락할 분을 등록해주세요. (최대 3명)</CardDescription>
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
        <CardHeader className="pb-3 bg-gray-50/50 border-b rounded-t-xl">
          <div className="flex items-start gap-2">
            <FileCheck className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <CardTitle className="text-lg text-gray-900">3. 교육활동 참여 및 초상권 (선택/권장)</CardTitle>
              <CardDescription className="mt-1.5 leading-relaxed">
                학생의 교육활동 참여를 위한 선택 사항입니다. 미동의 시에도 불이익은 없습니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ConsentRow 
            title="1) 교육활동 중 사진·영상 촬영 (학생 포트폴리오, 교내 행사 기록용)" 
            consentKey="consent6_photoRecord" 
            disagreeWarning="미동의 시, 개인 포트폴리오 제작 및 앨범 등에서 학생의 활동 모습이 제외될 수 있습니다."
          />
          <ConsentRow 
            title="2) 대외 홍보 및 게시 (학교 홈페이지, 학급 밴드, SNS, 소식지 등)" 
            detail="미동의 시 모자이크 처리 또는 뒷모습 위주로 활용됩니다."
            consentKey="consent6_homepage" 
            disagreeWarning="미동의 시, 모든 외부 공개 자료에서 학생의 얼굴은 모자이크 처리되거나 노출되지 않습니다."
          />
        </CardContent>
      </Card>

      {/* ───── 최종 확인 및 서명 ───── */}
      <Card className="border-green-200">
        <CardHeader className="pb-4 bg-green-50/50 border-b border-green-100 rounded-t-xl">
          <CardTitle className="text-lg text-green-900">최종 확인 및 서명</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              본인은 「개인정보보호법」 및 관련 법령에 의거하여 위 사항들을 충분히 숙지하였으며, 학생의 원활한 교육 지원을 위해 동의합니다.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="consentGuardianName">서명자 (보호자 성명) <span className="text-red-500">*</span></Label>
                <Input id="consentGuardianName" placeholder="예: 홍길동" value={consent.consentGuardianName} onChange={(e) => updateConsent("consentGuardianName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consentTypingConfirm">
                  전자 서명 (확인 문구 입력) <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-1.5">
                  <Input 
                    id="consentTypingConfirm" 
                    placeholder="'동의합니다' 라고 정확히 입력해주세요" 
                    value={consent.consentTypingConfirm} 
                    onChange={(e) => updateConsent("consentTypingConfirm", e.target.value)} 
                    onBlur={handleTypingConfirmBlur}
                    className={consent.consentTypingConfirm && consent.consentTypingConfirm !== "동의합니다" ? "border-red-400 focus-visible:ring-red-400" : ""}
                  />
                  {consent.consentTypingConfirm && consent.consentTypingConfirm !== "동의합니다" && (
                    <p className="text-xs text-red-500 font-medium">정확히 '동의합니다'라고 입력해주세요.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>자필 서명</Label>
              <SignaturePad 
                initialSignature={consent.consentSignatureBase64}
                onSignatureChange={(base64) => updateConsent("consentSignatureBase64", base64)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── 하단 안내 문구 ───── */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-600 leading-relaxed">
          ※ 수집된 정보는 특수교육 지원 목적으로만 사용되며, 목적 달성 시 안전하게 파기됩니다.
        </p>
      </div>

      <AlertDialog open={showTypoAlert} onOpenChange={setShowTypoAlert}>
        <AlertDialogContent className="max-w-xs rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">입력 확인</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              혹시 <b>"동의합니다"</b>를 입력하려 하셨나요?<br />
              오타가 발생한 것 같습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row sm:justify-center gap-2 mt-2">
            <AlertDialogCancel className="mt-0 flex-1">직접 수정할게요</AlertDialogCancel>
            <AlertDialogAction onClick={autoFixTypo} className="flex-1 bg-blue-600 hover:bg-blue-700">네, 수정해주세요</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
