"use client";

import { motion } from "framer-motion";

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="font-serif text-2xl mb-8">Before we begin</h2>

          <p className="text-ivory/60 text-sm leading-relaxed mb-4">
            This assessment will evaluate your musical instincts, emotional
            availability, rehearsal survivability, and chamber alignment through
            a series of eight calibrated prompts.
          </p>

          <p className="text-ivory/40 text-xs leading-relaxed mb-10">
            Approximately 3 minutes. No preparation required. Perfect intonation
            not expected.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={onStart}
          className="btn-primary w-full max-w-xs"
        >
          Start Assessment
        </motion.button>
      </div>
    </motion.div>
  );
}
