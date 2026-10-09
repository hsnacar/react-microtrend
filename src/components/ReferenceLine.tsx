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
  const { min, max, avg, width, height, margin } = useMicroTrendContext();

  let targetValue = avg;
  if (customValue !== undefined) {
    targetValue = customValue;
  } else if (type === 'min') {
    targetValue = min;
  } else if (type === 'max') {
    targetValue = max;
  } else if (type === 'zero') {
    targetValue = 0;
  }

  const innerHeight = Math.max(height - margin.top - margin.bottom, 1);
  const range = max === min ? 1 : max - min;
  const y = margin.top + innerHeight - ((targetValue - min) / range) * innerHeight;

  if (y < margin.top || y > height - margin.bottom) return null;

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
          fontFamily="sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};

ReferenceLine.displayName = 'MicroTrend.ReferenceLine';
