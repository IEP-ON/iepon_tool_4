import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** GET /api/iep/[iepId] — 교사 정보 조회 (학부모 폼 로드용) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ iepId: string }> },
) {
  try {
    const { iepId } = await params;

    const { data, error } = await supabase
      .from("tool4_ieps")
      .select("id, iep_id, status, teacher_data")
      .eq("iep_id", iepId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "IEP를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: data.id,
      iepId: data.iep_id,
      status: data.status,
      teacherData: data.teacher_data,
    });
  } catch (err) {
    console.error("IEP fetch error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
