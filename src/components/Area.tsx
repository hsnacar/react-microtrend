import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { AreaProps } from '../types';
import { createAreaPath } from '../utils/math';

export const Area: React.FC<AreaProps> = ({
  color = '#2563eb',
  opacity = 0.15,
  smooth = true,
  gradient = true,
  gradientFrom,
  gradientTo,
  className,
  style,
}) => {
  const { points, height, margin, uniqueId } = useMicroTrendContext();
  const d = createAreaPath(points, height, margin, smooth);

  if (!d) return null;

  const gradientId = `microtrend-grad-${uniqueId}`;
  const startColor = gradientFrom || color;
  const endColor = gradientTo || color;

  return (
    <g>
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={startColor} stopOpacity={opacity} />
            <stop offset="100%" stopColor={endColor} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      <path
        d={d}
        fill={gradient ? `url(#${gradientId})` : color}
        fillOpacity={gradient ? 1 : opacity}
        stroke="none"
        className={className}
        style={{
          transition: 'fill 0.2s ease',
          ...style,
        }}
      />
    </g>
  );
};

Area.displayName = 'MicroTrend.Area';
