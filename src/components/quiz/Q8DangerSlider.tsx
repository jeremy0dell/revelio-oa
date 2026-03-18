
import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q8DangerSlider({ onAnswer }: Props) {
  const [value, setValue] = useState(50);
  const [oscillations, setOscillations] = useState(0);
  const [committed, setCommitted] = useState(false);
  const lastDirection = useRef<"up" | "down" | null>(null);
  const lastValue = useRef(50);

  const handleChange = (newVal: number) => {
    if (committed) return;
    const dir = newVal > lastValue.current ? "up" : "down";
    if (lastDirection.current && dir !== lastDirection.current) {
      setOscillations((c) => c + 1);
    }
    lastDirection.current = dir;
    lastValue.current = newVal;
    setValue(newVal);
  };

  const submit = useCallback(() => {
    setCommitted(true);
    const normalized = value / 100;
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    // High danger
    traitDeltas.expressiveDanger = normalized * 0.4;
    traitDeltas.playfulUnpredictability = normalized * 0.25;
    traitDeltas.charismaTheatricality = normalized * 0.2;

    // Low danger = structure
    traitDeltas.structuralDiscipline = (1 - normalized) * 0.3;
    traitDeltas.practicalPreparedness = (1 - normalized) * 0.2;
    traitDeltas.stabilizingPresence = (1 - normalized) * 0.15;

    if (normalized > 0.8) {
      tags.push({ id: "maxed-danger-slider", label: "maxed danger" });
    }
    if (normalized < 0.2) {
      tags.push({ id: "played-it-safe", label: "played it safe" });
    }
    if (oscillations > 5) {
      tags.push({ id: "indecisive-danger", label: "agonized over danger" });
      traitDeltas.introspectiveDepth = (traitDeltas.introspectiveDepth || 0) + 0.1;
    }

    onAnswer({
      questionId: "danger-slider",
      traitDeltas,
      tags,
      rawData: { value, oscillations },
    });
  }, [value, oscillations, onAnswer]);

  const getLabel = () => {
    if (value < 20) return "Clean. Poised. Defensible.";
    if (value < 40) return "Tastefully controlled.";
    if (value < 60) return "Balanced, with an edge.";
    if (value < 80) return "Approaching inadvisable.";
    return "Electrifying. Inadvisable. Unforgettable.";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        How much interpretive danger
        <br />
        do you actually need?
      </h3>
      <p className="text-ivory/40 text-xs mb-12 text-center">
        Slide to your honest position.
      </p>

      <div className="w-full max-w-sm px-4 mb-4">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full"
          aria-label={`Danger level: ${value}%`}
        />
      </div>

      <div className="flex justify-between w-full max-w-sm px-4 mb-4">
        <span className="text-ivory/30 text-[10px] uppercase tracking-[0.1em]">
          Clean
        </span>
        <span className="text-ivory/30 text-[10px] uppercase tracking-[0.1em]">
          Inadvisable
        </span>
      </div>

      <motion.p
        key={getLabel()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-ivory/50 text-xs italic text-center mb-10 h-4"
      >
        {getLabel()}
      </motion.p>

      <button onClick={submit} className="btn-primary">
        Complete Assessment
      </button>
    </div>
  );
}
