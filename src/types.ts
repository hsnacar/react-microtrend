import { ReactNode, CSSProperties, SVGAttributes } from 'react';

export interface DataPointObject {
  value: number;
  [key: string]: any;
}

export type RawDataPoint = number | DataPointObject;

export interface Point {
  x: number;
  y: number;
  value: number;
  index: number;
  raw?: RawDataPoint;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface MicroTrendContextValue {
  points: Point[];
  values: number[];
  min: number;
  max: number;
  avg: number;
  width: number;
  height: number;
  margin: Margin;
  hoveredPoint: Point | null;
  setHoveredPoint: (p: Point | null) => void;
  uniqueId: string;
}

export interface MicroTrendProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'fill'> {
  data: RawDataPoint[];
  width?: number;
  height?: number;
  margin?: number | Partial<Margin>;
  min?: number;
  max?: number;
  children?: ReactNode;
  
  // Shortcut props (when used as simple single-tag component)
  type?: 'line' | 'bar';
  color?: string;
  strokeWidth?: number;
  smooth?: boolean;
  fill?: boolean | string;
  fillOpacity?: number;
  showSpot?: boolean | 'last' | 'min' | 'max' | 'all';
  spotColor?: string;
  spotSize?: number;
  interactive?: boolean;
  onHover?: (point: Point | null) => void;
}

export interface LineProps {
  color?: string;
  strokeWidth?: number;
  smooth?: boolean;
  strokeDasharray?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  className?: string;
  style?: CSSProperties;
}

export interface AreaProps {
  color?: string;
  opacity?: number;
  smooth?: boolean;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  style?: CSSProperties;
}

export interface BarsProps {
  color?: string;
  positiveColor?: string;
  negativeColor?: string;
  barWidth?: number;
  gap?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}

export type SpotType = 'first' | 'last' | 'min' | 'max' | 'all';

export interface SpotProps {
  type?: SpotType | number;
  color?: string;
  radius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ReferenceLineProps {
  type?: 'min' | 'max' | 'avg' | 'median' | 'zero';
  value?: number;
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string | number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export interface TooltipProps {
  format?: (value: number, point: Point) => string | number;
  render?: (point: Point) => ReactNode;
  crosshair?: boolean;
  crosshairColor?: string;
  crosshairWidth?: number;
  crosshairDasharray?: string | number;
  className?: string;
}
