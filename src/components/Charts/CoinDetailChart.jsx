import React, { useState } from 'react';
import './Charts.css';

const TIME_DATA = {
  '1D': {
    labels: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM', '11:59 PM'],
    points: [64200, 65100, 64900, 66300, 67432],
  },
  '7D': {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    points: [63800, 64200, 64900, 65500, 66200, 66800, 67432],
  },
  '30D': {
    labels: ['Sep 15', 'Sep 22', 'Sep 29', 'Oct 6', 'Oct 14'],
    points: [59800, 61500, 63200, 64800, 67432],
  },
  '1Y': {
    labels: ['Oct 23', 'Jan 24', 'Apr 24', 'Jul 24', 'Oct 24'],
    points: [34000, 42000, 61000, 58000, 67432],
  },
  'ALL': {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    points: [11000, 64000, 19000, 31000, 67432],
  },
};

const CoinDetailChart = ({ coin, currencySymbol = '$' }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('Line');
  const [hoverIndex, setHoverIndex] = useState(null);

  const rawData = TIME_DATA[timeframe] || TIME_DATA['1D'];

  // Scale data to coin current price
  const baseScale = (coin?.current_price || 67432.12) / 67432.12;
  const scaledPoints = rawData.points.map((p) => p * baseScale);

  const minVal = Math.min(...scaledPoints) * 0.985;
  const maxVal = Math.max(...scaledPoints) * 1.015;
  const range = maxVal - minVal || 1;

  const width = 740;
  const height = 300;
  const paddingX = 40;
  const paddingY = 35;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const pts = scaledPoints.map((val, i) => {
    const x = paddingX + (i / (scaledPoints.length - 1)) * chartW;
    const y = height - paddingY - ((val - minVal) / range) * chartH;
    return { x, y, val, label: rawData.labels[i] };
  });

  const pathD = pts.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${height - paddingY} L ${pts[0].x} ${height - paddingY} Z`;

  const lastPoint = pts[pts.length - 1];
  const activePt = hoverIndex !== null ? pts[hoverIndex] : lastPoint;

  // Y-axis ticks
  const yTicks = [
    maxVal,
    maxVal - range * 0.25,
    maxVal - range * 0.5,
    maxVal - range * 0.75,
    minVal,
  ];

  return (
    <div className="coin-detail-chart-card">
      <div className="chart-toolbar">
        {/* Timeframe buttons */}
        <div className="timeframe-selector">
          {['1D', '7D', '30D', '1Y', 'ALL'].map((tf) => (
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

        {/* Chart type toggle */}
        <div className="chart-type-selector">
          <button
            className={`type-btn ${chartType === 'Line' ? 'active' : ''}`}
            onClick={() => setChartType('Line')}
          >
            Line
          </button>
          <button
            className={`type-btn ${chartType === 'Candle' ? 'active' : ''}`}
            onClick={() => setChartType('Candle')}
          >
            Candle
          </button>
        </div>
      </div>

      <div className="svg-chart-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val, idx) => {
            const y = height - paddingY - ((val - minVal) / range) * chartH;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10.5"
                  fontFamily="inherit"
                >
                  {currencySymbol}{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {chartType === 'Line' ? (
            <>
              {/* Gradient Area */}
              <path d={areaD} fill="url(#emeraldGradient)" />

              {/* Stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                filter="url(#emeraldGlow)"
              />

              {/* Last point indicator badge */}
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r="6"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="3"
              />

              {/* Tag box for price */}
              <g transform={`translate(${Math.min(activePt.x + 10, width - 110)}, ${Math.max(activePt.y - 14, 15)})`}>
                <rect
                  x="0"
                  y="0"
                  width="95"
                  height="26"
                  rx="6"
                  fill="#10b981"
                />
                <text
                  x="47"
                  y="17"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily="inherit"
                >
                  {currencySymbol}{activePt.val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </text>
              </g>
            </>
          ) : (
            // Candle representation
            pts.map((pt, i) => {
              const candleW = 16;
              const open = pt.val * (1 - (i % 2 === 0 ? 0.008 : -0.008));
              const close = pt.val;
              const high = Math.max(open, close) * 1.012;
              const low = Math.min(open, close) * 0.988;
              const isUp = close >= open;

              const yOpen = height - paddingY - ((open - minVal) / range) * chartH;
              const yClose = height - paddingY - ((close - minVal) / range) * chartH;
              const yHigh = height - paddingY - ((high - minVal) / range) * chartH;
              const yLow = height - paddingY - ((low - minVal) / range) * chartH;

              return (
                <g key={i}>
                  <line
                    x1={pt.x}
                    y1={yHigh}
                    x2={pt.x}
                    y2={yLow}
                    stroke={isUp ? '#10b981' : '#ef4444'}
                    strokeWidth="1.5"
                  />
                  <rect
                    x={pt.x - candleW / 2}
                    y={Math.min(yOpen, yClose)}
                    width={candleW}
                    height={Math.max(Math.abs(yOpen - yClose), 4)}
                    rx="2"
                    fill={isUp ? '#10b981' : '#ef4444'}
                  />
                </g>
              );
            })
          )}

          {/* Interactive touch targets */}
          {pts.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={24}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
        </svg>

        {/* X-Axis Labels */}
        <div className="chart-x-labels">
          {pts.map((pt, i) => (
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

export default CoinDetailChart;

