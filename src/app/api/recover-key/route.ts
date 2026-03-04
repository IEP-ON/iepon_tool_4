import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sha256 } from "@/lib/encryption";

export const runtime = "nodejs";

/** POST /api/recover-key — 기존 IEP 배치에 암호화 키 복구 저장 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, encryptionKey, phone, pinHash } = body;

    if (!batchId || !encryptionKey || !phone || !pinHash) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      );
    }

    // 1. 인증: 해당 배치가 이 교사(phone+pinHash)의 것인지 확인
    const { data: ieps, error: fetchError } = await supabase
      .from("tool4_ieps")
      .select("id, iep_id, encryption_key, teacher_pin_hash")
      .eq("teacher_phone", phone)
      .like("iep_id", `%`) // all for this phone
      .filter("teacher_data->>batchId", "eq", batchId);

    if (fetchError) {
      return NextResponse.json({ error: "조회 실패" }, { status: 500 });
    }

    if (!ieps || ieps.length === 0) {
      return NextResponse.json(
        { error: "해당 배치를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // PIN 검증
    const storedHash = ieps[0].teacher_pin_hash;
    if (storedHash && storedHash !== pinHash) {
      return NextResponse.json(
        { error: "인증에 실패했습니다." },
        { status: 403 },
      );
    }

    // 2. 이미 키가 있는 경우 덮어쓰기 방지
    const needUpdate = ieps.filter((i) => !i.encryption_key);
    if (needUpdate.length === 0) {
      return NextResponse.json({ message: "이미 키가 등록되어 있습니다.", updated: 0 });
    }

    // 3. 해당 배치의 모든 IEP에 키 저장
    const ids = needUpdate.map((i) => i.id);
    const { error: updateError } = await supabase
      .from("tool4_ieps")
      .update({ encryption_key: encryptionKey })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json({ error: "키 저장에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ message: "키가 복구되었습니다.", updated: ids.length });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
