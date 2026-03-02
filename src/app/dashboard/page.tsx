"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, CheckCircle2, Clock, Home, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface IepItem {
  iepId: string;
  status: string;
  schoolName: string;
  grade: string;
  classNum: string;
  teacherName: string;
  maskedStudentName: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [phone, setPhone] = useState("");
  const [ieps, setIeps] = useState<IepItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length < 8) {
      setError("전화번호를 정확히 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setIeps(data.ieps || []);
        setSearched(true);
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-gray-900">제출 현황 확인</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm"><Home className="w-4 h-4 mr-1" /> 홈</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pt-8 space-y-6">
        <div className="text-center space-y-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">나의 IEP 문서 현황</h2>
          <p className="text-gray-500 text-sm">
            문서 생성 시 입력한 전화번호로 조회할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="전화번호 입력 (예: 010-1234-5678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading} className="shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
                {loading ? "" : "조회"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {searched && ieps.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">해당 전화번호로 생성된 문서가 없습니다.</p>
            <Link href="/teacher">
              <Button className="mt-4" variant="outline">새 문서세트 만들기</Button>
            </Link>
          </div>
        )}

        {ieps.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">총 {ieps.length}건</p>
            {ieps.map((iep) => (
              <Card key={iep.iepId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{iep.maskedStudentName}</span>
                        <span className="text-xs text-gray-400">{iep.grade} {iep.classNum}반</span>
                        {iep.status === "submitted" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" />
                            제출 완료
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <Clock className="w-3 h-3 mr-0.5" />
                            대기 중
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {iep.schoolName} · 생성일 {formatDate(iep.createdAt)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 text-right ml-4">
                      <p className="font-mono">{iep.iepId}</p>
                      <p className="mt-1 text-gray-500">관리 링크로 열람</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">결과 열람 방법</p>
              <p>제출된 문서의 상세 내용을 보려면, 문서 생성 시 받은 <strong>교사용 관리 링크</strong>를 사용하세요. 관리 링크에 포함된 암호화 키로만 결과를 복호화할 수 있습니다.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
