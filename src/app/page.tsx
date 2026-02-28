import Link from "next/link";
import { FileText, Users, Shield, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const steps = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "1. 교사 정보 입력",
      desc: "학생명, 일시, 장소 등 기본 정보를 입력합니다.",
    },
    {
      icon: <Printer className="h-8 w-8 text-green-600" />,
      title: "2. 안내장 인쇄 + QR",
      desc: "문서1(안내장)을 인쇄하고 QR코드를 보호자에게 전달합니다.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "3. 보호자 온라인 작성",
      desc: "보호자가 QR로 접속해 의견서(문서2)와 동의서(문서3)를 작성합니다.",
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: "4. 결과 확인 및 인쇄",
      desc: "보호자가 보낸 링크를 열어 완성된 문서를 확인하고 인쇄합니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            IEP 문서 도구
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            개별화교육계획(IEP) 문서 작성·제출·관리를 위한 웹 도구
          </p>
          <p className="mt-1 text-sm text-gray-500">
            서버에 데이터를 저장하지 않습니다. 모든 정보는 URL에만 담겨 안전하게 전달됩니다.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {steps.map((step) => (
            <Card key={step.title} className="border-0 shadow-md">
              <CardContent className="flex gap-4 p-6">
                <div className="shrink-0">{step.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{step.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/teacher">
            <Button size="lg" className="text-base px-8 py-6">
              시작하기 — 교사 정보 입력
            </Button>
          </Link>
        </div>

        <footer className="mt-20 text-center text-xs text-gray-400">
          <p>
            본 도구는 「장애인 등에 대한 특수교육법」 제22조에 따른
            개별화교육계획 수립을 지원합니다.
          </p>
          <p className="mt-1">
            개인정보는 서버에 저장되지 않으며, 암호화된 URL로만 전달됩니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
