import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { LineProps } from '../types';
import { createLinePath } from '../utils/math';

export const Line: React.FC<LineProps> = ({
  color = '#2563eb',
  strokeWidth = 2,
  smooth = true,
  strokeDasharray,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  className,
  style,
}) => {
  const { points } = useMicroTrendContext();
  const d = createLinePath(points, smooth);

  if (!d) return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={className}
      style={{
        transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        ...style,
      }}
    />
  );
};

Line.displayName = 'MicroTrend.Line';
