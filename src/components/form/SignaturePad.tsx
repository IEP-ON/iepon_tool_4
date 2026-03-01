"use client";

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

export interface SignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface Props {
  onEnd?: (dataUrl: string) => void;
  className?: string;
}

export const SignaturePad = forwardRef<SignaturePadHandle, Props>(
  function SignaturePad({ onEnd, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const startDrawing = useCallback((x: number, y: number) => {
      drawing.current = true;
      lastPos.current = { x, y };
    }, []);

    const draw = useCallback((x: number, y: number) => {
      if (!drawing.current || !lastPos.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = { x, y };
    }, []);

    const stopDrawing = useCallback(() => {
      if (!drawing.current) return;
      drawing.current = false;
      lastPos.current = null;
      const canvas = canvasRef.current;
      if (canvas && onEnd) {
        onEnd(canvas.toDataURL("image/png"));
      }
    }, [onEnd]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // 캔버스 해상도를 devicePixelRatio에 맞게 설정
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      const onMouseDown = (e: MouseEvent) => {
        const pos = getPos(e, canvas);
        startDrawing(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1));
      };
      const onMouseMove = (e: MouseEvent) => {
        const pos = getPos(e, canvas);
        draw(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1));
      };
      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e.touches[0], canvas);
        startDrawing(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1));
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e.touches[0], canvas);
        draw(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1));
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseleave", stopDrawing);
      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      canvas.addEventListener("touchend", stopDrawing);

      return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseleave", stopDrawing);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", stopDrawing);
      };
    }, [startDrawing, draw, stopDrawing]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (onEnd) onEnd("");
      },
      isEmpty: () => {
        const canvas = canvasRef.current;
        if (!canvas) return true;
        const ctx = canvas.getContext("2d");
        if (!ctx) return true;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        return !data.some((v) => v !== 0);
      },
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }));

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ touchAction: "none", cursor: "crosshair", display: "block", width: "100%", height: 120 }}
      />
    );
  }
);
