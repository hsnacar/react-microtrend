import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MicroTrend } from '../src';

describe('<MicroTrend />', () => {
  it('renders svg with specified width and height', () => {
    const { container } = render(<MicroTrend data={[10, 20, 30]} width={200} height={60} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '60');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 60');
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
    // Area generates linearGradient and a fill path
    expect(container.querySelector('linearGradient')).toBeInTheDocument();
    // Spot generates circle
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
    // Positive bar
    expect(rects[0]).toHaveAttribute('fill', '#10b981');
    // Negative bar
    expect(rects[1]).toHaveAttribute('fill', '#f43f5e');
  });
});
