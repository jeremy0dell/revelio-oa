export type TraitAxis =
  | "structuralDiscipline"
  | "emotionalWarmth"
  | "rhythmicDecisiveness"
  | "expressiveDanger"
  | "diplomaticInstinct"
  | "practicalPreparedness"
  | "charismaTheatricality"
  | "introspectiveDepth"
  | "stabilizingPresence"
  | "playfulUnpredictability";

export type TraitVector = Record<TraitAxis, number>;

export type MemberId = "angela" | "justin" | "benjamin" | "russell";

export const ALL_MEMBERS: MemberId[] = ["angela", "justin", "benjamin", "russell"];

/** Direct member-point scores from an MCQ answer */
export type MCQScore = Partial<Record<MemberId, number>>;

export interface BehavioralTag {
  id: string;
  label: string;
}

export interface QuizAnswer {
  questionId: string;
  /** MCQ answers carry direct member points */
  memberScores?: MCQScore;
  /** Weird-input answers carry trait deltas */
  traitDeltas?: Partial<TraitVector>;
  tags: BehavioralTag[];
  rawData?: Record<string, unknown>;
}

export interface MemberProfile {
  id: MemberId;
  name: string;
  instrument: string;
  shortArchetype: string;
  resultBody: string;
  greenFlags: string[];
  redFlags: string[];
  rehearsalRole: string;
  repertoireDate: string;
  targetVector: TraitVector;
}

export interface QuizResult {
  primaryMember: MemberId;
  /** Raw MCQ tallies (before weighting) */
  mcqTallies: Record<MemberId, number>;
  /** Normalized final scores per member (0-1) */
  finalScores: Record<MemberId, number>;
  /** Trait scores from weird inputs for flavor text */
  traitScores: TraitVector;
  topTraits: TraitAxis[];
  tags: BehavioralTag[];
  warningLabel: string;
  chamberRelationship: string;
  repertoireMatch: string;
}

export type QuizPhase =
  | "landing"
  | "intro"
  | "quiz"
  | "analysis"
  | "result"
  | "members"
  | "about";
