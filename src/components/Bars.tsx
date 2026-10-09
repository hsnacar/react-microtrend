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
  const { points, height, width, margin } = useMicroTrendContext();

  if (points.length === 0) return null;

  const innerWidth = width - margin.left - margin.right;
  const count = points.length;
  const computedBarWidth = barWidth ?? Math.max(1, (innerWidth - (count - 1) * gap) / count);
  const bottom = height - margin.bottom;

  return (
    <g className={className} style={style}>
      {points.map((p, idx) => {
        const barHeight = Math.max(1, bottom - p.y);
        const x = margin.left + idx * (computedBarWidth + gap);
        const y = p.y;

        let fill = color;
        if (positiveColor && p.value >= 0) fill = positiveColor;
        if (negativeColor && p.value < 0) fill = negativeColor;

        return (
          <rect
            key={idx}
            x={x}
            y={y}
            width={computedBarWidth}
            height={barHeight}
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
