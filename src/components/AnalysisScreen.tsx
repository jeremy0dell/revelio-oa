
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PHRASES = [
  "Assessing phrase architecture",
  "Measuring rubato tolerance",
  "Reviewing conflict posture",
  "Estimating snack-table charisma",
  "Calculating inner-voice stability",
  "Evaluating rehearsal diplomacy index",
  "Cross-referencing emotional availability",
  "Finalizing chamber alignment",
];

interface Props {
  onComplete: () => void;
}

export default function AnalysisScreen({ onComplete }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 400);

    const skipTimer = setTimeout(() => setCanSkip(true), 1500);
    const autoComplete = setTimeout(onComplete, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
      clearTimeout(autoComplete);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm mx-auto">
        {/* Spinning indicator */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border border-gold/40 border-t-gold rounded-full mx-auto mb-10"
        />

        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-ivory/50 text-xs uppercase tracking-[0.2em] mb-2"
        >
          {PHRASES[phraseIndex]}
        </motion.p>

        <div className="flex gap-1 justify-center mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1 h-1 bg-gold rounded-full"
            />
          ))}
        </div>

        {canSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onComplete}
            className="mt-10 text-ivory/30 text-[10px] uppercase tracking-[0.15em] hover:text-ivory/50 transition-colors"
          >
            Skip
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
