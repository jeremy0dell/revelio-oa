import { MCQScore } from "./types";

export interface MCQOption {
  label: string;
  score: MCQScore;
}

export interface MCQQuestion {
  id: string;
  prompt: string;
  options: MCQOption[];
}

export const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: "mcq-1-role",
    prompt: "In a rehearsal, what role do you slip into without trying?",
    options: [
      {
        label: "I naturally take charge, define the direction, and get everyone aligned.",
        score: { angela: 3, justin: 1 },
      },
      {
        label: "I become the spokesperson and explain what the piece is trying to say.",
        score: { justin: 3, angela: 1 },
      },
      {
        label: "I notice the structural middle, hidden balances, and what is being overlooked.",
        score: { benjamin: 3, russell: 1 },
      },
      {
        label: "I stabilize the room and make sure everything actually holds together.",
        score: { russell: 3, benjamin: 1 },
      },
    ],
  },
  {
    id: "mcq-2-flaw",
    prompt: "Which musical flaw bothers you first?",
    options: [
      {
        label: "Lack of clarity or conviction",
        score: { angela: 3, justin: 1 },
      },
      {
        label: "A beautiful line that does not actually mean anything",
        score: { justin: 3, benjamin: 1 },
      },
      {
        label: "A harmony that is technically correct but spiritually underfed",
        score: { benjamin: 3, russell: 1 },
      },
      {
        label: "A sound that is unsupported, unstable, or physically ungrounded",
        score: { russell: 3, angela: 1 },
      },
    ],
  },
  {
    id: "mcq-3-vice",
    prompt: "What is your most defensible musical vice?",
    options: [
      {
        label: "I can be a little intense because standards matter.",
        score: { angela: 3, russell: 1 },
      },
      {
        label: "I can over-explain because context improves everything.",
        score: { justin: 3, benjamin: 1 },
      },
      {
        label: "I can get obsessed with color, voicing, and the inner machinery.",
        score: { benjamin: 3, angela: 1 },
      },
      {
        label: "I can disappear into sound, resonance, and physical feel.",
        score: { russell: 3, benjamin: 1 },
      },
    ],
  },
  {
    id: "mcq-4-charisma",
    prompt: "You have to win people over in thirty seconds. What do you rely on?",
    options: [
      {
        label: "Presence",
        score: { angela: 3, justin: 1 },
      },
      {
        label: "Eloquence",
        score: { justin: 3, angela: 1 },
      },
      {
        label: "Taste",
        score: { benjamin: 3, russell: 1 },
      },
      {
        label: "Warmth",
        score: { russell: 3, justin: 1 },
      },
    ],
  },
  {
    id: "mcq-5-sentence",
    prompt: "Which sentence do you find most persuasive?",
    options: [
      {
        label: "\u201CCommit and make the gesture undeniable.\u201D",
        score: { angela: 3, russell: 1 },
      },
      {
        label: "\u201CTell me the shape of the whole thing first.\u201D",
        score: { justin: 3, benjamin: 1 },
      },
      {
        label: "\u201CListen to the middle; that is where the truth is.\u201D",
        score: { benjamin: 3, russell: 1 },
      },
      {
        label: "\u201CGive it depth, weight, and something to stand on.\u201D",
        score: { russell: 3, angela: 1 },
      },
    ],
  },
  {
    id: "mcq-6-delight",
    prompt: "Outside the music itself, what detail weirdly delights you most?",
    options: [
      {
        label: "Discipline, polish, and visible readiness",
        score: { angela: 3, justin: 1 },
      },
      {
        label: "A beautifully delivered introduction or clever framing",
        score: { justin: 3, angela: 1 },
      },
      {
        label: "The subtle detail other people were not paying attention to",
        score: { benjamin: 3, russell: 1 },
      },
      {
        label: "Setup, materials, and how tiny changes affect the sound",
        score: { russell: 3, benjamin: 1 },
      },
    ],
  },
];
