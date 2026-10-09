import { Margin, Point, RawDataPoint } from '../types';

export function parseMargin(margin?: number | Partial<Margin>): Margin {
  if (typeof margin === 'number') {
    return { top: margin, right: margin, bottom: margin, left: margin };
  }
  return {
    top: margin?.top ?? 4,
    right: margin?.right ?? 4,
    bottom: margin?.bottom ?? 4,
    left: margin?.left ?? 4,
  };
}

export function extractNumericValues(data: RawDataPoint[]): number[] {
  if (!Array.isArray(data)) return [];
  return data.map((d) => {
    if (typeof d === 'number') {
      return Number.isFinite(d) ? d : 0;
    }
    if (d && typeof d === 'object') {
      const val = Number(d.value);
      return Number.isFinite(val) ? val : 0;
    }
    return 0;
  });
}

export function computePoints(
  data: RawDataPoint[],
  width: number,
  height: number,
  margin: Margin,
  customMin?: number,
  customMax?: number
): { points: Point[]; values: number[]; min: number; max: number; avg: number } {
  const values = extractNumericValues(data);
  if (values.length === 0) {
    return { points: [], values: [], min: 0, max: 0, avg: 0 };
  }

  // Single-pass O(N) calculation to prevent RangeError with large datasets
  let dataMin = values[0];
  let dataMax = values[0];
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < dataMin) dataMin = v;
    if (v > dataMax) dataMax = v;
    sum += v;
  }

  const avg = sum / values.length;
  const min = customMin !== undefined ? customMin : dataMin;
  const max = customMax !== undefined ? customMax : dataMax;

  const innerWidth = Math.max(width - margin.left - margin.right, 1);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 1);
  const isFlat = max === min;
  const range = isFlat ? 1 : max - min;
  const count = values.length;

  const points: Point[] = values.map((val, i) => {
    const x = count <= 1 ? margin.left + innerWidth / 2 : margin.left + (i / (count - 1)) * innerWidth;
    // If all values are equal (flat trend), center vertically instead of dropping to the bottom
    const y = isFlat
      ? margin.top + innerHeight / 2
      : margin.top + innerHeight - ((val - min) / range) * innerHeight;

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      value: val,
      index: i,
      raw: data[i],
    };
  });

  return { points, values, min, max, avg };
}

/**
 * Creates an SVG path string from points.
 * Uses Catmull-Rom to Cubic Bezier spline interpolation with tangent scaling.
 * Bounds clamp ensures control points never clip outside vertical margins.
 */
export function createLinePath(
  points: Point[],
  smooth = true,
  bounds?: { minY: number; maxY: number }
): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  if (!smooth || points.length === 2) {
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  }

  // Smooth Catmull-Rom to Cubic Bezier spline interpolation
  let path = `M ${points[0].x} ${points[0].y}`;
  const tension = 0.2; // Smooth curve tension factor

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * (1 - tension * 0.5);
    let cp1y = p1.y + ((p2.y - p0.y) / 6) * (1 - tension * 0.5);

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * (1 - tension * 0.5);
    let cp2y = p2.y - ((p3.y - p1.y) / 6) * (1 - tension * 0.5);

    if (bounds) {
      cp1y = Math.max(bounds.minY, Math.min(bounds.maxY, cp1y));
      cp2y = Math.max(bounds.minY, Math.min(bounds.maxY, cp2y));
    }

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/**
 * Creates a closed SVG path for an area under the curve.
 */
export function createAreaPath(points: Point[], height: number, margin: Margin, smooth = true): string {
  if (points.length < 2) return '';

  const bounds = { minY: margin.top, maxY: height - margin.bottom };
  const linePath = createLinePath(points, smooth, bounds);
  const bottom = height - margin.bottom;
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  return `${linePath} L ${lastPoint.x} ${bottom} L ${firstPoint.x} ${bottom} Z`;
}
