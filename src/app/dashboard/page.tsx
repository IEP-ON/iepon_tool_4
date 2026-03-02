"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, CheckCircle2, Clock, Home, FileText, ArrowLeft, Lock, Eye, Users, Copy } from "lucide-react";
import Link from "next/link";
import { sha256 } from "@/lib/encryption";

interface IepItem {
  iepId: string;
  status: string;
  schoolName: string;
  grade: string;
  classNum: string;
  teacherName: string;
  maskedStudentName: string;
  batchId: string;
  createdAt: string;
}

interface BatchGroup {
  batchId: string;
  schoolName: string;
  teacherName: string;
  createdAt: string;
  ieps: IepItem[];
}

export default function DashboardPage() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [batches, setBatches] = useState<BatchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [sessionKey, setSessionKey] = useState("");
  const [sessionBatchId, setSessionBatchId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const key = sessionStorage.getItem("iep_enc_key") || "";
    const bid = sessionStorage.getItem("iep_batch_id") || "";
    setSessionKey(key);
    setSessionBatchId(bid);
  }, []);

  const handleSearch = async () => {
    const cleaned = phone.replace(/[^0-9\-]/g, "");
    if (cleaned.replace(/[^0-9]/g, "").length < 8) {
      setError("전화번호를 정확히 입력해 주세요.");
      return;
    }
    if (pin.length !== 4 || !/^[0-9]{4}$/.test(pin)) {
      setError("숫자 4자리 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const pinHash = await sha256(pin);
      const res = await fetch(
        `/api/dashboard?phone=${encodeURIComponent(phone.trim())}&pinHash=${encodeURIComponent(pinHash)}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        const iepList: IepItem[] = data.ieps || [];
        const batchMap = new Map<string, BatchGroup>();
        for (const iep of iepList) {
          const bid = iep.batchId || "단일";
          if (!batchMap.has(bid)) {
            batchMap.set(bid, {
              batchId: bid,
              schoolName: iep.schoolName,
              teacherName: iep.teacherName,
              createdAt: iep.createdAt,
              ieps: [],
            });
          }
          batchMap.get(bid)!.ieps.push(iep);
        }
        setBatches(Array.from(batchMap.values()));
        setAuthed(true);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const getManageUrl = (iepId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (sessionKey) return `${origin}/manage?iepId=${iepId}#key=${sessionKey}`;
    return `${origin}/manage?iepId=${iepId}`;
  };

  const getPreviewUrl = (batchId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (sessionKey && sessionBatchId === batchId)
      return `${origin}/preview?batchId=${batchId}#key=${sessionKey}`;
    return `${origin}/preview?batchId=${batchId}`;
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  const totalSubmitted = batches.flatMap((b) => b.ieps).filter((i) => i.status === "submitted").length;
  const totalCount = batches.flatMap((b) => b.ieps).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-gray-900">관리 대시보드</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm"><Home className="w-4 h-4 mr-1" /> 홈</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pt-8 space-y-6">
        {!authed ? (
          <>
            <div className="text-center space-y-2 mb-2">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">관리·열람 인증</h2>
              <p className="text-gray-500 text-sm">
                문서 생성 시 등록한 <strong>연락처</strong>와 <strong>비밀번호(4자리)</strong>를 입력하세요.
              </p>
            </div>

            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">연락처 (관리 번호)</label>
                  <Input
                    placeholder="예: 02-1234-5678"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">비밀번호 (숫자 4자리)</label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="●●●●"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4)); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleSearch} disabled={loading} className="w-full h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                  {loading ? "인증 중..." : "인증 후 조회"}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* 요약 배너 */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-bold text-blue-900">총 {totalCount}명 · 제출 {totalSubmitted}명</p>
                    <p className="text-xs text-blue-700">{batches[0]?.schoolName} · {batches[0]?.teacherName} 교사</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 bg-white"
                  onClick={() => { setAuthed(false); setBatches([]); setPin(""); }}
                >
                  로그아웃
                </Button>
              </CardContent>
            </Card>

            {batches.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">생성된 문서가 없습니다.</p>
                <Link href="/teacher">
                  <Button className="mt-4" variant="outline">새 문서세트 만들기</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {batches.map((batch) => {
                  const submittedCount = batch.ieps.filter((i) => i.status === "submitted").length;
                  return (
                    <Card key={batch.batchId} className="overflow-hidden">
                      <CardHeader className="pb-3 bg-gray-50 border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            문서세트 · {formatDate(batch.createdAt)}
                            <span className="text-xs font-normal text-gray-400 font-mono">{batch.batchId.slice(0, 14)}...</span>
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {submittedCount}/{batch.ieps.length}명 제출
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => handleCopy(getPreviewUrl(batch.batchId), `preview-${batch.batchId}`)}
                            >
                              {copiedId === `preview-${batch.batchId}` ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> : <Copy className="w-3 h-3 mr-1" />}
                              안내장 링크
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {batch.ieps.map((iep, idx) => (
                            <div key={iep.iepId} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-5 text-center font-mono">{idx + 1}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 text-sm">
                                      {iep.maskedStudentName !== "(이름 없음)" ? iep.maskedStudentName : `학생 ${idx + 1}`}
                                    </span>
                                    {iep.grade && <span className="text-xs text-gray-400">{iep.grade} {iep.classNum && `${iep.classNum}반`}</span>}
                                    {iep.status === "submitted" ? (
                                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> 제출 완료
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                        <Clock className="w-3 h-3 mr-0.5" /> 대기 중
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 font-mono">{iep.iepId}</p>
                                </div>
                              </div>
                              <div className="flex gap-1.5">
                                {iep.status === "submitted" && (
                                  <a href={getManageUrl(iep.iepId)} target="_blank" rel="noreferrer">
                                    <Button size="sm" variant="default" className="text-xs h-7 bg-blue-600 hover:bg-blue-700">
                                      <Eye className="w-3 h-3 mr-1" /> 열람
                                    </Button>
                                  </a>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7"
                                  onClick={() => handleCopy(getManageUrl(iep.iepId), iep.iepId)}
                                >
                                  {copiedId === iep.iepId ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {!sessionKey && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-medium mb-1">제출된 문서 열람 안내</p>
                    <p>보호자가 제출한 문서를 복호화하려면 <strong>문서 생성 시 사용한 미리보기 URL의 암호화 키</strong>가 필요합니다. 해당 세션에서 대시보드를 열거나, 미리보기 URL을 북마크에 저장해 두세요.</p>
                  </div>
                )}

                <Link href="/teacher">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    새 문서세트 만들기
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
