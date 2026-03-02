import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** GET /api/batch/[batchId] — 배치 생성된 전체 IEP 조회 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> },
) {
  try {
    const { batchId } = await params;

    const { data, error } = await supabase
      .from("tool4_ieps")
      .select("id, iep_id, status, teacher_data")
      .filter("teacher_data->>batchId", "eq", batchId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "해당 배치 문서를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ieps: data });
  } catch (err) {
    console.error("Batch fetch error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
