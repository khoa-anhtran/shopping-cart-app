import React from "react";

export type LoadingSpinnerProps = {
  /** Accessible label for screen readers */
  label?: string;
  /** Size in px or preset: 'sm' | 'md' | 'lg' */
  size?: number | "sm" | "md" | "lg";
  /** If true, cover the screen with a dimmed overlay */
  overlay?: boolean;
  /** Optional progress (0–100). When provided, a determinate ring is shown. */
  progress?: number;
  /** Add className for custom layout */
  className?: string;
};

const SIZE_PRESET: Record<NonNullable<Extract<LoadingSpinnerProps["size"], string>>, number> = {
  sm: 20,
  md: 28,
  lg: 40,
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading",
  size = "md",
  overlay = false,
  progress,
  className,
}) => {
  const px = typeof size === "number" ? size : SIZE_PRESET[size] ?? 28;
  const radius = Math.max(0, (px - 4) / 2);
  const circumference = 2 * Math.PI * radius;
  const p = progress == null ? undefined : clamp(progress, 0, 100);
  const dash = p == null ? undefined : (circumference * (100 - p)) / 100;

  const spinner = (
    <div className={`lds ${className ?? ""}`} role="status" aria-live="polite" aria-label={label}>
      <svg
        className="lds__svg"
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        aria-hidden="true"
      >
        {/* Track */}
        <circle className="lds__track" cx={px / 2} cy={px / 2} r={radius} />
        {/* Indicator */}
        <circle
          className={`lds__indicator${p != null ? " lds__indicator--determinate" : ""}`}
          cx={px / 2}
          cy={px / 2}
          r={radius}
          strokeDasharray={p != null ? circumference : undefined}
          strokeDashoffset={p != null ? dash : undefined}
        />
      </svg>
      <span className="lds__label">{p != null ? `${label}… ${p}%` : `${label}…`}</span>
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div className="lds-overlay" aria-busy="true" aria-live="polite">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;

/* --------------------------------------------------------------
   Usage examples
---------------------------------------------------------------*/
// 1) Inline
// <LoadingSpinner label="Loading data" />
// 2) Larger size
// <LoadingSpinner size="lg" label="Fetching products" />
// 3) Determinate ring with progress
// <LoadingSpinner progress={42} label="Uploading" />
// 4) Fullscreen overlay during route transitions
// <LoadingSpinner overlay label="Loading page" />
