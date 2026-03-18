
import { useCallback, useState } from "react";
import { QuizAnswer, QuizPhase, QuizResult } from "./types";
import { computeResult } from "./scoring";

export interface QuizState {
  phase: QuizPhase;
  questionIndex: number;
  answers: QuizAnswer[];
  result: QuizResult | null;
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    phase: "landing",
    questionIndex: 0,
    answers: [],
    result: null,
  });

  const setPhase = useCallback((phase: QuizPhase) => {
    setState((s) => ({ ...s, phase }));
  }, []);

  const startQuiz = useCallback(() => {
    setState({ phase: "quiz", questionIndex: 0, answers: [], result: null });
  }, []);

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    setState((s) => {
      const answers = [...s.answers, answer];
      const nextIndex = s.questionIndex + 1;
      if (nextIndex >= 9) {
        const result = computeResult(answers);
        return { ...s, answers, questionIndex: nextIndex, phase: "analysis", result };
      }
      return { ...s, answers, questionIndex: nextIndex };
    });
  }, []);

  const restart = useCallback(() => {
    setState({ phase: "landing", questionIndex: 0, answers: [], result: null });
  }, []);

  const showResult = useCallback(() => {
    setState((s) => ({ ...s, phase: "result" }));
  }, []);

  return { state, setPhase, startQuiz, submitAnswer, restart, showResult };
}
