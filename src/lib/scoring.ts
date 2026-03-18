import {
  TraitAxis,
  TraitVector,
  QuizAnswer,
  QuizResult,
  MemberId,
  BehavioralTag,
} from "./types";
import { members, memberList } from "./members";

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

function aggregateTraits(answers: QuizAnswer[]): TraitVector {
  const totals = emptyVector();
  for (const answer of answers) {
    for (const [axis, delta] of Object.entries(answer.traitDeltas)) {
      totals[axis as TraitAxis] += delta as number;
    }
  }
  // Normalize to 0-1
  const maxVal = Math.max(...Object.values(totals), 1);
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

function findPrimaryMember(traits: TraitVector): MemberId {
  let best: MemberId = "angela";
  let bestScore = -1;
  for (const member of memberList) {
    const sim = cosineSimilarity(traits, member.targetVector);
    if (sim > bestScore) {
      bestScore = sim;
      best = member.id;
    }
  }
  return best;
}

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

const CHAMBER_RELATIONSHIPS: [
  (t: TraitVector) => boolean,
  string,
][] = [
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
    (t) =>
      t.playfulUnpredictability > 0.6 && t.expressiveDanger > 0.5,
    "Not yet ready for Bartók. Will attempt it anyway.",
  ],
  [() => true, "Currently accepting applications for a compatible ensemble."],
];

const REPERTOIRE_MATCHES: [
  (t: TraitVector) => boolean,
  string,
][] = [
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

export function computeResult(answers: QuizAnswer[]): QuizResult {
  const traitScores = aggregateTraits(answers);
  const primaryMember = findPrimaryMember(traitScores);
  const topTraits = getTopTraits(traitScores);
  const tags = answers.flatMap((a) => a.tags);

  // Most extreme trait for warning
  const mostExtreme = TRAIT_AXES.reduce((a, b) =>
    Math.abs(traitScores[a] - 0.5) > Math.abs(traitScores[b] - 0.5) ? a : b
  );
  const warningLabel = WARNING_LABELS[mostExtreme];
  const chamberRelationship = findFirst(CHAMBER_RELATIONSHIPS, traitScores);
  const repertoireMatch = findFirst(REPERTOIRE_MATCHES, traitScores);

  return {
    primaryMember,
    traitScores,
    topTraits,
    tags,
    warningLabel,
    chamberRelationship,
    repertoireMatch,
  };
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
