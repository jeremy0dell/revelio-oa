import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";
import TouchSlider from "./TouchSlider";

const TRAITS = [
  { key: "warmth", label: "Warmth" },
  { key: "elegance", label: "Elegance" },
  { key: "danger", label: "Danger" },
  { key: "clarity", label: "Clarity" },
  { key: "intensity", label: "Intensity" },
];

const TOTAL = 100;

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q6InterpretiveBudget({ onAnswer }: Props) {
  const [values, setValues] = useState<Record<string, number>>({
    warmth: 20,
    elegance: 20,
    danger: 20,
    clarity: 20,
    intensity: 20,
  });

  const allocated = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = TOTAL - allocated;

  const handleChange = (key: string, newVal: number) => {
    const currentOther = allocated - values[key];
    const maxAllowed = TOTAL - currentOther;
    const clamped = Math.max(0, Math.min(maxAllowed, newVal));
    setValues((prev) => ({ ...prev, [key]: clamped }));
  };

  const submit = useCallback(() => {
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    const norm = (v: number) => v / TOTAL;

    traitDeltas.emotionalWarmth = norm(values.warmth) * 0.4;
    traitDeltas.diplomaticInstinct = norm(values.elegance) * 0.3;
    traitDeltas.structuralDiscipline = norm(values.elegance) * 0.2;
    traitDeltas.expressiveDanger = norm(values.danger) * 0.4;
    traitDeltas.playfulUnpredictability = norm(values.danger) * 0.2;
    traitDeltas.structuralDiscipline =
      (traitDeltas.structuralDiscipline || 0) + norm(values.clarity) * 0.3;
    traitDeltas.practicalPreparedness = norm(values.clarity) * 0.2;
    traitDeltas.charismaTheatricality = norm(values.intensity) * 0.3;
    traitDeltas.rhythmicDecisiveness = norm(values.intensity) * 0.2;

    const vals = Object.values(values);
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);

    if (maxVal >= 50) {
      tags.push({ id: "maxed-trait", label: `maxed ${Object.entries(values).find(([, v]) => v === maxVal)?.[0]}` });
    }
    if (maxVal - minVal < 10) {
      tags.push({ id: "balanced-budget", label: "balanced allocator" });
    }
    if (values.danger >= 40) {
      tags.push({ id: "maxed-danger", label: "maxed danger" });
    }
    if (values.elegance <= 5) {
      tags.push({ id: "refused-elegance", label: "refused elegance" });
    }

    onAnswer({
      questionId: "interpretive-budget",
      traitDeltas,
      tags,
      rawData: { values },
    });
  }, [values, onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        Allocate your interpretive budget.
      </h3>
      <p className="text-ivory/40 text-xs mb-6 text-center">
        Distribute {TOTAL} points across five qualities.
      </p>

      <div className="w-full max-w-sm space-y-5 mb-6">
        {TRAITS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between mb-1.5">
              <span className="text-ivory/60 text-xs uppercase tracking-[0.1em]">
                {label}
              </span>
              <span className="text-ivory/40 text-xs tabular-nums">
                {values[key]}
              </span>
            </div>
            <TouchSlider
              min={0}
              max={TOTAL}
              value={values[key]}
              onChange={(v) => handleChange(key, v)}
              label={`${label}: ${values[key]} points`}
            />
          </div>
        ))}
      </div>

      <p
        className={`text-xs mb-6 tabular-nums ${
          remaining === 0 ? "text-gold/60" : remaining < 0 ? "text-red-400/60" : "text-ivory/30"
        }`}
      >
        {remaining === 0
          ? "Budget allocated."
          : remaining > 0
          ? `${remaining} points remaining`
          : `${Math.abs(remaining)} points over budget`}
      </p>

      <button
        onClick={submit}
        disabled={remaining < 0}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
