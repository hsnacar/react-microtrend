# react-microtrend 📈

[![npm version](https://img.shields.io/npm/v/react-microtrend.svg?style=flat-square)](https://www.npmjs.com/package/react-microtrend)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-microtrend?style=flat-square)](https://bundlephobia.com/package/react-microtrend)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React 19 Ready](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg?style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)

**react-microtrend** is an ultra-lightweight, zero-dependency SVG sparkline and micro-trend chart library for React and TypeScript. 

Designed as the modern, high-performance successor to unmaintained legacy libraries like `react-sparklines`, it brings native **React 19 support**, **smooth cubic spline interpolation**, **gradient area fills**, **animated live spots**, **micro bars**, and **interactive crosshairs** in **~2KB gzipped**.

---

## ✨ Why react-microtrend?

- 🪶 **Zero Dependencies:** No D3 or heavy chart engines. Just pure, mathematical SVG.
- ⚡ **Ultra-Lightweight:** Less than **2 KB** min+gzipped. Perfect for high-density tables and crypto/finance tickers.
- 🚀 **React 19 & 18 Ready:** Strict Mode friendly, SSR & RSC compatible, no deprecated DOM APIs.
- 🎨 **Two Ways to Use:** Simple single-tag props or flexible, composable compound components.
- 🌊 **Silky Smooth Curves:** Catmull-Rom cubic bezier smoothing without overshoot.
- 🎯 **Interactive Crosshair & Tooltip:** Built-in pointer tracking for hover inspection.
- 💫 **Real-Time Live Pulses:** Highlight latest/min/max points with glowing pulse animations.

---

## 📦 Installation

```bash
npm install react-microtrend
# or
yarn add react-microtrend
# or
pnpm add react-microtrend
```

---

## 🚀 Quick Start

### 1. Minimal / Simple Usage (Single Tag)

Just pass your numeric array and you're good to go:

```tsx
import { MicroTrend } from 'react-microtrend';

export function SimpleSparkline() {
  const data = [12, 18, 14, 22, 19, 28, 25, 34];

  return (
    <MicroTrend 
      data={data} 
      width={120} 
      height={32} 
      color="#10b981" 
      fill 
      showSpot="last" 
    />
  );
}
```

### 2. Composable / Compound Component (Full Control)

Mix and match components to build custom dashboard widgets:

```tsx
import { MicroTrend } from 'react-microtrend';

export function BitcoinTickerCard() {
  const btcPrices = [62400, 62900, 63400, 63100, 64950, 66200, 67150];

  return (
    <MicroTrend data={btcPrices} width={240} height={60}>
      {/* Translucent gradient fill */}
      <MicroTrend.Area color="#10b981" opacity={0.2} />

      {/* Smooth bezier line */}
      <MicroTrend.Line color="#10b981" strokeWidth={2.5} smooth />

      {/* Glowing live dot on latest price */}
      <MicroTrend.Spot type="last" color="#10b981" radius={3.5} pulse />

      {/* Average benchmark reference line */}
      <MicroTrend.ReferenceLine type="avg" color="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

      {/* Interactive hover tooltip & crosshair */}
      <MicroTrend.Tooltip format={(val) => `$${val.toLocaleString()}`} />
    </MicroTrend>
  );
}
```

---

## 📊 Features & Components

### Micro Bars (`<MicroTrend.Bars />`)
Ideal for volume bars, weekly activity, or net flow (supports positive/negative split colors):

```tsx
<MicroTrend data={[45, -20, 65, 80, -35, 90]} width={160} height={40}>
  <MicroTrend.Bars positiveColor="#10b981" negativeColor="#f43f5e" gap={3} radius={2} />
  <MicroTrend.ReferenceLine type="zero" color="rgba(255,255,255,0.2)" />
</MicroTrend>
```

### Spots & Highlights (`<MicroTrend.Spot />`)
Highlight critical inflection points on your curve:

```tsx
<MicroTrend data={data}>
  <MicroTrend.Line color="#3b82f6" />
  {/* Highlight min in red, max in green, last with pulse */}
  <MicroTrend.Spot type="min" color="#ef4444" radius={3} />
  <MicroTrend.Spot type="max" color="#10b981" radius={3} />
  <MicroTrend.Spot type="last" color="#3b82f6" radius={4} pulse />
</MicroTrend>
```

---

## 🛠️ API Reference

### `<MicroTrend />` (Root)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `number[] \| { value: number }[]` | **Required** | Array of numbers or objects with a `value` field. |
| `width` | `number` | `120` | Width of the SVG viewBox. |
| `height` | `number` | `36` | Height of the SVG viewBox. |
| `margin` | `number \| Margin` | `{ top: 4, right: 4, bottom: 4, left: 4 }` | Inner margins to prevent line clipping. |
| `min` | `number` | `min(data)` | Custom lower bound for Y axis scale. |
| `max` | `number` | `max(data)` | Custom upper bound for Y axis scale. |
| `type` | `'line' \| 'bar'` | `'line'` | Shortcut rendering type. |
| `color` | `string` | `'#2563eb'` | Shortcut primary color. |
| `fill` | `boolean \| string` | `false` | Enable gradient fill or specify fill color. |
| `showSpot`| `boolean \| 'last' \| 'min' \| 'max' \| 'all'` | `false` | Shortcut for spot dot. |
| `interactive` | `boolean` | `false` | Enables pointer tracking for tooltip crosshair. |
| `onHover` | `(point: Point \| null) => void` | `undefined` | Callback when hovering over data points. |

### Subcomponents

#### `<MicroTrend.Line />`
- `color?: string` — Stroke color.
- `strokeWidth?: number` — Line thickness (default: `2`).
- `smooth?: boolean` — Enable Catmull-Rom cubic bezier smoothing (default: `true`).
- `strokeDasharray?: string | number` — SVG dash pattern.

#### `<MicroTrend.Area />`
- `color?: string` — Fill color.
- `opacity?: number` — Max opacity at top of gradient (default: `0.15`).
- `gradient?: boolean` — Fade to transparent at the bottom (default: `true`).

#### `<MicroTrend.Bars />`
- `color?: string` — Bar fill color.
- `positiveColor?: string` — Fill color for values >= 0.
- `negativeColor?: string` — Fill color for values < 0.
- `gap?: number` — Space between bars (default: `2`).
- `radius?: number` — Rounded corner radius for bars (default: `1.5`).

#### `<MicroTrend.Spot />`
- `type?: 'first' | 'last' | 'min' | 'max' | 'all' | number` — Target point to highlight.
- `color?: string` — Dot color.
- `radius?: number` — Circle radius (default: `3`).
- `pulse?: boolean` — Enables animated glowing ping ring (default: `false`).

#### `<MicroTrend.ReferenceLine />`
- `type?: 'min' | 'max' | 'avg' | 'median' | 'zero'` — Automatic reference value.
- `value?: number` — Custom fixed Y value.
- `label?: string` — Optional text label rendered above line.

#### `<MicroTrend.Tooltip />`
- `crosshair?: boolean` — Show vertical indicator line (default: `true`).
- `crosshairColor?: string` — Color of vertical line.
- `format?: (val: number, pt: Point) => string` — Custom value formatter.
- `render?: (pt: Point) => ReactNode` — Fully custom tooltip renderer.

---

## 💻 Local Playground

To launch the interactive demo playground locally:

```bash
npm run demo
```

Visit `http://localhost:3001` in your browser.

---

## 📄 License

MIT © [Hasan Acar](https://github.com/hsnacar)
