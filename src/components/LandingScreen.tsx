"use client";

import { motion } from "framer-motion";

interface Props {
  onBegin: () => void;
  onAbout: () => void;
}

export default function LandingScreen({ onBegin, onAbout }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight mb-6">
            Which Balourdet
            <br />
            Are You?
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-ivory/50 text-sm leading-relaxed mb-12 max-w-xs mx-auto"
        >
          You may think you know your ensemble energy. This brief assessment may
          disagree.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col gap-4 items-center"
        >
          <button onClick={onBegin} className="btn-primary w-full max-w-xs">
            Begin
          </button>
          <button onClick={onAbout} className="btn-secondary">
            What is this
          </button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-[10px] text-ivory/25 tracking-wide"
      >
        An April Fools production. No actual matchmaking occurs.
      </motion.p>
    </motion.div>
  );
}
