import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">IEP-ON</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/print-empty">
              <Button variant="ghost" className="text-gray-600">
                <Printer className="w-4 h-4 mr-2" />
                빈 양식 인쇄
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="max-w-3xl w-full text-center space-y-8 mb-16">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 mb-4">
            특수교육대상자 개별화교육계획(IEP) 지원 시스템
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            가장 안전하고 스마트한<br />
            <span className="text-blue-600">IEP 보호자 의견 수렴</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            협의회 안내장 발송부터 보호자 의견서 및 동의서 취합까지.<br className="hidden sm:inline" />
            종이 문서 없이 스마트폰 하나로 빠르고 안전하게 처리하세요.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/teacher">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                새 문서세트 만들기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full border-2 hover:bg-gray-50 transition-all">
                <FileText className="mr-2 w-5 h-5" />
                제출 현황 확인
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>간편한 폼 생성</CardTitle>
              <CardDescription className="text-sm mt-2">
                기본 정보만 입력하면 학부모님께 전달할 협의회 안내장과 QR코드가 즉시 생성됩니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <CardTitle>종단간 암호화 보안</CardTitle>
              <CardDescription className="text-sm mt-2">
                민감한 학생 정보는 브라우저에서 AES-256으로 강력하게 암호화되어 저장됩니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Printer className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>원클릭 문서 출력</CardTitle>
              <CardDescription className="text-sm mt-2">
                학부모님이 제출을 완료하면, 즉시 깔끔하게 포맷팅된 결과 문서를 인쇄할 수 있습니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        <p>IEP-ON Tool4 © {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </div>
  );
}
