"use client";

import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";
import Q1PhraseArc from "./quiz/Q1PhraseArc";
import Q2RehearsalPriorities from "./quiz/Q2RehearsalPriorities";
import Q3FestivalBag from "./quiz/Q3FestivalBag";
import Q4PulseTest from "./quiz/Q4PulseTest";
import Q5SustainTest from "./quiz/Q5SustainTest";
import Q6InterpretiveBudget from "./quiz/Q6InterpretiveBudget";
import Q7RescueRehearsal from "./quiz/Q7RescueRehearsal";
import Q8DangerSlider from "./quiz/Q8DangerSlider";

interface Props {
  questionIndex: number;
  onAnswer: (answer: QuizAnswer) => void;
}

const QUESTIONS = [
  Q1PhraseArc,
  Q2RehearsalPriorities,
  Q3FestivalBag,
  Q4PulseTest,
  Q5SustainTest,
  Q6InterpretiveBudget,
  Q7RescueRehearsal,
  Q8DangerSlider,
];

export default function QuizScreen({ questionIndex, onAnswer }: Props) {
  const QuestionComponent = QUESTIONS[questionIndex];
  if (!QuestionComponent) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col"
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 safe-top">
        <div className="h-[2px] bg-ivory/10 w-full">
          <div
            className="progress-bar"
            style={{ width: `${((questionIndex + 1) / 8) * 100}%` }}
          />
        </div>
        <div className="text-center py-2">
          <span className="text-ivory/30 text-[10px] uppercase tracking-[0.2em]">
            {questionIndex + 1} of 8
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col pt-14 pb-8 px-6">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col"
        >
          <QuestionComponent onAnswer={onAnswer} />
        </motion.div>
      </div>
    </motion.div>
  );
}
