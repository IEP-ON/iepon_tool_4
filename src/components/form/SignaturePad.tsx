"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
  onSignatureChange: (base64: string) => void;
  initialSignature?: string;
}

export function SignaturePad({ onSignatureChange, initialSignature }: SignaturePadProps) {
  const padRef = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (initialSignature && padRef.current && isEmpty) {
      padRef.current.fromDataURL(initialSignature);
      setIsEmpty(false);
    }
  }, [initialSignature, isEmpty]);

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
      setIsEmpty(true);
      onSignatureChange("");
    }
  };

  const handleEnd = () => {
    if (padRef.current) {
      setIsEmpty(padRef.current.isEmpty());
      const base64 = padRef.current.toDataURL("image/png");
      onSignatureChange(base64);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
        <SignatureCanvas
          ref={padRef}
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair touch-none",
          }}
          backgroundColor="rgba(255,255,255,1)"
          penColor="black"
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300">
            여기에 서명해 주세요
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isEmpty}
        >
          <Eraser className="w-4 h-4 mr-2" />
          다시 쓰기
        </Button>
      </div>
    </div>
  );
}
