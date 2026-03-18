"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/types";

interface Props {
  onAnswer: (answer: QuizAnswer) => void;
}

interface Point {
  x: number;
  y: number;
}

const PRESET_CURVES: { label: string; points: Point[] }[] = [
  {
    label: "Early peak",
    points: [
      { x: 0, y: 0.5 },
      { x: 0.2, y: 0.9 },
      { x: 0.5, y: 0.6 },
      { x: 0.8, y: 0.3 },
      { x: 1, y: 0.2 },
    ],
  },
  {
    label: "Late bloom",
    points: [
      { x: 0, y: 0.3 },
      { x: 0.3, y: 0.35 },
      { x: 0.6, y: 0.5 },
      { x: 0.8, y: 0.85 },
      { x: 1, y: 0.4 },
    ],
  },
  {
    label: "Steady arc",
    points: [
      { x: 0, y: 0.3 },
      { x: 0.25, y: 0.6 },
      { x: 0.5, y: 0.75 },
      { x: 0.75, y: 0.6 },
      { x: 1, y: 0.3 },
    ],
  },
  {
    label: "Restrained",
    points: [
      { x: 0, y: 0.4 },
      { x: 0.25, y: 0.45 },
      { x: 0.5, y: 0.5 },
      { x: 0.75, y: 0.45 },
      { x: 1, y: 0.4 },
    ],
  },
  {
    label: "Wild",
    points: [
      { x: 0, y: 0.3 },
      { x: 0.15, y: 0.8 },
      { x: 0.35, y: 0.2 },
      { x: 0.6, y: 0.9 },
      { x: 0.8, y: 0.35 },
      { x: 1, y: 0.7 },
    ],
  },
];

function analyzePoints(points: Point[]) {
  if (points.length < 2) {
    return { peakTiming: 0.5, changes: 0, smoothness: 1, endingHeight: 0.5, amplitude: 0.5 };
  }

  // Peak timing (0=early, 1=late)
  let maxY = 0, peakX = 0.5;
  for (const p of points) {
    if (p.y > maxY) { maxY = p.y; peakX = p.x; }
  }

  // Directional changes
  let changes = 0;
  for (let i = 2; i < points.length; i++) {
    const prev = points[i - 1].y - points[i - 2].y;
    const curr = points[i].y - points[i - 1].y;
    if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0)) changes++;
  }

  // Smoothness (inverse of average absolute delta)
  let totalDelta = 0;
  for (let i = 1; i < points.length; i++) {
    totalDelta += Math.abs(points[i].y - points[i - 1].y);
  }
  const smoothness = Math.max(0, 1 - totalDelta / points.length);

  const endingHeight = points[points.length - 1].y;
  const amplitude = maxY - Math.min(...points.map((p) => p.y));

  return { peakTiming: peakX, changes, smoothness, endingHeight, amplitude };
}

export default function Q1PhraseArc({ onAnswer }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPos = (e: React.TouchEvent | React.MouseEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const drawCurve = useCallback(
    (points: Point[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(250, 248, 240, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (points.length < 2) return;

      // Draw curve
      ctx.strokeStyle = "#C4A265";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x * w, points[0].y * h);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * w, points[i].y * h);
      }
      ctx.stroke();

      // Glow
      ctx.strokeStyle = "rgba(196, 162, 101, 0.3)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(points[0].x * w, points[0].y * h);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * w, points[i].y * h);
      }
      ctx.stroke();
    },
    []
  );

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setDrawnPoints([pos]);
    drawCurve([pos]);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setDrawnPoints((prev) => {
      const next = [...prev, pos];
      drawCurve(next);
      return next;
    });
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawnPoints.length > 3) setHasDrawn(true);
  };

  const selectPreset = (preset: (typeof PRESET_CURVES)[0]) => {
    setDrawnPoints(preset.points);
    drawCurve(preset.points);
    setHasDrawn(true);
  };

  const submit = () => {
    const analysis = analyzePoints(drawnPoints);
    const traitDeltas: QuizAnswer["traitDeltas"] = {};

    // Early peak = impulsive/vivid
    if (analysis.peakTiming < 0.35) {
      traitDeltas.expressiveDanger = 0.3;
      traitDeltas.charismaTheatricality = 0.25;
      traitDeltas.playfulUnpredictability = 0.2;
    }
    // Late peak = patient/structural
    else if (analysis.peakTiming > 0.65) {
      traitDeltas.structuralDiscipline = 0.3;
      traitDeltas.introspectiveDepth = 0.25;
      traitDeltas.stabilizingPresence = 0.2;
    }
    // Mid peak = balanced
    else {
      traitDeltas.emotionalWarmth = 0.2;
      traitDeltas.diplomaticInstinct = 0.2;
    }

    // Smooth = composed
    if (analysis.smoothness > 0.6) {
      traitDeltas.stabilizingPresence = (traitDeltas.stabilizingPresence || 0) + 0.15;
      traitDeltas.emotionalWarmth = (traitDeltas.emotionalWarmth || 0) + 0.1;
    }
    // Jagged = mercurial
    if (analysis.changes > 3) {
      traitDeltas.playfulUnpredictability = (traitDeltas.playfulUnpredictability || 0) + 0.2;
      traitDeltas.expressiveDanger = (traitDeltas.expressiveDanger || 0) + 0.15;
    }

    // Low restrained line
    if (analysis.amplitude < 0.3) {
      traitDeltas.introspectiveDepth = (traitDeltas.introspectiveDepth || 0) + 0.2;
    }

    // Bold amplitude
    if (analysis.amplitude > 0.6) {
      traitDeltas.charismaTheatricality = (traitDeltas.charismaTheatricality || 0) + 0.2;
    }

    const tags: QuizAnswer["tags"] = [];
    if (analysis.peakTiming < 0.3) tags.push({ id: "peaked-early", label: "peaked early" });
    if (analysis.peakTiming > 0.7) tags.push({ id: "peaked-late", label: "peaked late" });
    if (analysis.smoothness > 0.7) tags.push({ id: "smooth-arc", label: "smooth operator" });
    if (analysis.changes > 4) tags.push({ id: "jagged-arc", label: "jagged contour" });

    onAnswer({ questionId: "phrase-arc", traitDeltas, tags, rawData: analysis });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="font-serif text-2xl mb-2 text-center">Shape your ideal phrase.</h3>
      <p className="text-ivory/40 text-xs mb-6 text-center">
        Draw a contour across the field, or choose a preset below.
      </p>

      <div className="w-full max-w-sm aspect-[2/1] relative mb-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="phrase-canvas w-full h-full border border-ivory/10 rounded-sm bg-warm-gray/30"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          aria-label="Draw your phrase arc by dragging across this area"
          role="img"
        />
        {!hasDrawn && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-ivory/20 text-xs">Draw here</span>
          </div>
        )}
      </div>

      {/* Preset fallbacks for accessibility */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {PRESET_CURVES.map((preset) => (
          <button
            key={preset.label}
            onClick={() => selectPreset(preset)}
            className="text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 border border-ivory/15 text-ivory/40 hover:text-ivory/70 hover:border-ivory/30 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!hasDrawn}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
