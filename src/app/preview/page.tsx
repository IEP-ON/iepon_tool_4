"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import type { TeacherInput } from "@/lib/types";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { Button } from "@/components/ui/button";
import {
  Printer, Copy, CheckCircle2, Loader2, ArrowLeft,
  FileText, Pencil, X, ExternalLink, ChevronDown, ChevronUp, Send,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useTutorial } from "@/hooks/useTutorial";

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
  const [expandedEdit, setExpandedEdit] = useState<string | null>(null);
  const docRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useTutorial({
    tutorialId: "preview-page-v1",
    steps: [
      {
        element: "#tutorial-preview-header",
        popover: {
          title: "안내장 미리보기 화면",
          description: "생성된 안내장을 확인하고 인쇄하거나 편집할 수 있습니다.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tutorial-preview-actions",
        popover: {
          title: "인쇄 및 편집 버튼",
          description: "전체 인쇄 버튼으로 모든 안내장을 한 번에 인쇄하거나, 내용 편집으로 인사말과 참석 방법을 수정할 수 있습니다.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: "#tutorial-message-copy",
        popover: {
          title: "메시지 복사",
          description: "이 버튼을 클릭하면 학부모에게 보낼 안내 메시지가 클립보드에 복사됩니다. 메신저로 전달할 때 사용하세요.",
          side: "left",
          align: "center",
        },
      },
      {
        element: "#tutorial-dashboard-link",
        popover: {
          title: "대시보드로 이동",
          description: "학부모의 제출 현황을 확인하고 관리할 수 있는 대시보드로 이동합니다.",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-center">안내장을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-red-100/50">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-2">오류가 발생했습니다</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/teacher">
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const getFormUrl = (id: string) =>
    encKey ? `${origin}/form?iepId=${id}#key=${encKey}` : `${origin}/form?iepId=${id}`;

  const dashboardUrl = `${origin}/dashboard`;

  const handleCopyParent = async (id: string, teacher: TeacherInput) => {
    try {
      const url = getFormUrl(id);
      const message = `[개별화교육지원팀 협의회 안내]

안녕하세요. ${teacher.schoolName} 특수학급 담임교사 ${teacher.teacherName}입니다.
새 학기 우리 아이의 개별화교육계획(IEP) 수립을 위한 협의회 안내를 드립니다.

오늘 학생 편으로 종이 안내장을 발송해 드렸습니다.
안내장에 있는 QR코드로 스마트폰에서 쉽게 참석 여부 및 의견을 제출하실 수 있습니다.

혹시 종이 안내장을 확인하시기 어렵거나 QR코드 스캔이 불편하신 경우, 아래 링크를 누르시면 동일한 화면으로 연결됩니다.

▶ 온라인 제출 링크:
${url}

▶ 제출 기한:
${teacher.submissionDeadline ? new Date(teacher.submissionDeadline).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '안내된 기한'}까지

작성해주신 내용은 암호화되어 안전하게 전송됩니다.
감사합니다.`;

      await navigator.clipboard.writeText(message);
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

  const scrollToDoc = (id: string) => {
    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* ── 헤더 ── */}
      <div className="print:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" id="tutorial-preview-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* 좌측: 뒤로가기 + 제목 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link
                href="/teacher"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-[18px] h-[18px]" />
              </Link>
              <div className="flex items-center gap-2.5 min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">안내장 미리보기</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 tabular-nums">
                  {ieps.length}명
                </span>
              </div>
            </div>

            {/* 우측: 액션 버튼 */}
            <div className="flex items-center gap-2" id="tutorial-preview-actions">
              <Link href={dashboardUrl} className="hidden sm:flex" id="tutorial-dashboard-link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-900 gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">대시보드</span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setEditMode((v) => !v); if (editMode) setExpandedEdit(null); }}
                className={
                  editMode
                    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-none gap-1.5"
                    : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-none gap-1.5"
                }
              >
                {editMode ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{editMode ? "편집 종료" : "내용 편집"}</span>
              </Button>
              <Button
                onClick={() => window.print()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">전체 인쇄</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 안내 배너 ── */}
      <div className="print:hidden max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="rounded-2xl bg-teal-50 border border-teal-100 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* 좌측 메시지 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5 text-teal-700" />
                </div>
                <h3 className="font-bold text-lg text-teal-900">학생 {ieps.length}명 분의 안내장 생성 완료</h3>
              </div>
              <p className="text-teal-800 text-sm leading-relaxed">
                일괄 인쇄하여 학부모님께 배부하거나, 각 학생별 <strong className="text-teal-900 font-semibold">메시지 복사</strong> 버튼으로 메신저에 전달하세요.
              </p>
            </div>
            {/* 우측 퀵 네비 */}
            <div className="flex flex-wrap gap-1.5 sm:flex-col sm:items-end shrink-0">
              {ieps.map((iep, i) => (
                <button
                  key={iep.iep_id}
                  onClick={() => scrollToDoc(iep.iep_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 text-sm font-medium transition-colors"
                >
                  <span className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">{i + 1}</span>
                  <span className="truncate max-w-[8rem]">{`학생 ${i + 1}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 하단 안내 */}
          <div className="mt-4 pt-3.5 border-t border-teal-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <span className="text-teal-700">
              <strong className="text-teal-900">관리 대시보드</strong>에서 제출 현황을 확인하고 관리할 수 있습니다.
            </span>
            <Link href={dashboardUrl} className="sm:hidden">
              <button className="inline-flex items-center gap-1.5 text-teal-800 font-semibold hover:underline underline-offset-2">
                대시보드 이동 <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* ── 문서 목록 ── */}
      <div className="py-6 px-4 sm:px-6 print:py-0 print:px-0">
        {ieps.map((iep, index) => (
          <div
            key={iep.iep_id}
            ref={(el) => { docRefs.current[iep.iep_id] = el; }}
            className="max-w-[210mm] mx-auto mb-8 print:mb-0 print:break-after-page scroll-mt-20"
          >
            {/* 문서 상단 툴바 (화면에만) */}
            <div className="print:hidden flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {`학생 ${index + 1}`}
                </span>
                {iep.status === "submitted" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3" /> 제출 완료
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editMode && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedEdit(expandedEdit === iep.iep_id ? null : iep.iep_id)}
                    className={
                      expandedEdit === iep.iep_id
                        ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 gap-1.5 shadow-none"
                        : "border-gray-200 text-gray-500 hover:text-gray-700 gap-1.5 shadow-none"
                    }
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    편집
                    {expandedEdit === iep.iep_id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </Button>
                )}
                <Button
                  size="sm"
                  id="tutorial-message-copy"
                  onClick={() => handleCopyParent(iep.iep_id, iep.teacher_data)}
                  className={
                    copiedParent === iep.iep_id
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm transition-all"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 gap-1.5 shadow-sm transition-all"
                  }
                >
                  {copiedParent === iep.iep_id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      복사 완료
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      메시지 복사
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 인라인 편집 패널 */}
            {editMode && expandedEdit === iep.iep_id && (
              <div className="print:hidden mb-3 bg-amber-50/80 border border-amber-200 rounded-xl p-4 sm:p-5 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Pencil className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 text-sm">안내장 내용 편집</h4>
                  <span className="text-xs text-amber-500 ml-auto">수정 사항은 아래 문서에 즉시 반영됩니다</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">인사말 본문 <span className="text-gray-400">(최대 300자)</span></label>
                    <textarea
                      className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400 transition-shadow"
                      rows={3}
                      maxLength={300}
                      value={overridesMap[iep.iep_id]?.introText ?? ""}
                      placeholder="기본 인사말 유지"
                      onChange={(e) => updateOverride(iep.iep_id, "introText", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">예상 소요시간 <span className="text-gray-400">(최대 30자)</span></label>
                      <input
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400 transition-shadow"
                        maxLength={30}
                        value={overridesMap[iep.iep_id]?.estimatedTime ?? ""}
                        placeholder="약 30~40분"
                        onChange={(e) => updateOverride(iep.iep_id, "estimatedTime", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">① 학교 방문 설명</label>
                      <input
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400 transition-shadow"
                        maxLength={100}
                        value={overridesMap[iep.iep_id]?.method1Desc ?? ""}
                        placeholder="기본 안내 유지"
                        onChange={(e) => updateOverride(iep.iep_id, "method1Desc", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">② 전화 상담 설명</label>
                      <input
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400 transition-shadow"
                        maxLength={100}
                        value={overridesMap[iep.iep_id]?.method2Desc ?? ""}
                        placeholder="기본 안내 유지"
                        onChange={(e) => updateOverride(iep.iep_id, "method2Desc", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">③ 서면 참여 설명</label>
                      <input
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400 transition-shadow"
                        maxLength={100}
                        value={overridesMap[iep.iep_id]?.method3Desc ?? ""}
                        placeholder="기본 안내 유지"
                        onChange={(e) => updateOverride(iep.iep_id, "method3Desc", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 문서 본체 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden ring-1 ring-gray-200/60 print:shadow-none print:rounded-none print:ring-0">
              <ResultDoc1 teacher={iep.teacher_data} formUrl={getFormUrl(iep.iep_id)} overrides={overridesMap[iep.iep_id]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-center">안내장을 불러오는 중...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
