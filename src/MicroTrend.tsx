import React, { useState, useMemo, useCallback } from 'react';
import { MicroTrendProps, Point, SpotType } from './types';
import { parseMargin, computePoints } from './utils/math';
import { useSafeId } from './utils/useSafeId';
import { MicroTrendContext } from './MicroTrendContext';
import { Line } from './components/Line';
import { Area } from './components/Area';
import { Bars } from './components/Bars';
import { Spot } from './components/Spot';
import { ReferenceLine } from './components/ReferenceLine';
import { Tooltip } from './components/Tooltip';

export const MicroTrendComponent: React.FC<MicroTrendProps> = ({
  data = [],
  width = 120,
  height = 36,
  margin: rawMargin,
  min: customMin,
  max: customMax,
  children,
  
  // Shortcut props
  type = 'line',
  color = '#2563eb',
  strokeWidth = 2,
  smooth = true,
  fill = false,
  fillOpacity = 0.15,
  showSpot = false,
  spotColor,
  spotSize = 3,
  interactive = false,
  onHover,
  preserveAspectRatio = 'none',
  className,
  style,
  ...svgProps
}) => {
  const [hoveredPoint, setHoveredPointState] = useState<Point | null>(null);
  const reactId = useSafeId('mt');

  const margin = useMemo(() => parseMargin(rawMargin), [rawMargin]);

  const { points, values, min, max, avg } = useMemo(() => {
    return computePoints(data, width, height, margin, customMin, customMax);
  }, [data, width, height, margin, customMin, customMax]);

  const setHoveredPoint = useCallback(
    (point: Point | null) => {
      setHoveredPointState(point);
      if (onHover) onHover(point);
    },
    [onHover]
  );

  // Pointer / Touch tracking for interactive crosshairs
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (points.length === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      
      // Calculate SVG scale in case width is styled via CSS
      const scaleX = width / (rect.width || width);
      const svgX = clientX * scaleX;

      // Find closest point along X axis
      let closestPoint = points[0];
      let minDistance = Math.abs(closestPoint.x - svgX);

      for (let i = 1; i < points.length; i++) {
        const dist = Math.abs(points[i].x - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = points[i];
        }
      }

      setHoveredPoint(closestPoint);
    },
    [points, width, setHoveredPoint]
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredPoint(null);
  }, [setHoveredPoint]);

  const contextValue = useMemo(
    () => ({
      points,
      values,
      min,
      max,
      avg,
      width,
      height,
      margin,
      hoveredPoint,
      setHoveredPoint,
      uniqueId: reactId,
    }),
    [points, values, min, max, avg, width, height, margin, hoveredPoint, setHoveredPoint, reactId]
  );

  // Automatically enable interaction if Tooltip is present in children or onHover is passed
  const hasTooltipChild = useMemo(() => {
    if (!children) return false;
    return React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === Tooltip || (child.type as any)?.displayName === 'MicroTrend.Tooltip')
    );
  }, [children]);

  const isInteractive = interactive || Boolean(onHover) || hasTooltipChild;

  return (
    <MicroTrendContext.Provider value={contextValue}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio={preserveAspectRatio}
        className={className}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          overflow: 'visible',
          ...style,
        }}
        onPointerMove={isInteractive ? handlePointerMove : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        {...svgProps}
      >
        {children ? (
          children
        ) : (
          <>
            {type === 'bar' ? (
              <Bars color={color} />
            ) : (
              <>
                {Boolean(fill) && (
                  <Area
                    color={typeof fill === 'string' ? fill : color}
                    opacity={fillOpacity}
                    smooth={smooth}
                  />
                )}
                <Line color={color} strokeWidth={strokeWidth} smooth={smooth} />
                {Boolean(showSpot) && (
                  <Spot
                    type={showSpot === true ? 'last' : (showSpot as SpotType)}
                    color={spotColor || color}
                    radius={spotSize}
                  />
                )}
              </>
            )}
            {interactive && <Tooltip />}
          </>
        )}
      </svg>
    </MicroTrendContext.Provider>
  );
};

export const MicroTrend = Object.assign(MicroTrendComponent, {
  Line,
  Area,
  Bars,
  Spot,
  ReferenceLine,
  Tooltip,
});
