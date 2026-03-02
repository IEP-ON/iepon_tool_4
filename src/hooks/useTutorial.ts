import { useEffect, useRef } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";

export interface TutorialStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  };
}

interface UseTutorialOptions {
  steps: TutorialStep[];
  tutorialId: string; // Unique ID to track if user has seen it (localStorage)
  immediate?: boolean; // Start immediately on mount?
}

export function useTutorial({ steps, tutorialId, immediate = true }: UseTutorialOptions) {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      animate: true,
      steps: steps,
      doneBtnText: "완료",
      nextBtnText: "다음",
      prevBtnText: "이전",
      allowClose: true,
      onDestroyStarted: () => {
        // 투어 종료 시 처리 (예: 다시 보지 않기 설정 등)
        localStorage.setItem(`tutorial_seen_${tutorialId}`, "true");
        driverRef.current?.destroy();
      },
    });

    // Check if already seen
    const seen = localStorage.getItem(`tutorial_seen_${tutorialId}`);
    if (immediate && !seen) {
      // Give a slight delay to ensure DOM is ready
      setTimeout(() => {
        driverRef.current?.drive();
      }, 500);
    }
  }, [steps, tutorialId, immediate]);

  const start = () => {
    driverRef.current?.drive();
  };

  return { start };
}
