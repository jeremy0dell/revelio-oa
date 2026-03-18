"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q5SustainTest({ onAnswer }: Props) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdDuration, setHoldDuration] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const startRef = useRef(0);
  const frameRef = useRef<number>();

  const startHold = () => {
    if (isDone) return;
    setIsHolding(true);
    startRef.current = Date.now();

    const tick = () => {
      setHoldDuration(Date.now() - startRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const duration = Date.now() - startRef.current;
    setHoldDuration(duration);
    setIsDone(true);
  };

  const submit = useCallback(() => {
    const seconds = holdDuration / 1000;
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    // Sweet spot: 3-6 seconds
    if (seconds < 1.5) {
      traitDeltas.rhythmicDecisiveness = 0.25;
      traitDeltas.expressiveDanger = 0.15;
      tags.push({ id: "quick-release", label: "impatient release" });
    } else if (seconds < 3) {
      traitDeltas.structuralDiscipline = 0.2;
      traitDeltas.practicalPreparedness = 0.15;
    } else if (seconds < 6) {
      traitDeltas.emotionalWarmth = 0.25;
      traitDeltas.introspectiveDepth = 0.2;
      traitDeltas.stabilizingPresence = 0.15;
    } else if (seconds < 10) {
      traitDeltas.emotionalWarmth = 0.3;
      traitDeltas.introspectiveDepth = 0.25;
      tags.push({ id: "held-long", label: "held too long" });
    } else {
      traitDeltas.introspectiveDepth = 0.35;
      traitDeltas.emotionalWarmth = 0.2;
      traitDeltas.playfulUnpredictability = 0.15;
      tags.push({ id: "held-forever", label: "refused to let go" });
    }

    onAnswer({
      questionId: "sustain-test",
      traitDeltas,
      tags,
      rawData: { holdDuration, seconds },
    });
  }, [holdDuration, onAnswer]);

  const bloomScale = isHolding ? Math.min(1 + holdDuration / 3000, 3) : 1;
  const bloomOpacity = isHolding ? Math.min(0.15 + holdDuration / 10000, 0.5) : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        Hold until the phrase feels complete.
      </h3>
      <p className="text-ivory/40 text-xs mb-10 text-center">
        {isDone
          ? `${(holdDuration / 1000).toFixed(1)}s — noted.`
          : "Press and hold the center. Release when it feels right."}
      </p>

      {!isDone ? (
        <div className="relative flex items-center justify-center mb-8">
          {/* Bloom effect */}
          <motion.div
            className="absolute rounded-full bg-gold/20"
            style={{
              width: 120,
              height: 120,
              scale: bloomScale,
              opacity: bloomOpacity,
            }}
          />
          {isHolding && (
            <motion.div
              className="absolute rounded-full border border-gold/20"
              initial={{ width: 120, height: 120, opacity: 0.4 }}
              animate={{ width: 240, height: 240, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <button
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            className={`relative z-10 w-28 h-28 rounded-full border-2 transition-colors duration-300 flex items-center justify-center select-none ${
              isHolding
                ? "border-gold bg-gold/10"
                : "border-ivory/30 bg-warm-gray/30"
            }`}
            aria-label="Press and hold"
          >
            <span className="text-ivory/40 text-xs uppercase tracking-[0.15em]">
              {isHolding ? "Holding" : "Hold"}
            </span>
          </button>
        </div>
      ) : (
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
