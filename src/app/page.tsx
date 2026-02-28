import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Printer, Smartphone, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans selection:bg-blue-200">
      <header className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
          <CheckCircle className="w-4 h-4" />
          <span>서버 저장 없는 안전한 암호화 방식</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 break-keep">
          개별화교육계획(IEP) <br className="hidden md:block" />
          <span className="text-blue-600">스마트 지원 도구</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto break-keep">
          특수교육대상학생을 위한 IEP 협의회 안내장부터 
          보호자 의견서 및 동의서 취합까지 한 번에 해결하세요.
        </p>
        <Link href="/teacher" className="inline-block">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            시작하기 — 교사 정보 입력 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </header>

      <main className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">이용 방법 안내</h2>
            <p className="text-gray-600">4단계의 간단한 절차로 서류 업무를 자동화합니다.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md bg-gray-50/50 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110" />
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-blue-600 relative z-10">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl relative z-10">1. 교사 정보 입력</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 relative z-10">
                학생명, 협의회 일시, 장소 등 기본적인 안내장 정보를 입력합니다.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-gray-50/50 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110" />
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-indigo-600 relative z-10">
                  <Printer className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl relative z-10">2. 안내장 & QR 인쇄</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 relative z-10">
                자동 생성된 문서1(안내장)을 인쇄하여 학생 편으로 가정에 보냅니다. QR코드가 포함되어 있습니다.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-gray-50/50 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110" />
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-purple-600 relative z-10">
                  <Smartphone className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl relative z-10">3. 보호자 스마트 제출</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 relative z-10">
                보호자는 스마트폰으로 QR을 스캔하여 모바일 폼으로 의견서와 동의서를 쉽고 빠르게 작성합니다.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-gray-50/50 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110" />
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-green-600 relative z-10">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl relative z-10">4. 결과 취합 및 인쇄</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 relative z-10">
                보호자가 전송한 링크를 열면 완벽하게 포맷팅된 문서 1, 2, 3을 한 번에 확인하고 인쇄할 수 있습니다.
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 text-center text-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-gray-300 font-medium">본 도구는 「장애인 등에 대한 특수교육법」 제22조에 따른 개별화교육계획 수립을 지원합니다.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-gray-500">
            <p>🔒 100% Stateless: 서버에 어떠한 데이터도 저장하지 않습니다.</p>
            <p>🔑 종단간 암호화(AES-GCM): 데이터는 안전하게 보호됩니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
