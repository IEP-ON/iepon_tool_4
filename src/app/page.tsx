"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Trash2, Lock, FileText, QrCode, ClipboardCheck, Printer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FLOW_STEPS = [
  {
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    bg: "bg-blue-100",
    label: "① 교사 입력",
    desc: "학교·일정·담당 교사 정보 입력",
  },
  {
    icon: <QrCode className="w-6 h-6 text-purple-600" />,
    bg: "bg-purple-100",
    label: "② 안내장 + QR 생성",
    desc: "학부모 배포용 안내장과 개별 QR코드 자동 생성",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6 text-green-600" />,
    bg: "bg-green-100",
    label: "③ 학부모 의견 작성",
    desc: "QR 스캔 → 스마트폰으로 의견서·동의서 작성 및 전자서명",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
    bg: "bg-orange-100",
    label: "④ 암호화 저장",
    desc: "제출 즉시 AES-256-GCM 암호화 후 서버 저장 (개발자도 열람 불가)",
  },
  {
    icon: <Printer className="w-6 h-6 text-gray-600" />,
    bg: "bg-gray-100",
    label: "⑤ 열람 및 인쇄",
    desc: "교사 전용 대시보드에서 결과 확인 및 IEP 문서 출력",
  },
];

export default function HomePage() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const router = useRouter();
  const allChecked = checked1 && checked2;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="IEP-ON Logo" 
              width={120} 
              height={32} 
              priority
              className="h-8 w-auto"
            />
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            제출 현황 확인 →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12 space-y-8">

        {/* Hero */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            특수교육대상자 개별화교육지원팀 협의회 보조도구
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            가장 안전하고 스마트한<br className="sm:hidden" /> IEP 보호자 의견 수렴
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            안내장 발송부터 의견서 취합까지 종이 없이 스마트폰으로 안전하게 처리하세요.<br className="hidden sm:block"/>
            본 서비스는 특수교사의 행정 업무 부담을 덜기 위해 무료로 배포됩니다.
          </p>
        </div>

        {/* 상단 배치: 동의 체크박스 + 시작 버튼 */}
        <section className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transform transition-all hover:shadow-xl">
          <div className="flex items-center gap-2 border-b pb-4">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">서비스 이용 동의 및 시작</h2>
          </div>
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked1}
                onChange={(e) => setChecked1(e.target.checked)}
                className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer shrink-0 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                <strong>[필수]</strong> 하단의 서비스 안내 및 개인정보 처리 방침을 모두 읽었으며,
                이 도구를 학교 행정 편의 목적으로 사용함에 따르는 권리와 책임이 사용자(특수교사)에게 있음을 인지하고 동의합니다.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked2}
                onChange={(e) => setChecked2(e.target.checked)}
                className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer shrink-0 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                <strong>[필수]</strong> 보호자로부터 수집한 개인정보를 본 도구 이외의 목적으로 활용하지 않으며,
                수집·보관·파기 등 처리 과정에서 관련 법령과 학교 내부 지침을 준수할 것을 확인합니다.
              </span>
            </label>
          </div>
          <div className="pt-2">
            <Button
              size="lg"
              className={`w-full h-14 text-base font-bold rounded-xl shadow-md transition-all ${
                allChecked 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!allChecked}
              onClick={() => router.push("/teacher")}
            >
              동의하고 새 문서세트 만들기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {!allChecked && (
              <p className="text-xs text-center text-red-500 mt-3 font-medium">위 필수 항목에 모두 체크하시면 시작할 수 있습니다.</p>
            )}
          </div>
        </section>

        {/* 사용 흐름 인포그래픽 */}
        <section className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">사용 흐름 한눈에 보기</h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-2 md:items-start justify-between">
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1 relative group">
                {/* connector line (desktop) */}
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-0.5 bg-gray-100 group-hover:bg-blue-100 transition-colors z-0" />
                )}
                {/* connector line (mobile) */}
                {i < FLOW_STEPS.length - 1 && (
                  <div className="block md:hidden absolute top-full left-6 w-0.5 h-6 bg-gray-100 z-0" />
                )}
                <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl ${step.bg} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                  {step.icon}
                </div>
                <div className="md:text-center pt-1 md:pt-0">
                  <p className="text-sm font-bold text-gray-900">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[200px] md:mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 서비스 안내 + 개인정보 처리 */}
        <section className="bg-white border rounded-2xl shadow-sm divide-y">
          <div className="p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> 서비스 안내
            </h2>
            <div className="bg-blue-50/50 p-4 rounded-lg space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                IEP-ON은 특수교사의 행정 업무 부담을 덜어드리기 위해 <strong>무료</strong>로 제공되는 보조 도구입니다.
                서비스 이용에 따르는 권리와 책임은 사용자(특수교사) 본인에게 있으며,
                학교·학생·보호자 관련 정보를 취급함에 있어 「개인정보보호법」 및 관련 법령에 따라 주의 의무를 다하여 사용하여 주시기 바랍니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                본 도구는 개별화교육지원팀 운영에 관한 행정 편의를 제공하며, 법적 효력을 갖는 공문 또는 공식 계약서를 대체하지 않습니다.
                출력·저장된 문서의 법적 효력 및 보관 의무는 학교와 담당 교사에게 있습니다.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" /> 개인정보 처리 및 강력한 보안
            </h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span className="leading-relaxed">보호자가 작성한 의견서·동의서는 제출 즉시 <strong>AES-256-GCM 방식으로 브라우저에서 암호화</strong>된 상태로 서버에 저장됩니다. 암호화 키는 URL 프래그먼트(#key=...)로만 전달되며, 서버에는 키 자체가 전달되지 않아 <strong>개발자를 포함한 제3자도 내용을 절대 열람할 수 없습니다.</strong></span>
              </li>
              <li className="flex items-start gap-3 bg-red-50/50 p-3 rounded-lg border border-red-100">
                <Trash2 className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">저장된 모든 데이터는 <strong>생성일로부터 30일 이내 서버에서 원천(완전) 삭제</strong>됩니다. 이는 개별화교육지원팀 법정 운영 기간에 준하는 보관 기준입니다. 필요한 문서는 반드시 기한 내에 대시보드에서 인쇄·저장해 두시기 바랍니다.</span>
              </li>
              <li className="flex items-start gap-3 p-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">학생 이름 등 식별 정보는 DB에 원문 저장되지 않으며 <strong>SHA-256 해시값으로만</strong> 보관됩니다.</span>
              </li>
              <li className="flex items-start gap-3 p-2">
                <ClipboardCheck className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">본 서비스는 상거래법상 전자계약 관련 기준을 일부 준용하여 전자 서명·동의 절차를 구현하였으나, 어디까지나 <strong>교육 운영을 위한 행정 편의 보조 수단</strong>으로서 그 가치를 다합니다.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" /> 책임 한계 안내
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed bg-orange-50/50 p-4 rounded-lg">
              본 서비스는 무료로 배포되며, 서비스 이용 과정에서 발생하는 데이터 손실·오입력·네트워크 장애 등에 대해 개발자 측은 법적 책임을 지지 않습니다.
              서비스 이용 전 소속 학교 및 교육청의 개인정보 처리방침, 관련 내부 지침과의 합치 여부를 담당자께서 직접 확인하시고 사용하시기 바랍니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-10 text-center text-sm text-gray-500 space-y-2">
        <Image src="/logo.svg" alt="IEP-ON" width={80} height={20} className="mx-auto mb-4 opacity-50 grayscale" />
        <p>개별화교육지원팀 협의회 행정 보조 도구 · 무료 배포 · © {new Date().getFullYear()}</p>
        <p className="text-xs text-gray-400">문의 및 개선 제안은 개발자에게 연락 바랍니다.</p>
      </footer>
    </div>
  );
}
