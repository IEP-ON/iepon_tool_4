import type { TeacherInput } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
}

export function ConsentBlankForm({ teacher }: Props) {
  const ConsentItem = ({ title, required = false }: { title: string; required?: boolean }) => (
    <div className="py-2.5 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-900 flex-1 leading-relaxed">
          {title} {required && <span className="text-red-500 text-xs">(필수)</span>}
        </p>
        <div className="flex gap-4 shrink-0">
          <label className="flex items-center gap-1.5">
            <span className="w-4 h-4 border-2 border-gray-400 rounded"></span>
            <span className="text-sm">동의</span>
          </label>
          <label className="flex items-center gap-1.5">
            <span className="w-4 h-4 border-2 border-gray-400 rounded"></span>
            <span className="text-sm">미동의</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] p-[12mm] bg-white print:p-[10mm] print:m-0 print:w-full print:shadow-none text-[10pt] leading-tight break-after-page">
      <div className="text-center mb-4 border-b-2 border-black pb-2">
        <h1 className="text-[15pt] font-bold tracking-tight">
          특수교육대상자 교육지원 및 정보제공 동의서
        </h1>
        <div className="text-right text-gray-600 mt-1 text-[9pt]">
          <p>{teacher.schoolName}</p>
        </div>
      </div>

      <div className="mb-4 text-[9pt] text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border border-gray-200">
        <p className="font-medium mb-1">「장애인 등에 대한 특수교육법」 및 「개인정보보호법」에 근거</p>
        <p>교육 지원에 필요한 정보 제공 및 활동 참여에 동의해주세요.</p>
      </div>

      <div className="space-y-5 text-[10pt]">
        {/* 기본 정보 */}
        <section className="print:break-inside-avoid">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 pb-3 border-b">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">학생 성명:</span>
              <div className="flex-1 border-b border-gray-400 h-6"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">학년/반:</span>
              <div className="flex-1 border-b border-gray-400 h-6"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">보호자 성명:</span>
              <div className="flex-1 border-b border-gray-400 h-6"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">연락처:</span>
              <div className="flex-1 border-b border-gray-400 h-6"></div>
            </div>
          </div>
        </section>

        {/* 필수 동의 */}
        <section className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 print:break-inside-avoid">
          <h2 className="text-[11pt] font-bold mb-3 text-blue-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            1. 필수 동의 사항
          </h2>
          <div className="bg-white rounded p-3 space-y-0">
            <ConsentItem 
              title="개인정보 수집·이용 (학생 및 보호자의 기본정보, 건강정보 등)" 
              required 
            />
            <ConsentItem 
              title="개별화교육계획(IEP) 수립 및 시행" 
              required 
            />
            <ConsentItem 
              title="특수교육 관련서비스 제공 (치료지원, 보조공학기기 등)" 
              required 
            />
          </div>
        </section>

        {/* 선택 동의 */}
        <section className="border border-gray-200 rounded-lg p-4 print:break-inside-avoid">
          <h2 className="text-[11pt] font-bold mb-3 text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
            2. 선택 동의 사항
          </h2>
          <div className="bg-white rounded p-3 space-y-0">
            <ConsentItem title="학교 홈페이지 등 교육활동 사진·영상 게시" />
            <ConsentItem title="진로 및 직업교육 프로그램 참여" />
            <ConsentItem title="외부 전문기관 연계 및 정보 제공" />
            <ConsentItem title="통합교육 지원을 위한 일반학급 교사 정보 공유" />
            <ConsentItem title="방과후 프로그램 및 특별활동 안내 수신" />
          </div>
        </section>

        {/* 개인정보 제3자 제공 */}
        <section className="border border-amber-200 rounded-lg p-4 bg-amber-50/30 print:break-inside-avoid">
          <h2 className="text-[11pt] font-bold mb-3 text-amber-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
            3. 개인정보 제3자 제공 동의
          </h2>
          <div className="bg-white rounded p-3 space-y-0">
            <ConsentItem title="교육청 및 특수교육지원센터 정보 제공" />
            <ConsentItem title="치료기관 등 관련서비스 제공기관 정보 공유" />
            <ConsentItem title="전환교육 대상 상급학교 정보 인계" />
          </div>
        </section>

        {/* 긴급 연락망 */}
        <section className="print:break-inside-avoid">
          <h2 className="text-[11pt] font-bold mb-2 text-gray-900 border-b pb-1">
            4. 긴급 연락망
          </h2>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-[9pt] font-medium text-gray-700 pb-1">
              <span>성명</span>
              <span>관계</span>
              <span>연락처</span>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <div className="border-b border-gray-400 h-6"></div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 타이핑 확인 */}
        <section className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 print:break-inside-avoid">
          <p className="text-sm text-gray-800 font-medium mb-2">
            위 내용을 확인하였으며, 선택한 항목에 동의합니다.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-700">확인란:</span>
            <div className="flex-1 border-b-2 border-gray-400 h-8"></div>
            <span className="text-xs text-gray-500">(왼쪽 란에 "동의합니다" 입력)</span>
          </div>
        </section>

        {/* 서명 */}
        <section className="mt-6 pt-4 border-t-2 border-gray-300 print:break-inside-avoid">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[9pt] text-gray-600">작성일자:</p>
              <div className="border-b border-gray-400 w-[150px] h-7"></div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9pt] text-gray-600">보호자 서명:</p>
              <div className="border-b border-gray-400 w-[150px] h-7"></div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-300 text-[8.5pt] text-gray-600">
        <p>본 동의서는 「개인정보보호법」에 따라 작성되었으며, 동의 철회 시 언제든지 담임교사에게 요청하실 수 있습니다.</p>
        <p className="mt-1">문의: {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
      </div>
    </div>
  );
}
