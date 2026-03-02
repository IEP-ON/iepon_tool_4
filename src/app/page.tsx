import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">IEP-ON</h1>
        <p className="text-gray-600">
          개별화교육계획(IEP) 수립을 위한 보호자 의견서 및 동의서 수집 도구
        </p>
        <div className="space-y-3">
          <Link
            href="/teacher"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            교사용 입력 시작
          </Link>
          <Link
            href="/print-empty"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            빈 양식 인쇄
          </Link>
        </div>
      </div>
    </div>
  );
}
