
import { useState } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";
import { MCQQuestion as MCQQuestionData } from "@/lib/mcqQuestions";

interface Props {
  question: MCQQuestionData;
  onAnswer: (answer: QuizAnswer) => void;
}

export default function MCQQuestion({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return; // prevent double-tap
    setSelected(index);
    const option = question.options[index];

    // Brief delay so the user sees their selection highlighted
    setTimeout(() => {
      onAnswer({
        questionId: question.id,
        memberScores: option.score,
        tags: [],
        rawData: { selectedIndex: index, selectedLabel: option.label },
      });
    }, 350);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-xl md:text-2xl mb-8 text-center leading-snug max-w-xs">
        {question.prompt}
      </h3>

      <div className="w-full max-w-sm space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isPast = selected !== null && !isSelected;

          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              whileTap={{ scale: 0.97 }}
              className={`w-full px-5 py-4 text-sm text-left border transition-all duration-300 leading-relaxed ${
                isSelected
                  ? "border-gold/60 bg-gold/10 text-ivory/90"
                  : isPast
                  ? "border-ivory/5 bg-warm-gray/20 text-ivory/20"
                  : "border-ivory/15 bg-warm-gray/30 text-ivory/60 hover:border-ivory/25 hover:text-ivory/80"
              }`}
              disabled={selected !== null}
              aria-pressed={isSelected}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
