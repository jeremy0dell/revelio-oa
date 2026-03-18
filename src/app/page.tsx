"use client";

import { useQuiz } from "@/lib/useQuiz";
import { AnimatePresence } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import IntroScreen from "@/components/IntroScreen";
import QuizScreen from "@/components/QuizScreen";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultScreen from "@/components/ResultScreen";
import MembersScreen from "@/components/MembersScreen";
import AboutScreen from "@/components/AboutScreen";

export default function Home() {
  const { state, setPhase, startQuiz, submitAnswer, restart, showResult } =
    useQuiz();

  return (
    <main className="min-h-dvh flex flex-col">
      <AnimatePresence mode="wait">
        {state.phase === "landing" && (
          <LandingScreen
            key="landing"
            onBegin={() => setPhase("intro")}
            onAbout={() => setPhase("about")}
          />
        )}

        {state.phase === "intro" && (
          <IntroScreen key="intro" onStart={startQuiz} />
        )}

        {state.phase === "quiz" && (
          <QuizScreen
            key="quiz"
            questionIndex={state.questionIndex}
            onAnswer={submitAnswer}
          />
        )}

        {state.phase === "analysis" && (
          <AnalysisScreen key="analysis" onComplete={showResult} />
        )}

        {state.phase === "result" && state.result && (
          <ResultScreen
            key="result"
            result={state.result}
            onRetake={restart}
            onViewMembers={() => setPhase("members")}
          />
        )}

        {state.phase === "members" && (
          <MembersScreen
            key="members"
            onBack={() => setPhase("result")}
            result={state.result}
          />
        )}

        {state.phase === "about" && (
          <AboutScreen key="about" onBack={() => setPhase("landing")} />
        )}
      </AnimatePresence>
    </main>
  );
}
