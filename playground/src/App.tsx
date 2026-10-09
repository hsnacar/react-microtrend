import React, { useState, useEffect } from 'react';
import { MicroTrend } from 'react-microtrend';

const initialBtcData = [62400, 62900, 62100, 63400, 63800, 63100, 64200, 64950, 65400, 64800, 66200, 67150];
const ethData = [3400, 3450, 3390, 3320, 3280, 3310, 3250, 3190, 3150, 3100, 3120, 3080];
const solData = [135, 142, 138, 150, 155, 149, 162, 168, 175, 172, 180, 189];
const mrrData = [12.4, 13.1, 14.8, 14.2, 15.9, 17.5, 18.2, 19.8, 21.4, 23.0];
const serverLoad = [34, 42, 38, 85, 92, 54, 48, 62, 70, 45, 38, 41];
const weeklyActivity = [45, -20, 65, 80, -35, 90, 110];

export default function App() {
  const [liveTicks, setLiveTicks] = useState<number[]>([100, 104, 102, 108, 107, 112, 110, 115, 118, 116, 122]);
  const [hoveredPoint, setHoveredPoint] = useState<{ value: number; index: number } | null>(null);

  // Real-time tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTicks((prev) => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 4;
        const next = Math.max(80, Math.min(160, Number((last + change).toFixed(2))));
        return [...prev.slice(1), next];
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      {/* Hero */}
      <header className="hero">
        <div className="badge">⚡ Zero-Dependency • ~2KB Gzip • React 19 Ready</div>
        <h1 className="hero-title">react-microtrend</h1>
        <p className="hero-subtitle">
          Modern, ultra-lightweight SVG sparklines and micro-trend charts for React and TypeScript.
          Crafted for high-density finance, crypto, and SaaS KPI dashboards.
        </p>
        <div className="install-bar">
          <code>npm install react-microtrend</code>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <h2 className="demo-section-title">📊 Live Dashboard Metrics</h2>
      <div className="grid">
        {/* BTC/USDT Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Bitcoin / USDT</div>
              <div className="card-value">$67,150.00</div>
            </div>
            <span className="change-tag change-positive">▲ +7.6%</span>
          </div>
          <MicroTrend data={initialBtcData} width={280} height={54} margin={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <MicroTrend.Area color="#10b981" opacity={0.18} />
            <MicroTrend.Line color="#10b981" strokeWidth={2.5} smooth />
            <MicroTrend.Spot type="last" color="#10b981" radius={3.5} pulse />
            <MicroTrend.ReferenceLine type="avg" color="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
          </MicroTrend>
        </div>

        {/* ETH/USDT Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ethereum / USDT</div>
              <div className="card-value">$3,080.00</div>
            </div>
            <span className="change-tag change-negative">▼ -9.4%</span>
          </div>
          <MicroTrend data={ethData} width={280} height={54} margin={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <MicroTrend.Area color="#f43f5e" opacity={0.18} />
            <MicroTrend.Line color="#f43f5e" strokeWidth={2.5} smooth />
            <MicroTrend.Spot type="last" color="#f43f5e" radius={3.5} pulse />
          </MicroTrend>
        </div>

        {/* Live Stream Pulse Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Real-Time Pulse Stream</div>
              <div className="card-value">${liveTicks[liveTicks.length - 1]}</div>
            </div>
            <span className="badge" style={{ margin: 0, padding: '2px 8px', fontSize: '11px' }}>
              ● LIVE
            </span>
          </div>
          <MicroTrend data={liveTicks} width={280} height={54} margin={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <MicroTrend.Area color="#3b82f6" opacity={0.2} />
            <MicroTrend.Line color="#3b82f6" strokeWidth={2.5} smooth />
            <MicroTrend.Spot type="last" color="#3b82f6" radius={4} pulse />
          </MicroTrend>
        </div>

        {/* Monthly MRR */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Recurring Revenue</div>
              <div className="card-value">$23.0k</div>
            </div>
            <span className="change-tag change-positive">▲ +85.4% YoY</span>
          </div>
          <MicroTrend
            data={mrrData}
            width={280}
            height={54}
            color="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.2}
            showSpot="last"
            spotColor="#8b5cf6"
          />
        </div>

        {/* Server Latency / Spike */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Server CPU Load</div>
              <div className="card-value">41%</div>
            </div>
            <span className="change-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              Spike @ 92%
            </span>
          </div>
          <MicroTrend data={serverLoad} width={280} height={54}>
            <MicroTrend.Line color="#f59e0b" strokeWidth={2} smooth={false} />
            <MicroTrend.Spot type="max" color="#ef4444" radius={4} pulse strokeColor="#ffffff" />
            <MicroTrend.ReferenceLine type="avg" color="rgba(245, 158, 11, 0.4)" label="avg" />
          </MicroTrend>
        </div>

        {/* Net Flow Bars */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Weekly Net Flow</div>
              <div className="card-value">+110M</div>
            </div>
            <span className="change-tag change-positive">Bars</span>
          </div>
          <MicroTrend data={weeklyActivity} width={280} height={54}>
            <MicroTrend.Bars positiveColor="#10b981" negativeColor="#f43f5e" gap={4} radius={2} />
            <MicroTrend.ReferenceLine type="zero" color="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
          </MicroTrend>
        </div>
      </div>

      {/* Interactive Tooltip & Crosshair Demo */}
      <h2 className="demo-section-title">🎯 Interactive Hover & Crosshair Tooltip</h2>
      <div className="card" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="card-title">Hover over the chart to inspect points</div>
            <div className="card-value">
              {hoveredPoint ? `$${hoveredPoint.value.toLocaleString()}` : 'Hover anywhere...'}
            </div>
          </div>
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <MicroTrend
            data={initialBtcData}
            width={720}
            height={140}
            interactive
            onHover={(p) => setHoveredPoint(p ? { value: p.value, index: p.index } : null)}
            margin={{ top: 20, bottom: 20, left: 16, right: 16 }}
            style={{ width: '100%', maxHeight: 180 }}
          >
            <MicroTrend.Area color="#3b82f6" opacity={0.15} />
            <MicroTrend.Line color="#3b82f6" strokeWidth={3} smooth />
            <MicroTrend.Spot type="min" color="#ef4444" radius={4} />
            <MicroTrend.Spot type="max" color="#10b981" radius={4} />
            <MicroTrend.ReferenceLine type="avg" color="rgba(148, 163, 184, 0.4)" label="Average" />
            <MicroTrend.Tooltip format={(val) => `$${val.toLocaleString()}`} />
          </MicroTrend>
        </div>
      </div>

      {/* High Density Table Example */}
      <h2 className="demo-section-title">📋 High-Density Data Table Integration</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>7d Trend (MicroTrend)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Bitcoin (BTC)</strong></td>
              <td>$67,150.00</td>
              <td><span className="change-tag change-positive">+7.6%</span></td>
              <td>
                <MicroTrend data={initialBtcData} width={130} height={30} color="#10b981" fill showSpot="last" />
              </td>
            </tr>
            <tr>
              <td><strong>Ethereum (ETH)</strong></td>
              <td>$3,080.00</td>
              <td><span className="change-tag change-negative">-9.4%</span></td>
              <td>
                <MicroTrend data={ethData} width={130} height={30} color="#f43f5e" fill showSpot="last" />
              </td>
            </tr>
            <tr>
              <td><strong>Solana (SOL)</strong></td>
              <td>$189.20</td>
              <td><span className="change-tag change-positive">+40.1%</span></td>
              <td>
                <MicroTrend data={solData} width={130} height={30} color="#8b5cf6" fill showSpot="last" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
