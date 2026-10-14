import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { BarsProps } from '../types';

export const Bars: React.FC<BarsProps> = ({
  color = '#2563eb',
  positiveColor,
  negativeColor,
  barWidth,
  gap = 2,
  radius = 1.5,
  className,
  style,
}) => {
  const { points, height, width, margin, min, max } = useMicroTrendContext();

  if (points.length === 0) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 1);
  const count = points.length;
  const computedBarWidth = barWidth ?? Math.max(1, (innerWidth - (count - 1) * gap) / count);
  const bottom = height - margin.bottom;

  // Calculate zero baseline if data crosses zero or is entirely negative
  const range = max === min ? 1 : max - min;
  const isAllNegative = max <= 0;
  const hasZeroCross = (min < 0 && max >= 0) || isAllNegative;
  const zeroY = isAllNegative
    ? margin.top
    : hasZeroCross
      ? margin.top + innerHeight - ((0 - min) / range) * innerHeight
      : bottom;

  return (
    <g className={className} style={style}>
      {points.map((p, idx) => {
        const x = margin.left + idx * (computedBarWidth + gap);
        let y = p.y;
        let barHeight = 1;

        if (hasZeroCross) {
          if (p.value >= 0) {
            y = p.y;
            barHeight = Math.max(1, zeroY - p.y);
          } else {
            y = zeroY;
            barHeight = Math.max(1, p.y - zeroY);
          }
        } else {
          y = p.y;
          barHeight = Math.max(1, bottom - p.y);
        }

        let fill = color;
        if (positiveColor && p.value >= 0) fill = positiveColor;
        if (negativeColor && p.value < 0) fill = negativeColor;

        return (
          <rect
            key={idx}
            x={Number(x.toFixed(2))}
            y={Number(y.toFixed(2))}
            width={Number(computedBarWidth.toFixed(2))}
            height={Number(barHeight.toFixed(2))}
            rx={radius}
            ry={radius}
            fill={fill}
            style={{
              transition: 'height 0.2s ease, y 0.2s ease',
            }}
          />
        );
      })}
    </g>
  );
};

Bars.displayName = 'MicroTrend.Bars';
