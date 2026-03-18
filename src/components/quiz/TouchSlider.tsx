import { useRef, useCallback } from "react";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export default function TouchSlider({ value, min, max, onChange, label }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const valueToPercent = (v: number) => ((v - min) / (max - min)) * 100;

  const pointerToValue = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + ratio * (max - min));
    },
    [min, max, value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      onChange(pointerToValue(e.clientX));
    },
    [onChange, pointerToValue]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      onChange(pointerToValue(e.clientX));
    },
    [onChange, pointerToValue]
  );

  const pct = valueToPercent(value);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      className="relative w-full h-10 cursor-pointer select-none"
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Track background */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-ivory/20 rounded-full" />
      {/* Filled portion */}
      <div
        className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-gold/40 rounded-full"
        style={{ width: `${pct}%` }}
      />
      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gold border-2 border-charcoal"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}
