import React, { StrictMode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MicroTrend, Line, Area, Spot, ReferenceLine, Tooltip, Bars } from '../src';

describe('<MicroTrend />', () => {
  it('renders svg with specified width and height', () => {
    const { container } = render(<MicroTrend data={[10, 20, 30]} width={200} height={60} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '60');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 60');
  });

  it('renders without error under React.StrictMode', () => {
    expect(() => {
      render(
        <StrictMode>
          <MicroTrend data={[10, 20, 30]} color="#10b981" fill showSpot="last" />
        </StrictMode>
      );
    }).not.toThrow();
  });

  it('handles empty data array safely without throwing', () => {
    const { container } = render(<MicroTrend data={[]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(container.querySelector('path')).not.toBeInTheDocument();
  });

  it('handles single item data safely', () => {
    const { container } = render(<MicroTrend data={[50]} showSpot="last" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('handles flat trend with identical values', () => {
    const { container } = render(<MicroTrend data={[30, 30, 30]} width={100} height={40} />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    // Y coordinates should all be 20 (middle of height 40)
    expect(path?.getAttribute('d')).toContain('20');
  });

  it('renders line with shortcut props', () => {
    const { container } = render(
      <MicroTrend data={[10, 25, 15, 30]} color="#10b981" strokeWidth={3} />
    );
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke', '#10b981');
    expect(path).toHaveAttribute('stroke-width', '3');
  });

  it('renders area fill and spot when configured', () => {
    const { container } = render(
      <MicroTrend data={[10, 20, 15]} color="#3b82f6" fill showSpot="last" />
    );
    expect(container.querySelector('linearGradient')).toBeInTheDocument();
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('renders bar chart when type="bar"', () => {
    const { container } = render(
      <MicroTrend data={[10, -5, 20]} type="bar" color="#3b82f6" />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(3);
  });

  it('renders compound components correctly', () => {
    const { container } = render(
      <MicroTrend data={[10, 30, 20, 50]} width={240} height={70}>
        <MicroTrend.Area color="#8b5cf6" opacity={0.2} />
        <MicroTrend.Line color="#8b5cf6" strokeWidth={2} />
        <MicroTrend.Spot type="max" color="#ef4444" radius={4} pulse />
        <MicroTrend.ReferenceLine type="avg" color="#94a3b8" label="avg" />
      </MicroTrend>
    );

    expect(container.querySelector('linearGradient')).toBeInTheDocument();
    expect(container.querySelector('path')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('line')).toBeInTheDocument();
    expect(container.querySelector('text')).toHaveTextContent('avg');
  });

  it('renders reference line for median correctly', () => {
    const { container } = render(
      <MicroTrend data={[10, 20, 30, 100]} width={200} height={60}>
        <MicroTrend.ReferenceLine type="median" label="median" />
      </MicroTrend>
    );
    expect(container.querySelector('text')).toHaveTextContent('median');
  });

  it('automatically enables interaction and renders tooltip on hover', () => {
    const onHover = vi.fn();
    const { container } = render(
      <MicroTrend data={[100, 200, 300]} width={300} height={100} onHover={onHover}>
        <MicroTrend.Line />
        <MicroTrend.Tooltip format={(val) => `$${val}`} />
      </MicroTrend>
    );

    const svg = container.querySelector('svg')!;
    
    // Check touchAction is set to 'none' for smooth mobile interaction
    expect(svg.style.touchAction).toBe('none');

    // Simulate pointer move over SVG
    fireEvent.pointerMove(svg, {
      clientX: 150,
      currentTarget: {
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 100 }),
      },
    });

    // Tooltip should be visible with format applied
    expect(container.querySelector('text')).toHaveTextContent('$200');
    expect(onHover).toHaveBeenCalledWith(expect.objectContaining({ value: 200 }));

    // Pointer leave should clear hover
    fireEvent.pointerLeave(svg);
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it('responds to pointerDown for mobile touch interaction', () => {
    const onHover = vi.fn();
    const { container } = render(
      <MicroTrend data={[10, 20, 30]} width={300} height={100} interactive onHover={onHover}>
        <MicroTrend.Line />
        <MicroTrend.Tooltip />
      </MicroTrend>
    );

    const svg = container.querySelector('svg')!;
    fireEvent.pointerDown(svg, {
      clientX: 290,
      currentTarget: {
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 100 }),
      },
    });

    expect(onHover).toHaveBeenCalledWith(expect.objectContaining({ value: 30 }));
  });

  it('handles negative bars with zero-crossing baseline', () => {
    const { container } = render(
      <MicroTrend
        data={[50, -25, 75]}
        width={150}
        height={60}
      >
        <MicroTrend.Bars positiveColor="#10b981" negativeColor="#f43f5e" />
        <MicroTrend.ReferenceLine type="zero" />
      </MicroTrend>
    );

    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(3);
    expect(rects[0]).toHaveAttribute('fill', '#10b981');
    expect(rects[1]).toHaveAttribute('fill', '#f43f5e');
  });

  it('throws descriptive error when subcomponents are rendered outside parent', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onWindowError = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', onWindowError);

    try {
      expect(() => render(<Line />)).toThrow(
        'MicroTrend subcomponents must be used within a <MicroTrend> parent component.'
      );
      expect(() => render(<Area />)).toThrow();
      expect(() => render(<Bars />)).toThrow();
      expect(() => render(<Spot />)).toThrow();
      expect(() => render(<ReferenceLine />)).toThrow();
      expect(() => render(<Tooltip />)).toThrow();
    } finally {
      window.removeEventListener('error', onWindowError);
      consoleError.mockRestore();
    }
  });

  describe('Regression Bug Fixes (BUG-01 to BUG-06)', () => {
    it('BUG-01: renders Spot type all with large dataset without RangeError stack overflow', () => {
      const largeData = Array.from({ length: 20000 }, () => 1);
      expect(() => {
        render(
          <MicroTrend data={largeData} width={500} height={100}>
            <MicroTrend.Spot type="all" />
          </MicroTrend>
        );
      }).not.toThrow();
    });

    it('BUG-03: warns when Spot numeric index is out of bounds', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const { container } = render(
          <MicroTrend data={[10, 20, 30]}>
            <MicroTrend.Spot type={99} />
          </MicroTrend>
        );
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Spot: type=99 is out of bounds. Valid range: 0-2')
        );
        expect(container.querySelectorAll('circle')).toHaveLength(0);
      } finally {
        warnSpy.mockRestore();
      }
    });

    it('BUG-04: does not render ReferenceLine with type median when values array is empty', () => {
      const { container } = render(
        <MicroTrend data={[]}>
          <MicroTrend.ReferenceLine type="median" />
        </MicroTrend>
      );
      expect(container.querySelector('line')).toBeNull();
    });

    it('BUG-05: falls back to toLocaleString when Tooltip format returns null or undefined', () => {
      const { container } = render(
        <MicroTrend data={[100, 200]} width={200} height={60} interactive>
          <MicroTrend.Tooltip format={() => null} />
        </MicroTrend>
      );
      const svg = container.querySelector('svg')!;
      fireEvent.pointerMove(svg, {
        clientX: 10,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 60 }),
        },
      });
      const text = container.querySelector('text');
      expect(text).not.toBeNull();
      expect(text?.textContent).not.toBe('null');
      expect(text?.textContent).toBe((100).toLocaleString());
    });

    it('BUG-06: places zero baseline at top when all data is negative in Bars', () => {
      const { container } = render(
        <MicroTrend data={[-5, -3, -1]} width={100} height={50} margin={0}>
          <MicroTrend.Bars />
        </MicroTrend>
      );
      const rects = container.querySelectorAll('rect');
      expect(rects).toHaveLength(3);
      // All rects should align at zero baseline y = margin.top = 0
      expect(rects[0]).toHaveAttribute('y', '0');
      expect(rects[1]).toHaveAttribute('y', '0');
      expect(rects[2]).toHaveAttribute('y', '0');
      // Most negative (-5) should have the largest height (full height 50)
      expect(Number(rects[0].getAttribute('height'))).toBe(50);
      // Least negative (-1) should have height 1
      expect(Number(rects[2].getAttribute('height'))).toBe(1);
    });
  });
});
