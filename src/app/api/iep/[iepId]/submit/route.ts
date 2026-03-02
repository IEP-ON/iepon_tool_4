import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** POST /api/iep/[iepId]/submit — 의견서 + 동의서 제출 (학부모) */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ iepId: string }> },
) {
  try {
    const { iepId } = await params;
    const body = await request.json();
    const {
      opinionEncrypted,
      opinionIv,
      consentEncrypted,
      consentIv,
      guardianNameHash,
      signatureBase64,
    } = body;

    if (!opinionEncrypted || !consentEncrypted) {
      return NextResponse.json(
        { error: "암호화된 데이터가 누락되었습니다." },
        { status: 400 },
      );
    }

    // IEP 존재 확인
    const { data: iep, error: iepError } = await supabase
      .from("tool4_ieps")
      .select("id, status")
      .eq("iep_id", iepId)
      .single();

    if (iepError || !iep) {
      return NextResponse.json(
        { error: "IEP를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (iep.status !== "draft") {
      return NextResponse.json(
        { error: "이미 제출된 IEP입니다." },
        { status: 409 },
      );
    }

    const ipAddress = request.headers.get("x-forwarded-for") || "";
    const userAgent = request.headers.get("user-agent") || "";

    // 서명 이미지 → Supabase Storage 업로드
    let signatureStoragePath = "";
    if (signatureBase64) {
      try {
        const base64Data = signatureBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `signatures/${iep.id}/${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("iep-signatures")
          .upload(fileName, buffer, {
            contentType: "image/png",
            upsert: false,
          });

        if (!uploadError) {
          signatureStoragePath = fileName;
        } else {
          console.error("Signature upload error:", uploadError.message);
        }
      } catch (uploadErr) {
        console.error("Signature processing error:", uploadErr);
      }
    }

    // 의견서 INSERT
    const { error: opinionError } = await supabase
      .from("tool4_parent_opinions")
      .insert({
        iep_id: iep.id,
        opinion_data_encrypted: opinionEncrypted,
        encryption_iv: opinionIv || "",
        guardian_name_hash: guardianNameHash || "",
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (opinionError) {
      console.error("Opinion insert error:", opinionError.message);
      return NextResponse.json(
        { error: "의견서 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    // 동의서 INSERT
    const { error: consentError } = await supabase
      .from("tool4_consent_forms")
      .insert({
        iep_id: iep.id,
        consent_data_encrypted: consentEncrypted,
        encryption_iv: consentIv || "",
        signature_storage_path: signatureStoragePath,
        guardian_name_hash: guardianNameHash || "",
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (consentError) {
      console.error("Consent insert error:", consentError.message);
      return NextResponse.json(
        { error: "동의서 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    // IEP 상태 업데이트
    await supabase
      .from("tool4_ieps")
      .update({ status: "submitted", updated_at: new Date().toISOString() })
      .eq("id", iep.id);

    // 감사 로그
    await supabase.from("tool4_audit_logs").insert({
      iep_id: iep.id,
      action: "submit",
      actor: "parent",
      ip_address: ipAddress,
      user_agent: userAgent,
      details: { guardian_name_hash: guardianNameHash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
