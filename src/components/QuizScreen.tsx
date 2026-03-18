
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";
import { MCQ_QUESTIONS } from "@/lib/mcqQuestions";
import MCQQuestion from "./quiz/MCQQuestion";
import Q6InterpretiveBudget from "./quiz/Q6InterpretiveBudget";
import Q1PhraseArc from "./quiz/Q1PhraseArc";
import Q8DangerSlider from "./quiz/Q8DangerSlider";

interface Props {
  questionIndex: number;
  onAnswer: (answer: QuizAnswer) => void;
}

const TOTAL_QUESTIONS = 9;

export default function QuizScreen({ questionIndex, onAnswer }: Props) {
  const renderQuestion = () => {
    if (questionIndex < 6) {
      return (
        <MCQQuestion
          question={MCQ_QUESTIONS[questionIndex]}
          onAnswer={onAnswer}
        />
      );
    }
    switch (questionIndex) {
      case 6:
        return <Q6InterpretiveBudget onAnswer={onAnswer} />;
      case 7:
        return <Q1PhraseArc onAnswer={onAnswer} />;
      case 8:
        return <Q8DangerSlider onAnswer={onAnswer} />;
      default:
        return null;
    }
  };

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
          {renderQuestion()}
        </motion.div>
      </div>
    </motion.div>
  );
}
