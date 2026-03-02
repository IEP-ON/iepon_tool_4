"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
  onSignatureChange: (base64: string) => void;
  initialSignature?: string;
}

export function SignaturePad({ onSignatureChange, initialSignature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // 캔버스 초기화 및 리사이즈 처리
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 부모 컨테이너 크기에 맞게 캔버스 해상도 설정 (고해상도 지원)
    const setCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        // 기존 그림 임시 저장
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx && !isEmpty) {
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          tempCtx.drawImage(canvas, 0, 0);
        }

        // 고해상도 지원을 위한 픽셀 비율 적용
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // CSS 크기는 실제 크기로 설정
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "black";
          
          // 기존 그림 복원
          if (!isEmpty) {
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, rect.width, rect.height);
          }
        }
      }
    };

    // 약간의 딜레이를 주어 DOM 렌더링 후 크기를 계산
    const timer = setTimeout(setCanvasSize, 100);
    window.addEventListener("resize", setCanvasSize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [isEmpty]);

  // 초기 서명 로드
  useEffect(() => {
    if (initialSignature && canvasRef.current && isEmpty) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.parentElement?.getBoundingClientRect();
        
        if (ctx && rect) {
          ctx.clearRect(0, 0, rect.width, rect.height);
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          setIsEmpty(false);
        }
      };
      img.src = initialSignature;
    }
  }, [initialSignature, isEmpty]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // 스크롤 방지
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    
    if (isEmpty) {
      setIsEmpty(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // 스크롤 방지
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
    
    // 그리기 종료 시 부모에게 데이터 전달
    if (canvasRef.current) {
      // 고해상도 캔버스를 데이터 URL로 변환
      const base64 = canvasRef.current.toDataURL("image/png");
      onSignatureChange(base64);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      // 스케일을 고려하여 초기화
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      setIsEmpty(true);
      onSignatureChange("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative h-40 w-full touch-none select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: "none" }} // 모바일 스크롤 방지
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
