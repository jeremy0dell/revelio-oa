"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { memberList } from "@/lib/members";
import { QuizResult, MemberProfile } from "@/lib/types";

interface Props {
  onBack: () => void;
  result: QuizResult | null;
}

function MemberCard({ member, isAssigned }: { member: MemberProfile; isAssigned: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`card-elevated p-5 ${isAssigned ? "border-gold/30" : ""}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif text-xl">
              {member.name}
              {isAssigned && (
                <span className="text-gold/60 text-xs ml-2 font-sans uppercase tracking-[0.1em]">
                  Your result
                </span>
              )}
            </h3>
            <p className="text-ivory/40 text-xs">{member.instrument}</p>
          </div>
          <span className="text-ivory/30 text-xs">{expanded ? "−" : "+"}</span>
        </div>
        <p className="text-gold/70 text-sm italic">{member.shortArchetype}</p>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              <p className="text-ivory/50 text-sm leading-relaxed">
                {member.resultBody}
              </p>

              <div>
                <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-2">
                  Green flags
                </p>
                <ul className="space-y-1">
                  {member.greenFlags.map((flag, i) => (
                    <li key={i} className="text-ivory/50 text-xs">
                      + {flag}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-2">
                  Red flags
                </p>
                <ul className="space-y-1">
                  {member.redFlags.map((flag, i) => (
                    <li key={i} className="text-ivory/50 text-xs">
                      − {flag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
                    Rehearsal role
                  </p>
                  <p className="text-ivory/50 text-xs">{member.rehearsalRole}</p>
                </div>
                <div>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[0.15em] mb-1">
                    Ideal repertoire date
                  </p>
                  <p className="text-ivory/50 text-xs">{member.repertoireDate}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MembersScreen({ onBack, result }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col px-6 py-12 safe-top safe-bottom"
    >
      <div className="max-w-sm w-full mx-auto">
        <button
          onClick={onBack}
          className="text-ivory/40 text-xs uppercase tracking-[0.15em] mb-6 hover:text-ivory/60 transition-colors"
        >
          ← Back to result
        </button>

        <h2 className="font-serif text-2xl mb-8 text-center">
          Meet the Ensemble
        </h2>

        <div className="space-y-4">
          {memberList.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isAssigned={result?.primaryMember === member.id}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
