"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

const ITEMS = [
  "Tuner",
  "Espresso",
  "Extra strings",
  "Annotated score",
  "Lucky pencil",
  "Perfume atomizer",
  "Protein bar",
  "Emotional resilience",
  "Second pair of shoes",
  "Throat lozenges",
];

const MAX_ITEMS = 4;

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

export default function Q3FestivalBag({ onAnswer }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [overLimitAttempts, setOverLimitAttempts] = useState(0);

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else if (selected.length < MAX_ITEMS) {
      setSelected([...selected, item]);
    } else {
      setOverLimitAttempts((c) => c + 1);
    }
  };

  const submit = useCallback(() => {
    const traitDeltas: QuizAnswer["traitDeltas"] = {};
    const tags: QuizAnswer["tags"] = [];

    const practical = ["Tuner", "Extra strings", "Protein bar", "Annotated score"];
    const charismatic = ["Espresso", "Perfume atomizer", "Second pair of shoes"];
    const anxious = ["Extra strings", "Throat lozenges", "Emotional resilience"];

    let practicalCount = 0, charismaCount = 0, anxiousCount = 0;
    for (const item of selected) {
      if (practical.includes(item)) practicalCount++;
      if (charismatic.includes(item)) charismaCount++;
      if (anxious.includes(item)) anxiousCount++;
    }

    traitDeltas.practicalPreparedness = practicalCount * 0.15;
    traitDeltas.charismaTheatricality = charismaCount * 0.15;

    if (selected.includes("Emotional resilience")) {
      traitDeltas.stabilizingPresence = 0.2;
      traitDeltas.introspectiveDepth = 0.15;
    }
    if (selected.includes("Espresso") && selected.includes("Perfume atomizer")) {
      traitDeltas.expressiveDanger = 0.2;
      traitDeltas.playfulUnpredictability = 0.15;
      tags.push({ id: "packed-for-charisma", label: "packed for charisma" });
    }
    if (!selected.includes("Extra strings") && !selected.includes("Tuner")) {
      traitDeltas.practicalPreparedness = Math.max(0, (traitDeltas.practicalPreparedness || 0) - 0.2);
      tags.push({ id: "unprepared", label: "lives dangerously" });
    }
    if (practicalCount >= 3) {
      tags.push({ id: "overpacked", label: "overpacked" });
    }
    if (overLimitAttempts > 2) {
      tags.push({ id: "over-limit", label: "struggled with limits" });
    }

    onAnswer({
      questionId: "festival-bag",
      traitDeltas,
      tags,
      rawData: { selected, overLimitAttempts },
    });
  }, [selected, overLimitAttempts, onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">
        You have room for only four.
      </h3>
      <p className="text-ivory/40 text-xs mb-6 text-center">
        Select {MAX_ITEMS} items for your festival bag.
      </p>

      <div className="w-full max-w-sm grid grid-cols-2 gap-2 mb-2">
        {ITEMS.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <motion.button
              key={item}
              onClick={() => toggleItem(item)}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-3 text-xs text-left border transition-all duration-200 ${
                isSelected
                  ? "border-gold/50 bg-gold/10 text-ivory/90"
                  : "border-ivory/10 bg-warm-gray/30 text-ivory/50 hover:border-ivory/20"
              }`}
            >
              {item}
            </motion.button>
          );
        })}
      </div>

      <p className="text-ivory/30 text-[10px] mb-6">
        {selected.length} / {MAX_ITEMS} selected
        {overLimitAttempts > 0 && (
          <span className="text-gold/60 ml-2">
            {overLimitAttempts > 2 ? "You must choose." : "Bag is full."}
          </span>
        )}
      </p>

      <button
        onClick={submit}
        disabled={selected.length !== MAX_ITEMS}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
