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
  const { hoveredPoint, width, height, margin } = useMicroTrendContext();

  if (!hoveredPoint) return null;

  const formattedValue = format
    ? String(format(hoveredPoint.value, hoveredPoint))
    : hoveredPoint.value.toLocaleString();

  const bottom = height - margin.bottom;

  // Dynamic pill size calculation to prevent text clipping
  const pillWidth = Math.max(44, Math.round(formattedValue.length * 7 + 14));
  const pillHeight = 18;

  // Flip below point if too close to the top margin
  const isNearTop = hoveredPoint.y < margin.top + 24;
  const pillY = isNearTop
    ? hoveredPoint.y + 8
    : Math.max(margin.top, hoveredPoint.y - pillHeight - 6);

  // Clamp pill horizontally so it never overflows SVG bounds
  const pillX = Math.max(
    margin.left,
    Math.min(width - margin.right - pillWidth, hoveredPoint.x - pillWidth / 2)
  );

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
          x={pillX}
          y={pillY}
          width={pillWidth}
          height={pillHeight + 10}
        >
          {render(hoveredPoint)}
        </foreignObject>
      ) : (
        <g>
          {/* Responsive SVG tooltip pill */}
          <rect
            x={pillX}
            y={pillY}
            width={pillWidth}
            height={pillHeight}
            rx={4}
            ry={4}
            fill="#0f172a"
            opacity={0.92}
          />
          <text
            x={pillX + pillWidth / 2}
            y={pillY + 12}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
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
