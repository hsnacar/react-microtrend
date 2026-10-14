import { describe, it, expect } from 'vitest';
import {
  parseMargin,
  extractNumericValues,
  computePoints,
  createLinePath,
  createAreaPath,
} from '../src/utils/math';

describe('math utilities', () => {
  describe('parseMargin', () => {
    it('returns default margins when undefined', () => {
      expect(parseMargin()).toEqual({ top: 4, right: 4, bottom: 4, left: 4 });
    });

    it('handles numeric margin for all sides', () => {
      expect(parseMargin(10)).toEqual({ top: 10, right: 10, bottom: 10, left: 10 });
    });

    it('merges partial margins with defaults', () => {
      expect(parseMargin({ top: 12, bottom: 6 })).toEqual({
        top: 12,
        right: 4,
        bottom: 6,
        left: 4,
      });
    });
  });

  describe('extractNumericValues', () => {
    it('handles empty or non-array inputs gracefully', () => {
      expect(extractNumericValues([])).toEqual([]);
      // @ts-expect-error test non-array
      expect(extractNumericValues(null)).toEqual([]);
    });

    it('extracts numbers and objects with value property', () => {
      const data = [10, { value: 25 }, { value: -5 }, 40];
      expect(extractNumericValues(data)).toEqual([10, 25, -5, 40]);
    });

    it('filters out non-finite values and NaN safely', () => {
      const data = [10, NaN, Infinity, { value: 'invalid' as any }, 30];
      expect(extractNumericValues(data)).toEqual([10, 0, 0, 0, 30]);
    });
  });

  describe('computePoints', () => {
    const defaultMargin = { top: 4, right: 4, bottom: 4, left: 4 };

    it('handles empty data', () => {
      const res = computePoints([], 100, 50, defaultMargin);
      expect(res.points).toEqual([]);
      expect(res.min).toBe(0);
      expect(res.max).toBe(0);
      expect(res.avg).toBe(0);
    });

    it('centers single point horizontally and vertically', () => {
      const res = computePoints([42], 100, 50, defaultMargin);
      expect(res.points).toHaveLength(1);
      expect(res.points[0].x).toBe(50); // margin.left + innerWidth / 2 = 4 + 92 / 2 = 50
      expect(res.points[0].y).toBe(25); // margin.top + innerHeight / 2 = 4 + 42 / 2 = 25
      expect(res.min).toBe(42);
      expect(res.max).toBe(42);
      expect(res.avg).toBe(42);
    });

    it('centers flat trendline when all values are equal', () => {
      const res = computePoints([20, 20, 20], 100, 50, defaultMargin);
      expect(res.points).toHaveLength(3);
      // All Y coordinates should be centered at height / 2 = 25
      res.points.forEach((p) => {
        expect(p.y).toBe(25);
      });
      expect(res.min).toBe(20);
      expect(res.max).toBe(20);
    });

    it('scales normal min/max correctly', () => {
      const res = computePoints([0, 50, 100], 108, 58, defaultMargin);
      // innerWidth = 108 - 8 = 100
      // innerHeight = 58 - 8 = 50
      expect(res.points[0].x).toBe(4);
      expect(res.points[0].y).toBe(54); // Min value is at bottom: 4 + 50 = 54
      expect(res.points[2].x).toBe(104);
      expect(res.points[2].y).toBe(4); // Max value is at top: 4
      expect(res.min).toBe(0);
      expect(res.max).toBe(100);
      expect(res.avg).toBe(50);
    });

    it('respects custom min and max overrides', () => {
      const res = computePoints([10, 20], 108, 58, defaultMargin, 0, 100);
      expect(res.min).toBe(0);
      expect(res.max).toBe(100);
      // 10 should be near the bottom, not at the extreme bottom
      expect(res.points[0].y).toBe(49);
      // 20 should be at 4 + 50 - (20/100)*50 = 44
      expect(res.points[1].y).toBe(44);
    });

    it('handles large arrays without call stack overflow', () => {
      const largeData = new Array(70000).fill(1).map((_, i) => i % 100);
      const res = computePoints(largeData, 200, 50, defaultMargin);
      expect(res.points).toHaveLength(70000);
      expect(res.min).toBe(0);
      expect(res.max).toBe(99);
    });
  });

  describe('createLinePath', () => {
    it('returns empty string for empty points', () => {
      expect(createLinePath([])).toBe('');
    });

    it('handles single point', () => {
      const points = [{ x: 10, y: 20, value: 5, index: 0 }];
      expect(createLinePath(points)).toBe('M 10 20');
    });

    it('creates linear straight path when smooth is false', () => {
      const points = [
        { x: 0, y: 10, value: 1, index: 0 },
        { x: 50, y: 30, value: 2, index: 1 },
        { x: 100, y: 5, value: 3, index: 2 },
      ];
      expect(createLinePath(points, false)).toBe(' M 0 10 L 50 30 L 100 5');
    });

    it('creates cubic bezier smooth path when smooth is true', () => {
      const points = [
        { x: 0, y: 10, value: 1, index: 0 },
        { x: 50, y: 30, value: 2, index: 1 },
        { x: 100, y: 5, value: 3, index: 2 },
      ];
      const path = createLinePath(points, true);
      expect(path).toContain('M 0 10');
      expect(path).toContain('C');
    });
  });

  describe('createAreaPath', () => {
    it('returns empty string for less than 2 points', () => {
      expect(createAreaPath([], 50, { top: 4, right: 4, bottom: 4, left: 4 })).toBe('');
    });

    it('closes the path down to bottom margin', () => {
      const points = [
        { x: 10, y: 20, value: 1, index: 0 },
        { x: 90, y: 10, value: 2, index: 1 },
      ];
      const margin = { top: 4, right: 4, bottom: 6, left: 4 };
      const path = createAreaPath(points, 50, margin, false);
      const expectedBottom = 50 - 6; // 44
      expect(path).toContain(`L 90 ${expectedBottom} L 10 ${expectedBottom} Z`);
    });
  });

  describe('BUG-02: customMin > customMax handling', () => {
    it('returns empty dataset when customMin > customMax', () => {
      const margin = { top: 4, right: 4, bottom: 4, left: 4 };
      const result = computePoints([1, 2, 3], 100, 50, margin, 100, 0);
      expect(result.points).toEqual([]);
      expect(result.values).toEqual([]);
      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
      expect(result.avg).toBe(0);
    });
  });
});
