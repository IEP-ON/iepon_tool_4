"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TeacherInput } from "@/lib/types";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Copy, CheckCircle2, Loader2, ArrowLeft, Users, Pencil, X } from "lucide-react";
import Link from "next/link";

interface BatchIep {
  iep_id: string;
  status: string;
  teacher_data: TeacherInput;
}

export interface Doc1Overrides {
  introText?: string;
  estimatedTime?: string;
  method1Desc?: string;
  method2Desc?: string;
  method3Desc?: string;
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId"); // 기존 단일 호환용
  const batchId = searchParams.get("batchId");
  const [ieps, setIeps] = useState<BatchIep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedParent, setCopiedParent] = useState<string | null>(null);
  const [encKey, setEncKey] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [overridesMap, setOverridesMap] = useState<Record<string, Doc1Overrides>>({});

  useEffect(() => {
    const hash = window.location.hash;
    const keyMatch = hash.match(/key=([a-f0-9]+)/);
    if (keyMatch) {
      setEncKey(keyMatch[1]);
      sessionStorage.setItem("iep_enc_key", keyMatch[1]);
    }
    if (batchId) sessionStorage.setItem("iep_batch_id", batchId);
  }, [batchId]);

  useEffect(() => {
    if (!iepId && !batchId) {
      setError("문서 ID가 없습니다.");
      setLoading(false);
      return;
    }

    if (batchId) {
      fetch(`/api/batch/${batchId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setIeps(data.ieps || []);
          }
        })
        .catch(() => setError("데이터 로드에 실패했습니다."))
        .finally(() => setLoading(false));
    } else if (iepId) {
      fetch(`/api/iep/${iepId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setIeps([{ iep_id: iepId, status: data.status, teacher_data: data.teacherData }]);
          }
        })
        .catch(() => setError("데이터 로드에 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [iepId, batchId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">안내장을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold text-xl">!</span>
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <Link href="/teacher">
            <Button className="mt-6 w-full" variant="outline">돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const getFormUrl = (id: string) =>
    encKey ? `${origin}/form?iepId=${id}#key=${encKey}` : `${origin}/form?iepId=${id}`;

  const dashboardUrl = `${origin}/dashboard`;

  const handleCopyParent = async (id: string) => {
    try {
      await navigator.clipboard.writeText(getFormUrl(id));
      setCopiedParent(id);
      setTimeout(() => setCopiedParent(null), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const updateOverride = (iepId: string, key: keyof Doc1Overrides, value: string) => {
    setOverridesMap((prev) => ({
      ...prev,
      [iepId]: { ...prev[iepId], [key]: value },
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/teacher" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">안내장 미리보기 (총 {ieps.length}명)</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              전체 인쇄
            </Button>
          </div>
        </div>
      </div>

      {/* 교사용 안내 */}
      <div className="print:hidden max-w-4xl mx-auto px-4 pt-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 text-base">학생 {ieps.length}명 분의 안내장이 생성되었습니다.</h3>
                <p className="text-sm text-blue-800 mt-1 mb-3">
                  아래 안내장을 일괄 인쇄하여 학부모님께 배부하시거나, 개별 링크를 복사하여 메신저로 전달하실 수 있습니다.
                </p>
                <div className="bg-white/60 p-3 rounded-md text-sm border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>추후 <strong>관리 대시보드</strong>에서 연락처+비밀번호로 열람·관리가 가능합니다.</span>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode((v) => !v)}
                      className={editMode ? "border-orange-400 text-orange-700 bg-orange-50" : "border-gray-300 text-gray-700 bg-white"}
                    >
                      {editMode ? <><X className="w-3 h-3 mr-1" />편집 종료</> : <><Pencil className="w-3 h-3 mr-1" />내용 편집</>}
                    </Button>
                    <Link href={dashboardUrl}>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 bg-white">
                        대시보드 이동
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="py-8 px-4 print:py-0 print:px-0 bg-gray-100">
        {ieps.map((iep, index) => (
          <div key={iep.iep_id} className="max-w-[210mm] mx-auto bg-white shadow-lg mb-8 print:shadow-none print:mb-0 print:break-after-page relative">
            
            {/* 링크 복사 버튼 (화면에만 보임) */}
            <div className="print:hidden absolute top-4 right-4 z-10">
              <Button
                size="sm"
                onClick={() => handleCopyParent(iep.iep_id)}
                variant={copiedParent === iep.iep_id ? "default" : "outline"}
                className={copiedParent === iep.iep_id ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white shadow-sm"}
              >
                {copiedParent === iep.iep_id ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copiedParent === iep.iep_id ? "복사됨" : `학생 ${index + 1} 링크 복사`}
              </Button>
            </div>

            {/* 개별 문서 렌더링 */}
            {editMode && (
              <div className="print:hidden absolute top-12 right-4 z-10 bg-white border border-orange-200 rounded-xl shadow-lg p-3 w-72 space-y-2 text-xs">
                <p className="font-semibold text-orange-700 mb-1">편집 가능 항목</p>
                <div>
                  <label className="text-gray-500 block mb-0.5">인사말 본문 (최대 150자)</label>
                  <textarea
                    className="w-full border rounded p-1.5 text-[11px] resize-none focus:outline-none focus:ring-1 focus:ring-orange-400"
                    rows={3}
                    maxLength={150}
                    value={overridesMap[iep.iep_id]?.introText ?? ""}
                    placeholder="기본 인사말 유지"
                    onChange={(e) => updateOverride(iep.iep_id, "introText", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-0.5">예상 소요시간 (최대 20자)</label>
                  <input
                    className="w-full border rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-400"
                    maxLength={20}
                    value={overridesMap[iep.iep_id]?.estimatedTime ?? ""}
                    placeholder="약 30~40분"
                    onChange={(e) => updateOverride(iep.iep_id, "estimatedTime", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-0.5">① 학교 방문 설명 (최대 60자)</label>
                  <input className="w-full border rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-400" maxLength={60} value={overridesMap[iep.iep_id]?.method1Desc ?? ""} placeholder="기본 안내 유지" onChange={(e) => updateOverride(iep.iep_id, "method1Desc", e.target.value)} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-0.5">② 전화 상담 설명 (최대 60자)</label>
                  <input className="w-full border rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-400" maxLength={60} value={overridesMap[iep.iep_id]?.method2Desc ?? ""} placeholder="기본 안내 유지" onChange={(e) => updateOverride(iep.iep_id, "method2Desc", e.target.value)} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-0.5">③ 서면 참여 설명 (최대 60자)</label>
                  <input className="w-full border rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-400" maxLength={60} value={overridesMap[iep.iep_id]?.method3Desc ?? ""} placeholder="기본 안내 유지" onChange={(e) => updateOverride(iep.iep_id, "method3Desc", e.target.value)} />
                </div>
              </div>
            )}
            <ResultDoc1 teacher={iep.teacher_data} formUrl={getFormUrl(iep.iep_id)} overrides={overridesMap[iep.iep_id]} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">안내장을 불러오는 중...</p>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
