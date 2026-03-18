import {
  TraitAxis,
  TraitVector,
  QuizAnswer,
  QuizResult,
  MemberId,
  ALL_MEMBERS,
} from "./types";
import { members, memberList } from "./members";

// ── Trait axis utilities ──────────────────────────────────────────

const TRAIT_AXES: TraitAxis[] = [
  "structuralDiscipline",
  "emotionalWarmth",
  "rhythmicDecisiveness",
  "expressiveDanger",
  "diplomaticInstinct",
  "practicalPreparedness",
  "charismaTheatricality",
  "introspectiveDepth",
  "stabilizingPresence",
  "playfulUnpredictability",
];

const emptyVector = (): TraitVector => {
  const v = {} as TraitVector;
  TRAIT_AXES.forEach((a) => (v[a] = 0));
  return v;
};

const emptyTally = (): Record<MemberId, number> => ({
  angela: 0,
  justin: 0,
  benjamin: 0,
  russell: 0,
});

// ── Weighting constants ───────────────────────────────────────────

/** MCQ portion of the final score (45%) */
const MCQ_WEIGHT = 0.45;
/** Weird-input portion of the final score (55%) */
const WEIRD_WEIGHT = 0.55;

// ── MCQ tally ─────────────────────────────────────────────────────

function tallyMCQ(answers: QuizAnswer[]): Record<MemberId, number> {
  const tallies = emptyTally();
  for (const answer of answers) {
    if (!answer.memberScores) continue;
    for (const [id, pts] of Object.entries(answer.memberScores)) {
      tallies[id as MemberId] += pts;
    }
  }
  return tallies;
}

// ── Weird-input trait aggregation → member scores ─────────────────

function aggregateTraits(answers: QuizAnswer[]): TraitVector {
  const totals = emptyVector();
  for (const answer of answers) {
    if (!answer.traitDeltas) continue;
    for (const [axis, delta] of Object.entries(answer.traitDeltas)) {
      totals[axis as TraitAxis] += delta as number;
    }
  }
  // Normalize to 0-1
  const maxVal = Math.max(...Object.values(totals), 0.01);
  for (const axis of TRAIT_AXES) {
    totals[axis] = Math.max(0, Math.min(1, totals[axis] / maxVal));
  }
  return totals;
}

