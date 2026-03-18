"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { QuizResult, TraitAxis } from "@/lib/types";
import { members } from "@/lib/members";
import { TRAIT_LABELS } from "@/lib/scoring";

interface Props {
  result: QuizResult;
  onRetake: () => void;
  onViewMembers: () => void;
}

const MEMBER_EMOJI: Record<string, string> = {
  angela: "🎻",
  justin: "🎻",
  benjamin: "🎶",
  russell: "🎻",
};

export default function ResultScreen({ result, onRetake, onViewMembers }: Props) {
  const member = members[result.primaryMember];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Which Balourdet Are You?",
      text: `I'm ${member.name} — ${member.shortArchetype}. Take the quiz to find your chamber alignment.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — fall back to clipboard
        await navigator.clipboard?.writeText(
          `${shareData.text}\n${shareData.url}`
        );
      }
    } else {
      await navigator.clipboard?.writeText(
        `${shareData.text}\n${shareData.url}`
      );
    }
  }, [member]);

  const handleSaveCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#1A1A1A",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `balourdet-${member.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silent fail on image generation
    }
  }, [member]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-dvh flex flex-col items-center px-6 py-12 safe-top safe-bottom"
    >
      <div className="max-w-sm w-full mx-auto">
        {/* Share card region */}
        <div ref={cardRef} className="pb-6">
          {/* Primary result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-ivory/30 text-[10px] uppercase tracking-[0.25em] mb-4">
              Your result
            </p>

            <div className="w-20 h-20 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-5 bg-warm-gray/30">
              <span className="text-3xl" role="img" aria-label={member.instrument}>
                {MEMBER_EMOJI[member.id]}
              </span>
            </div>

            <h2 className="font-serif text-3xl mb-2">You are {member.name}.</h2>
            <p className="text-gold/80 text-sm italic">{member.shortArchetype}</p>
          </motion.div>

          {/* Trait chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mb-8"
          >
            {result.topTraits.slice(0, 3).map((trait) => (
              <span key={trait} className="trait-chip">
                {TRAIT_LABELS[trait]}
              </span>
            ))}
          </motion.div>

          {/* Analysis paragraph */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-ivory/60 text-sm leading-relaxed">
              {member.resultBody}
            </p>
          </motion.div>

          {/* Trait bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-3 mb-8"
          >
            {result.topTraits.slice(0, 5).map((trait) => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span className="text-ivory/40 text-[10px] uppercase tracking-[0.1em]">
                    {TRAIT_LABELS[trait]}
                  </span>
                  <span className="text-ivory/30 text-[10px] tabular-nums">
                    {Math.round(result.traitScores[trait] * 100)}
                  </span>
                </div>
                <div className="h-[3px] bg-ivory/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.traitScores[trait] * 100}%` }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Warning label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="card-elevated p-4 mb-4"
        >
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
            Warning label
          </p>
          <p className="text-ivory/60 text-xs leading-relaxed">
            {result.warningLabel}
          </p>
        </motion.div>

        {/* Chamber relationship status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="card-elevated p-4 mb-4"
        >
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
            Chamber relationship status
          </p>
          <p className="text-ivory/60 text-xs leading-relaxed">
            {result.chamberRelationship}
          </p>
        </motion.div>

        {/* Repertoire match */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="card-elevated p-4 mb-4"
        >
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
            Ideal repertoire match
          </p>
          <p className="text-ivory/60 text-xs leading-relaxed">
            {result.repertoireMatch}
          </p>
        </motion.div>

        {/* Rehearsal role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="card-elevated p-4 mb-6"
        >
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
            Likely rehearsal role
          </p>
          <p className="text-ivory/60 text-xs leading-relaxed">
            {member.rehearsalRole}
          </p>
        </motion.div>

        {/* Behavioral tags */}
        {result.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-8"
          >
            <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-3 text-center">
              Why we assigned this result
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {result.tags.slice(0, 5).map((tag, i) => (
                <span key={i} className="text-ivory/40 text-[10px] border border-ivory/10 px-2 py-1">
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col gap-3 items-center"
        >
          <button onClick={handleShare} className="btn-primary w-full">
            Share Result
          </button>
          <button onClick={handleSaveCard} className="btn-secondary w-full">
            Save Card
          </button>
          <div className="flex gap-3 w-full">
            <button onClick={onRetake} className="btn-secondary flex-1">
              Retake
            </button>
            <button onClick={onViewMembers} className="btn-secondary flex-1">
              Meet the Others
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
