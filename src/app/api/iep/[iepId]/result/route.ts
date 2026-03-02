import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** GET /api/iep/[iepId]/result — 전체 데이터 조회 (결과 페이지용) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ iepId: string }> },
) {
  try {
    const { iepId } = await params;

    // IEP 기본 정보
    const { data: iep, error: iepError } = await supabase
      .from("tool4_ieps")
      .select("id, iep_id, status, teacher_data")
      .eq("iep_id", iepId)
      .single();

    if (iepError || !iep) {
      return NextResponse.json(
        { error: "IEP를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 의견서
    const { data: opinion } = await supabase
      .from("tool4_parent_opinions")
      .select("opinion_data_encrypted, encryption_iv")
      .eq("iep_id", iep.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    // 동의서
    const { data: consent } = await supabase
      .from("tool4_consent_forms")
      .select("consent_data_encrypted, encryption_iv, signature_storage_path")
      .eq("iep_id", iep.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    // 서명 이미지 공개 URL 생성
    let signatureUrl = "";
    if (consent?.signature_storage_path) {
      const { data: urlData } = supabase.storage
        .from("iep-signatures")
        .getPublicUrl(consent.signature_storage_path);
      signatureUrl = urlData?.publicUrl || "";
    }

    return NextResponse.json({
      status: iep.status,
      teacherData: iep.teacher_data,
      opinionEncrypted: opinion?.opinion_data_encrypted || null,
      opinionIv: opinion?.encryption_iv || null,
      consentEncrypted: consent?.consent_data_encrypted || null,
      consentIv: consent?.encryption_iv || null,
      signatureUrl,
    });
  } catch (err) {
    console.error("Result fetch error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
