"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import type { TeacherInput } from "@/lib/types";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { ParentOpinionBlankForm } from "@/components/result/ParentOpinionBlankForm";
import { ConsentBlankForm } from "@/components/result/ConsentBlankForm";
import { Button } from "@/components/ui/button";
import {
  Printer, Copy, CheckCircle2, Loader2, ArrowLeft,
  FileText, Pencil, X, ExternalLink, ChevronDown, ChevronUp, Send,
  LayoutDashboard, PenLine,
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
  const [copyCountMap, setCopyCountMap] = useState<Record<string, number>>({});
  const [isHandwrittenPrint, setIsHandwrittenPrint] = useState(false);
  const [encKey, setEncKey] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [overridesMap, setOverridesMap] = useState<Record<string, Doc1Overrides>>({});
  const [expandedEdit, setExpandedEdit] = useState<string | null>(null);
  const docRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useTutorial({
    tutorialId: "preview-page-v2",
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
          description: "전체 인쇄로 QR 포함 안내장을 인쇄하거나, 내용 편집으로 인사말·참석 방법을 수정할 수 있습니다.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: "#tutorial-handwritten-btn",
        popover: {
          title: "자필문서 출력",
          description: "QR코드·링크 사용이 어려운 가정을 위한 종이 문서입니다. 클릭하면 QR 대신 자필 제출 안내가 담긴 버전으로 인쇄됩니다. 함께 출력된 의견서·동의서에 직접 서명·작성하여 제출받으세요.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: "#tutorial-student-nav",
        popover: {
          title: "학생별 빠른 이동 및 메시지 복사",
          description: "학생 번호를 클릭하면 해당 안내장으로 스크롤됩니다. 아래 복사 버튼으로 각 학생의 메신저 링크를 바로 복사할 수 있으며, 복사 횟수가 표시됩니다.",
          side: "top",
          align: "start",
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
      setCopyCountMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setTimeout(() => setCopiedParent(null), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleHandwrittenPrint = () => {
    setIsHandwrittenPrint(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsHandwrittenPrint(false), 300);
    }, 250);
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
                id="tutorial-handwritten-btn"
                onClick={() => setIsHandwrittenPrint(!isHandwrittenPrint)}
                size="sm"
                variant="outline"
                className={
                  isHandwrittenPrint
                    ? "border-amber-500 bg-amber-100 text-amber-900 hover:bg-amber-200 shadow-none gap-1.5"
                    : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-none gap-1.5"
                }
              >
                <PenLine className="w-4 h-4" />
                <span className="hidden sm:inline">{isHandwrittenPrint ? "자필모드 끄기" : "자필모드 켜기"}</span>
              </Button>
              <Button
                onClick={() => window.print()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">인쇄하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 안내 배너 ── */}
      <div className="print:hidden max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="rounded-2xl bg-teal-50 border border-teal-100 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* 상단 메시지 */}
            <div className="w-full">
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
            {/* 학생 퀵 네비 - 가로 배치 */}
            <div id="tutorial-student-nav" className="flex flex-wrap gap-2">
              {ieps.map((iep, i) => (
                <div key={iep.iep_id} className="flex flex-col gap-1">
                  <button
                    onClick={() => scrollToDoc(iep.iep_id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 text-sm font-medium transition-colors"
                  >
                    <span className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">{i + 1}</span>
                    <span className="truncate max-w-[6rem]">{`학생 ${i + 1}`}</span>
                  </button>
                  <button
                    onClick={() => handleCopyParent(iep.iep_id, iep.teacher_data)}
                    className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      copiedParent === iep.iep_id
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-white border border-teal-100 text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    {copiedParent === iep.iep_id ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>복사</span>
                    {(copyCountMap[iep.iep_id] || 0) > 0 && (
                      <span className="ml-0.5 text-[10px] text-teal-400 font-mono">{copyCountMap[iep.iep_id]}</span>
                    )}
                  </button>
                </div>
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
      <div className="py-6 px-4 sm:px-6 print:py-0 print:px-0 max-w-5xl mx-auto">
        {ieps.map((iep, i) => (
          <div
            key={iep.iep_id}
            id={iep.iep_id}
            ref={(el) => {
              docRefs.current[iep.iep_id] = el;
            }}
            className={`flex flex-col gap-6 scroll-mt-24 ${
              isHandwrittenPrint && i > 0 ? "print:hidden" : ""
            }`}
          >
            {/* 문서 상단 툴바 (화면에만) */}
            <div className="print:hidden flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {`학생 ${i + 1}`}
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

            {/* 문서 본체 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden ring-1 ring-gray-200/60 print:shadow-none print:rounded-none print:ring-0">
              <ResultDoc1 
                teacher={iep.teacher_data} 
                formUrl={getFormUrl(iep.iep_id)} 
                overrides={overridesMap[iep.iep_id]} 
                handwrittenMode={isHandwrittenPrint}
                isEditing={editMode}
                onUpdate={(key, value) => updateOverride(iep.iep_id, key, value)}
              />
            </div>
            
            {/* 자필문서 인쇄 시 의견서·동의서 빈 양식 추가 */}
            {isHandwrittenPrint && (
              <>
                <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden ring-1 ring-gray-200/60 print:shadow-none print:rounded-none print:ring-0 print:mt-0 print:break-before-page">
                  <ParentOpinionBlankForm teacher={iep.teacher_data} />
                </div>
                <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden ring-1 ring-gray-200/60 print:shadow-none print:rounded-none print:ring-0 print:mt-0 print:break-before-page">
                  <ConsentBlankForm teacher={iep.teacher_data} />
                </div>
              </>
            )}
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
