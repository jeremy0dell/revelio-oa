"use client";

import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

const ITEMS = ["Warmth", "Precision", "Mystery", "Structure", "Chemistry"];

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q2RehearsalPriorities({ onAnswer }: Props) {
  const [order, setOrder] = useState(ITEMS);

  const submit = useCallback(() => {
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    // Top item gets strongest weight
    const topItem = order[0];
    const secondItem = order[1];

    const mapping: Record<string, Partial<QuizAnswer["traitDeltas"]>> = {
      Warmth: { emotionalWarmth: 0.35, stabilizingPresence: 0.15 },
      Precision: { structuralDiscipline: 0.35, rhythmicDecisiveness: 0.15 },
      Mystery: { introspectiveDepth: 0.3, expressiveDanger: 0.2 },
      Structure: { structuralDiscipline: 0.2, practicalPreparedness: 0.25 },
      Chemistry: { charismaTheatricality: 0.25, playfulUnpredictability: 0.2 },
    };

    // Apply top priority at full weight
    const topDeltas = mapping[topItem] || {};
    for (const [k, v] of Object.entries(topDeltas)) {
      traitDeltas[k as keyof typeof traitDeltas] = v;
    }

    // Apply second priority at half weight
    const secondDeltas = mapping[secondItem] || {};
    for (const [k, v] of Object.entries(secondDeltas)) {
      traitDeltas[k as keyof typeof traitDeltas] =
        (traitDeltas[k as keyof typeof traitDeltas] || 0) + (v || 0) * 0.5;
    }

    // Bottom item gets a negative signal
    const bottomItem = order[4];
    if (bottomItem === "Warmth") {
      traitDeltas.emotionalWarmth = (traitDeltas.emotionalWarmth || 0) - 0.15;
    }
    if (bottomItem === "Chemistry") {
      tags.push({ id: "refused-chemistry", label: "refused chemistry" });
    }

    tags.push({ id: `prioritized-${topItem.toLowerCase()}`, label: `prioritized ${topItem.toLowerCase()}` });

    onAnswer({ questionId: "rehearsal-priorities", traitDeltas, tags, rawData: { order } });
  }, [order, onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        Rank what matters most.
      </h3>
      <p className="text-ivory/40 text-xs mb-8 text-center">
        Drag to reorder. Most important at top.
      </p>

      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="w-full max-w-xs space-y-2 mb-8"
      >
        {order.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            className="flex items-center gap-3 px-4 py-3 bg-warm-gray/50 border border-ivory/10 cursor-grab active:cursor-grabbing select-none"
            whileDrag={{ scale: 1.03, backgroundColor: "rgba(196, 162, 101, 0.1)" }}
          >
            <span className="text-ivory/30 text-xs w-4">{index + 1}</span>
            <span className="text-ivory/80 text-sm font-sans tracking-wide">
              {item}
            </span>
            <span className="ml-auto text-ivory/20 text-xs">⠿</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button onClick={submit} className="btn-primary">
        Continue
      </button>
    </div>
  );
}
