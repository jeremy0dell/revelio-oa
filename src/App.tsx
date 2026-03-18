import { useQuiz } from "@/lib/useQuiz";
import { AnimatePresence } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import IntroScreen from "@/components/IntroScreen";
import QuizScreen from "@/components/QuizScreen";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultScreen from "@/components/ResultScreen";
import MembersScreen from "@/components/MembersScreen";
import AboutScreen from "@/components/AboutScreen";

export default function App() {
  const { state, setPhase, startQuiz, submitAnswer, restart, showResult } =
    useQuiz();

  const renderPhase = () => {
    switch (state.phase) {
      case "landing":
        return (
          <LandingScreen
            key="landing"
            onBegin={() => setPhase("intro")}
            onAbout={() => setPhase("about")}
          />
        );
      case "intro":
        return <IntroScreen key="intro" onStart={startQuiz} />;
      case "quiz":
        return (
          <QuizScreen
            key="quiz"
            questionIndex={state.questionIndex}
            onAnswer={submitAnswer}
          />
        );
      case "analysis":
        return <AnalysisScreen key="analysis" onComplete={showResult} />;
      case "result":
        return state.result ? (
          <ResultScreen
            key="result"
            result={state.result}
            onRetake={restart}
            onViewMembers={() => setPhase("members")}
          />
        ) : null;
      case "members":
        return (
          <MembersScreen
            key="members"
            onBack={() => setPhase("result")}
            result={state.result}
          />
        );
      case "about":
        return (
          <AboutScreen key="about" onBack={() => setPhase("landing")} />
        );
    }
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </main>
  );
}
