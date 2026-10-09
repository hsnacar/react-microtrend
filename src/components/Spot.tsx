import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { Point, SpotProps } from '../types';

export const Spot: React.FC<SpotProps> = ({
  type = 'last',
  color = '#2563eb',
  radius = 3,
  strokeColor = '#ffffff',
  strokeWidth = 1.5,
  pulse = false,
  className,
  style,
}) => {
  const { points, min, max } = useMicroTrendContext();

  if (points.length === 0) return null;

  const targetPoints: Point[] = [];

  if (typeof type === 'number') {
    if (points[type]) targetPoints.push(points[type]);
  } else {
    switch (type) {
      case 'first':
        targetPoints.push(points[0]);
        break;
      case 'last':
        targetPoints.push(points[points.length - 1]);
        break;
      case 'min': {
        const minPoint = points.find((p) => p.value === min);
        if (minPoint) targetPoints.push(minPoint);
        break;
      }
      case 'max': {
        const maxPoint = points.find((p) => p.value === max);
        if (maxPoint) targetPoints.push(maxPoint);
        break;
      }
      case 'all':
        targetPoints.push(...points);
        break;
    }
  }

  return (
    <g className={className} style={style}>
      {targetPoints.map((p, idx) => (
        <g key={idx}>
          {pulse && (
            <circle
              cx={p.x}
              cy={p.y}
              r={radius * 2}
              fill={color}
              opacity={0.35}
            >
              <animate
                attributeName="r"
                values={`${radius};${radius * 2.8};${radius}`}
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
          <circle
            cx={p.x}
            cy={p.y}
            r={radius}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      ))}
    </g>
  );
};

Spot.displayName = 'MicroTrend.Spot';
