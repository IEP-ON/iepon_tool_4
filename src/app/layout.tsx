import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEP-ON | 개별화교육계획 도우미",
  description: "특수교육대상 학생의 개별화교육계획(IEP) 수립을 위한 보호자 의견서 및 동의서 수집 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
