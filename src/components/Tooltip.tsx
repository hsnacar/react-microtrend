import React from 'react';
import { useMicroTrendContext } from '../MicroTrendContext';
import { TooltipProps } from '../types';

export const Tooltip: React.FC<TooltipProps> = ({
  format,
  render,
  crosshair = true,
  crosshairColor = '#64748b',
  crosshairWidth = 1,
  crosshairDasharray = '2 2',
  className,
}) => {
  const { hoveredPoint, height, margin } = useMicroTrendContext();

  if (!hoveredPoint) return null;

  const formattedValue = format
    ? format(hoveredPoint.value, hoveredPoint)
    : hoveredPoint.value.toLocaleString();

  const bottom = height - margin.bottom;

  return (
    <g className={className} pointerEvents="none">
      {crosshair && (
        <line
          x1={hoveredPoint.x}
          y1={margin.top}
          x2={hoveredPoint.x}
          y2={bottom}
          stroke={crosshairColor}
          strokeWidth={crosshairWidth}
          strokeDasharray={crosshairDasharray}
        />
      )}

      {/* Point highlight circle */}
      <circle
        cx={hoveredPoint.x}
        cy={hoveredPoint.y}
        r={4}
        fill="#ffffff"
        stroke={crosshairColor}
        strokeWidth={2}
      />

      {render ? (
        <foreignObject
          x={Math.max(0, hoveredPoint.x - 40)}
          y={Math.max(0, hoveredPoint.y - 35)}
          width={80}
          height={30}
        >
          {render(hoveredPoint)}
        </foreignObject>
      ) : (
        <g>
          {/* Default SVG tooltip pill */}
          <rect
            x={Math.max(2, hoveredPoint.x - 24)}
            y={Math.max(2, hoveredPoint.y - 20)}
            width={48}
            height={16}
            rx={4}
            ry={4}
            fill="#0f172a"
            opacity={0.9}
          />
          <text
            x={Math.max(2, hoveredPoint.x)}
            y={Math.max(2, hoveredPoint.y - 8)}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="9"
            fontWeight="600"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {formattedValue}
          </text>
        </g>
      )}
    </g>
  );
};

Tooltip.displayName = 'MicroTrend.Tooltip';
