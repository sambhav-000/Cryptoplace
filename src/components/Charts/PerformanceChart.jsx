import React, { useState } from 'react';
import './Charts.css';

const PERFORMANCE_DATA = {
  '1D': [
    { label: '00:00', value: 12100 },
    { label: '04:00', value: 12180 },
    { label: '08:00', value: 12050 },
    { label: '12:00', value: 12290 },
    { label: '16:00', value: 12380 },
    { label: '20:00', value: 12458.32 },
  ],
  '7D': [
    { label: 'Mon', value: 11400 },
    { label: 'Tue', value: 11650 },
    { label: 'Wed', value: 11520 },
    { label: 'Thu', value: 11890 },
    { label: 'Fri', value: 12100 },
    { label: 'Sat', value: 12300 },
    { label: 'Sun', value: 12458.32 },
  ],
  '30D': [
    { label: 'Week 1', value: 10800 },
    { label: 'Week 2', value: 11200 },
    { label: 'Week 3', value: 11600 },
    { label: 'Week 4', value: 12458.32 },
  ],
  '1Y': [
    { label: 'Jan', value: 8900 },
    { label: 'Feb', value: 9400 },
    { label: 'Mar', value: 9100 },
    { label: 'Apr', value: 10600 },
    { label: 'May', value: 11200 },
    { label: 'Jun', value: 12458.32 },
  ],
};

const PerformanceChart = ({ currencySymbol = '$' }) => {
  const [timeframe, setTimeframe] = useState('1Y');
  const [hoverIndex, setHoverIndex] = useState(null);

  const data = PERFORMANCE_DATA[timeframe] || PERFORMANCE_DATA['1Y'];

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.96;
  const maxVal = Math.max(...values) * 1.04;
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  // Generate smooth SVG curve path
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  // Closed area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="perf-chart-container">
      <div className="perf-chart-header">
        <div>
          <div className="perf-title">Portfolio Performance</div>
          <div className="perf-val-row">
            <span className="perf-val">{currencySymbol}{activePoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="badge-green">+12.5%</span>
          </div>
        </div>

        <div className="timeframe-selector">
          {['1D', '7D', '30D', '1Y'].map((tf) => (
            <button
              key={tf}
              className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => {
                setTimeframe(tf);
                setHoverIndex(null);
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="svg-chart-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - paddingY - pct * chartH;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Gradient Area */}
          <path d={areaD} fill="url(#blueGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* Interactive Hover Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 6 : 4}
                fill={hoverIndex === i ? '#ffffff' : '#3b82f6'}
                stroke="#1e293b"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
              />
              {/* Invisible larger hit target */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={24}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          ))}
        </svg>

        {/* X-Axis Labels */}
        <div className="chart-x-labels">
          {points.map((pt, i) => (
            <span
              key={i}
              className={`x-label ${hoverIndex === i ? 'active' : ''}`}
              style={{ left: `${(pt.x / width) * 100}%` }}
            >
              {pt.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

