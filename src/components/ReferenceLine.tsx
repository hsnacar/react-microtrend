import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { ReferenceLineProps } from '../types';

export const ReferenceLine: React.FC<ReferenceLineProps> = ({
  type = 'avg',
  value: customValue,
  color = '#94a3b8',
  strokeWidth = 1,
  strokeDasharray = '3 3',
  label,
  className,
  style,
}) => {
  const { min, max, avg, values, width, height, margin } = useMicroTrendContext();

  let targetValue = avg;
  if (customValue !== undefined) {
    targetValue = customValue;
  } else if (type === 'min') {
    targetValue = min;
  } else if (type === 'max') {
    targetValue = max;
  } else if (type === 'zero') {
    targetValue = 0;
  } else if (type === 'median') {
    if (values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      targetValue = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
  }

  const innerHeight = Math.max(height - margin.top - margin.bottom, 1);
  const range = max === min ? 1 : max - min;
  const rawY = max === min
    ? margin.top + innerHeight / 2
    : margin.top + innerHeight - ((targetValue - min) / range) * innerHeight;

  // Floating point boundary tolerance (e.g. 0.001 delta)
  const minY = margin.top;
  const maxY = height - margin.bottom;

  if (rawY < minY - 1 || rawY > maxY + 1) return null;

  // Clamp within margin bounds
  const y = Math.max(minY, Math.min(maxY, Number(rawY.toFixed(2))));

  const x1 = margin.left;
  const x2 = width - margin.right;

  return (
    <g className={className} style={style}>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
      {label && (
        <text
          x={x2}
          y={y - 3}
          textAnchor="end"
          fill={color}
          fontSize="9"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};

ReferenceLine.displayName = 'MicroTrend.ReferenceLine';
