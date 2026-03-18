
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";
import { MCQ_QUESTIONS } from "@/lib/mcqQuestions";
import MCQQuestion from "./quiz/MCQQuestion";
import Q1PhraseArc from "./quiz/Q1PhraseArc";
import Q8DangerSlider from "./quiz/Q8DangerSlider";

interface Props {
  questionIndex: number;
  onAnswer: (answer: QuizAnswer) => void;
}

const TOTAL_QUESTIONS = 8;

export default function QuizScreen({ questionIndex, onAnswer }: Props) {
  const isMCQ = questionIndex < 6;

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
            style={{ width: `${((questionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
        <div className="text-center py-2">
          <span className="text-ivory/30 text-[10px] uppercase tracking-[0.2em]">
            {questionIndex + 1} of {TOTAL_QUESTIONS}
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
          {isMCQ ? (
            <MCQQuestion
              question={MCQ_QUESTIONS[questionIndex]}
              onAnswer={onAnswer}
            />
          ) : questionIndex === 6 ? (
            <Q1PhraseArc onAnswer={onAnswer} />
          ) : (
            <Q8DangerSlider onAnswer={onAnswer} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
