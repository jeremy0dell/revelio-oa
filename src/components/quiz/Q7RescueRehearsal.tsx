"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

const ACTIONS = [
  { id: "joke", label: "Make a joke" },
  { id: "subdivide", label: "Subdivide" },
  { id: "sing", label: "Sing the line" },
  { id: "letter-c", label: "Take it from letter C" },
  { id: "break", label: "Call for a break" },
  { id: "stare", label: "Stare meaningfully" },
];

const FOLLOWUPS: Record<string, typeof ACTIONS> = {
  joke: [
    { id: "then-subdivide", label: "Then subdivide" },
    { id: "then-play", label: "Then just play" },
  ],
  subdivide: [
    { id: "then-tempo", label: "Lock in the tempo" },
    { id: "then-move-on", label: "Move on quickly" },
  ],
  sing: [
    { id: "then-discuss", label: "Discuss the shape" },
    { id: "then-play", label: "Just play it again" },
  ],
  "letter-c": [
    { id: "then-slow", label: "At half tempo" },
    { id: "then-full", label: "Full tempo, commit" },
  ],
  break: [
    { id: "then-snack", label: "Get snacks" },
    { id: "then-reflect", label: "Reflect silently" },
  ],
  stare: [
    { id: "then-play", label: "Then just play" },
    { id: "then-stare-more", label: "Continue staring" },
  ],
};

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q7RescueRehearsal({ onAnswer }: Props) {
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);

  const submit = useCallback(() => {
    if (!firstChoice) return;
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    const mapping: Record<string, Partial<QuizAnswer["traitDeltas"]>> = {
      joke: { charismaTheatricality: 0.25, diplomaticInstinct: 0.2, playfulUnpredictability: 0.15 },
      subdivide: { structuralDiscipline: 0.3, rhythmicDecisiveness: 0.2, practicalPreparedness: 0.1 },
      sing: { emotionalWarmth: 0.25, expressiveDanger: 0.15, charismaTheatricality: 0.1 },
      "letter-c": { structuralDiscipline: 0.2, practicalPreparedness: 0.2, stabilizingPresence: 0.15 },
      break: { diplomaticInstinct: 0.3, emotionalWarmth: 0.15, stabilizingPresence: 0.1 },
      stare: { introspectiveDepth: 0.25, expressiveDanger: 0.2, charismaTheatricality: 0.15 },
    };

    const deltas = mapping[firstChoice] || {};
    for (const [k, v] of Object.entries(deltas)) {
      traitDeltas[k as keyof typeof traitDeltas] = v;
    }

    tags.push({ id: `chose-${firstChoice}`, label: `chose ${ACTIONS.find((a) => a.id === firstChoice)?.label.toLowerCase()}` });

    if (firstChoice === "stare" && secondChoice === "then-stare-more") {
      tags.push({ id: "double-stare", label: "chose diplomacy through silence" });
      traitDeltas.introspectiveDepth = (traitDeltas.introspectiveDepth || 0) + 0.15;
    }

    onAnswer({
      questionId: "rescue-rehearsal",
      traitDeltas,
      tags,
      rawData: { firstChoice, secondChoice },
    });
  }, [firstChoice, secondChoice, onAnswer]);

  const followups = firstChoice ? FOLLOWUPS[firstChoice] : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        The room is spiraling.
      </h3>
      <p className="text-ivory/40 text-xs mb-8 text-center">
        {!firstChoice
          ? "What do you do first?"
          : !secondChoice
          ? "And then?"
          : "Noted."}
      </p>

      {!firstChoice && (
        <div className="w-full max-w-xs space-y-2">
          {ACTIONS.map((action) => (
            <motion.button
              key={action.id}
              onClick={() => setFirstChoice(action.id)}
              whileTap={{ scale: 0.97 }}
              className="w-full px-4 py-3 text-sm text-left border border-ivory/10 bg-warm-gray/30 text-ivory/60 hover:border-ivory/25 hover:text-ivory/80 transition-all"
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      )}

      {firstChoice && !secondChoice && followups && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs space-y-2"
        >
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-3">
            First: {ACTIONS.find((a) => a.id === firstChoice)?.label}
          </p>
          {followups.map((action) => (
            <motion.button
              key={action.id}
              onClick={() => setSecondChoice(action.id)}
              whileTap={{ scale: 0.97 }}
              className="w-full px-4 py-3 text-sm text-left border border-ivory/10 bg-warm-gray/30 text-ivory/60 hover:border-ivory/25 hover:text-ivory/80 transition-all"
            >
              {action.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {firstChoice && secondChoice && (
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