function cosineSimilarity(a: TraitVector, b: TraitVector): number {
  let dot = 0,
    magA = 0,
    magB = 0;
  for (const axis of TRAIT_AXES) {
    dot += a[axis] * b[axis];
    magA += a[axis] * a[axis];
    magB += b[axis] * b[axis];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/** Convert trait-axis scores into per-member similarity scores (0-1) */
function traitToMemberScores(traits: TraitVector): Record<MemberId, number> {
  const scores = emptyTally();
  for (const member of memberList) {
    scores[member.id] = cosineSimilarity(traits, member.targetVector);
  }
  return scores;
}

// ── Tie-breaking rules ────────────────────────────────────────────

type TieBreakPair = [MemberId, MemberId];

/**
 * Tie-break order for pairs, keyed by sorted pair string.
 * Each entry says: given these two tied members, which answer
 * data should break the tie and toward which member.
 */
interface TieBreaker {
  pair: TieBreakPair;
  /** Which weird-input trait axis favors member A */
  favorA: TraitAxis;
  /** Which weird-input trait axis favors member B */
  favorB: TraitAxis;
}

const TIE_BREAKERS: TieBreaker[] = [
  // phrase arc breaks Angela vs Justin (expressiveDanger → Angela, introspective → Justin)
  { pair: ["angela", "justin"], favorA: "expressiveDanger", favorB: "introspectiveDepth" },
  // ranking / structural breaks Justin vs Benjamin
  { pair: ["justin", "benjamin"], favorA: "structuralDiscipline", favorB: "introspectiveDepth" },
  // sound / sustain / grounding breaks Benjamin vs Russell
  { pair: ["benjamin", "russell"], favorA: "introspectiveDepth", favorB: "stabilizingPresence" },
  // tempo pulse / attack confidence breaks Angela vs Russell
  { pair: ["angela", "russell"], favorA: "rhythmicDecisiveness", favorB: "stabilizingPresence" },
];

function breakTie(
  a: MemberId,
  b: MemberId,
  traits: TraitVector
): MemberId {
  for (const tb of TIE_BREAKERS) {
    const [p1, p2] = tb.pair;
    if ((a === p1 && b === p2) || (a === p2 && b === p1)) {
      const memberA = a === p1 ? a : b;
      const memberB = a === p1 ? b : a;
      return traits[tb.favorA] >= traits[tb.favorB] ? memberA : memberB;
    }
  }
  // Fallback: alphabetical
  return a < b ? a : b;
}

// ── Main scoring function ─────────────────────────────────────────

export function computeResult(answers: QuizAnswer[]): QuizResult {
  // 1. Separate MCQ answers from weird-input answers
  const mcqAnswers = answers.filter((a) => a.memberScores);
  const weirdAnswers = answers.filter((a) => a.traitDeltas);

  // 2. MCQ tallies
  const mcqTallies = tallyMCQ(mcqAnswers);

  // 3. Normalize MCQ tallies to 0-1
  const maxMcq = Math.max(...Object.values(mcqTallies), 1);
  const mcqNorm = emptyTally();
  for (const id of ALL_MEMBERS) {
    mcqNorm[id] = mcqTallies[id] / maxMcq;
  }

  // 4. Trait scores from weird inputs
  const traitScores = aggregateTraits(weirdAnswers);
  const weirdMemberScores = traitToMemberScores(traitScores);

  // 5. Weighted blend
  const finalScores = emptyTally();
  for (const id of ALL_MEMBERS) {
    finalScores[id] = MCQ_WEIGHT * mcqNorm[id] + WEIRD_WEIGHT * weirdMemberScores[id];
  }

  // 6. Determine primary member
  //    Check MCQ gap: if top lead is 4+ points over second, lock it
  const sortedMcq = ALL_MEMBERS.slice().sort((a, b) => mcqTallies[b] - mcqTallies[a]);
  const mcqGap = mcqTallies[sortedMcq[0]] - mcqTallies[sortedMcq[1]];

  let primaryMember: MemberId;

  if (mcqGap >= 4) {
    // Lock the MCQ front-runner
    primaryMember = sortedMcq[0];
  } else {
    // Use blended final scores
    const sorted = ALL_MEMBERS.slice().sort((a, b) => finalScores[b] - finalScores[a]);
    if (Math.abs(finalScores[sorted[0]] - finalScores[sorted[1]]) < 0.01) {
      // Tied: use tie-break rules
      primaryMember = breakTie(sorted[0], sorted[1], traitScores);
    } else {
      primaryMember = sorted[0];
    }
  }

  // 7. Collect tags
  const tags = answers.flatMap((a) => a.tags);

  // 8. Top traits (from weird inputs) for flavor text
  const topTraits = getTopTraits(traitScores);

  // 9. Warning label, chamber relationship, repertoire match
  const mostExtreme = TRAIT_AXES.reduce((a, b) =>
    Math.abs(traitScores[a] - 0.5) > Math.abs(traitScores[b] - 0.5) ? a : b
  );
  const warningLabel = WARNING_LABELS[mostExtreme];
  const chamberRelationship = findFirst(CHAMBER_RELATIONSHIPS, traitScores);
  const repertoireMatch = findFirst(REPERTOIRE_MATCHES, traitScores);

  return {
    primaryMember,
    mcqTallies,
    finalScores,
    traitScores,
    topTraits,
    tags,
    warningLabel,
    chamberRelationship,
    repertoireMatch,
  };
}

// ── Helpers ───────────────────────────────────────────────────────

function getTopTraits(traits: TraitVector, count = 3): TraitAxis[] {
  return TRAIT_AXES.slice()
    .sort((a, b) => traits[b] - traits[a])
    .slice(0, count);
}

const WARNING_LABELS: Record<TraitAxis, string> = {
  structuralDiscipline: "May restructure your rehearsal plan without asking.",
  emotionalWarmth: "Will feel responsible for the room's emotional climate.",
  rhythmicDecisiveness: "Treats rubato as a controlled substance.",
  expressiveDanger: "Interprets 'mezzo forte' as a dare.",
  diplomaticInstinct: "Will agree to your tempo and then not play it.",
  practicalPreparedness: "Has a backup plan for the backup plan.",
  charismaTheatricality:
    "Cannot play a passage the same way twice. Refuses to try.",
  introspectiveDepth: "May disappear emotionally between movements.",
  stabilizingPresence: "Carries the ensemble's stress and calls it 'warmth.'",
  playfulUnpredictability:
    "Will add an ornament in performance that was never discussed.",
};

const CHAMBER_RELATIONSHIPS: [(t: TraitVector) => boolean, string][] = [
  [
    (t) => t.structuralDiscipline > 0.7 && t.emotionalWarmth > 0.7,
    "Committed to structure, emotionally available for Brahms.",
  ],
  [
    (t) => t.expressiveDanger > 0.7 && t.rhythmicDecisiveness > 0.6,
    "Flirting with volatility. Has been warned.",
  ],
  [
    (t) => t.diplomaticInstinct > 0.7 && t.stabilizingPresence > 0.6,
    "In a stable, long-term relationship with harmonic function.",
  ],
  [
    (t) => t.charismaTheatricality > 0.7,
    "Wants blend, secretly wants attention.",
  ],
  [
    (t) => t.introspectiveDepth > 0.7,
    "Emotionally available, but only during slow movements.",
  ],
  [
    (t) => t.playfulUnpredictability > 0.6 && t.expressiveDanger > 0.5,
    "Not yet ready for Bartók. Will attempt it anyway.",
  ],
  [() => true, "Currently accepting applications for a compatible ensemble."],
];

const REPERTOIRE_MATCHES: [(t: TraitVector) => boolean, string][] = [
  [
    (t) => t.structuralDiscipline > 0.7 && t.emotionalWarmth > 0.6,
    "Brahms Piano Quartet in G minor — the one that makes you stare out of windows.",
  ],
  [
    (t) => t.expressiveDanger > 0.7 && t.rhythmicDecisiveness > 0.6,
    "Bartók String Quartet No. 4 — all edges, no apologies.",
  ],
  [
    (t) => t.diplomaticInstinct > 0.7 && t.structuralDiscipline > 0.5,
    "Haydn Op. 76 No. 3 — elegance as a complete argument.",
  ],
  [
    (t) => t.introspectiveDepth > 0.7,
    "Beethoven Op. 132 — the Holy Song of Thanksgiving, obviously.",
  ],
  [
    (t) => t.charismaTheatricality > 0.7,
    "Schumann Piano Quintet — main character energy, canonized.",
  ],
  [
    (t) => t.emotionalWarmth > 0.7,
    "Dvořák 'American' — warmth so pure it borders on structural.",
  ],
  [() => true, "Ravel String Quartet — beauty that never explains itself."],
];

function findFirst<T>(
  rules: [(t: TraitVector) => boolean, T][],
  traits: TraitVector
): T {
  for (const [pred, val] of rules) {
    if (pred(traits)) return val;
  }
  return rules[rules.length - 1][1];
}

export const TRAIT_LABELS: Record<TraitAxis, string> = {
  structuralDiscipline: "Structural Discipline",
  emotionalWarmth: "Emotional Warmth",
  rhythmicDecisiveness: "Rhythmic Decisiveness",
  expressiveDanger: "Expressive Danger",
  diplomaticInstinct: "Diplomatic Instinct",
  practicalPreparedness: "Practical Preparedness",
  charismaTheatricality: "Charisma",
  introspectiveDepth: "Introspective Depth",
  stabilizingPresence: "Stabilizing Presence",
  playfulUnpredictability: "Playful Unpredictability",
};
