"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

const DURATION = 6000; // 6 seconds
const TARGET_BPM = 72;
const TARGET_INTERVAL = 60000 / TARGET_BPM;

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q4PulseTest({ onAnswer }: Props) {
  const [phase, setPhase] = useState<"ready" | "tapping" | "done">("ready");
  const [taps, setTaps] = useState<number[]>([]);
  const [pulseOpacity, setPulseOpacity] = useState(0.3);
  const startTime = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const pulseRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (phase === "tapping") {
      startTime.current = Date.now();

      // Animate pulse indicator
      const animatePulse = () => {
        const elapsed = Date.now() - startTime.current;
        const beatPhase = (elapsed % TARGET_INTERVAL) / TARGET_INTERVAL;
        // Simple sine wave for visual pulse
        setPulseOpacity(0.3 + 0.4 * Math.sin(beatPhase * Math.PI));
        pulseRef.current = setTimeout(animatePulse, 16);
      };
      animatePulse();

      timerRef.current = setTimeout(() => {
        setPhase("done");
      }, DURATION);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pulseRef.current) clearTimeout(pulseRef.current);
    };
  }, [phase]);

  const handleTap = () => {
    if (phase === "ready") {
      setPhase("tapping");
      setTaps([0]);
      return;
    }
    if (phase === "tapping") {
      setTaps((prev) => [...prev, Date.now() - startTime.current]);
    }
  };

  const submit = useCallback(() => {
    const intervals: number[] = [];
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1]);
    }

    const meanInterval =
      intervals.length > 0
        ? intervals.reduce((a, b) => a + b, 0) / intervals.length
        : TARGET_INTERVAL;

    const deviation = Math.abs(meanInterval - TARGET_INTERVAL) / TARGET_INTERVAL;

    // Acceleration trend
    let trend = 0;
    if (intervals.length > 2) {
      const firstHalf = intervals.slice(0, Math.floor(intervals.length / 2));
      const secondHalf = intervals.slice(Math.floor(intervals.length / 2));
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      trend = (avgSecond - avgFirst) / avgFirst;
    }

    // Variance
    const variance =
      intervals.length > 0
        ? intervals.reduce((sum, i) => sum + Math.pow(i - meanInterval, 2), 0) /
          intervals.length
        : 0;
    const stability = Math.max(0, 1 - Math.sqrt(variance) / meanInterval);

    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    // Stable = grounded
    if (stability > 0.7) {
      traitDeltas.stabilizingPresence = 0.3;
      traitDeltas.rhythmicDecisiveness = 0.25;
      tags.push({ id: "steady-pulse", label: "steady pulse" });
    } else if (stability < 0.4) {
      traitDeltas.playfulUnpredictability = 0.25;
      traitDeltas.charismaTheatricality = 0.15;
      tags.push({ id: "inconsistent-pulse", label: "operationally dangerous" });
    }

    // Rushing
    if (trend < -0.1) {
      traitDeltas.expressiveDanger = (traitDeltas.expressiveDanger || 0) + 0.2;
      traitDeltas.rhythmicDecisiveness = (traitDeltas.rhythmicDecisiveness || 0) + 0.1;
      tags.push({ id: "rushed-pulse", label: "rushed pulse" });
    }
    // Dragging
    if (trend > 0.1) {
      traitDeltas.introspectiveDepth = (traitDeltas.introspectiveDepth || 0) + 0.2;
      traitDeltas.emotionalWarmth = (traitDeltas.emotionalWarmth || 0) + 0.15;
    }

    // First tap latency
    if (taps.length > 0 && taps[0] > 500) {
      traitDeltas.structuralDiscipline = (traitDeltas.structuralDiscipline || 0) + 0.1;
    }

    onAnswer({
      questionId: "pulse-test",
      traitDeltas,
      tags,
      rawData: { taps, meanInterval, stability, trend },
    });
  }, [taps, onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        Tap with the pulse.
      </h3>
      <p className="text-ivory/40 text-xs mb-8 text-center">
        {phase === "ready"
          ? "Tap the circle to begin, then keep tapping with a steady pulse."
          : phase === "tapping"
          ? "Keep tapping..."
          : `${taps.length} taps recorded.`}
      </p>

      {phase !== "done" ? (
        <motion.button
          onPointerDown={handleTap}
          className="w-32 h-32 rounded-full border-2 border-gold/40 flex items-center justify-center relative mb-8"
          whileTap={{ scale: 0.95 }}
          aria-label="Tap to keep pulse"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gold/20"
            style={{ opacity: phase === "tapping" ? pulseOpacity : 0.15 }}
          />
          <div className="w-4 h-4 rounded-full bg-gold" />
        </motion.button>
      ) : (
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-gold/20 flex items-center justify-center opacity-50">
            <div className="w-4 h-4 rounded-full bg-gold/50" />
          </div>
        </div>
      )}

      {phase === "tapping" && (
        <div className="h-1 w-48 bg-ivory/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold/40"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        </div>
      )}

      {phase === "done" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={submit}
          className="btn-primary"
        >
          Continue
        </motion.button>
      )}
    </div>
  );
}
