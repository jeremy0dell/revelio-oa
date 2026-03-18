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

export type MemberId = "angela" | "justin" | "sharon" | "pedro";

export interface BehavioralTag {
  id: string;
  label: string;
}

export interface QuizAnswer {
  questionId: string;
  traitDeltas: Partial<TraitVector>;
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
