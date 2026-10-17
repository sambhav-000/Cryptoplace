import React, { useState } from 'react';
import './Charts.css';

const DonutChart = ({ allocations = [], totalValue = 12458.32, currencySymbol = '$' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const radius = 80;
  const strokeWidth = 24;
  const center = 110;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const activeItem = hoveredIndex !== null ? allocations[hoveredIndex] : null;

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-visual">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <g transform={`rotate(-90 ${center} ${center})`}>
            {allocations.map((item, index) => {
              const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += item.percent;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={item.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </g>

          {/* Center Text */}
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="18"
            fontWeight="700"
            fontFamily="inherit"
          >
            {activeItem
              ? `${currencySymbol}${activeItem.value.toLocaleString()}`
              : `${currencySymbol}${totalValue.toLocaleString()}`}
          </text>
          <text
            x={center}
            y={center + 14}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="500"
            fontFamily="inherit"
          >
            {activeItem ? `${activeItem.name} (${activeItem.percent}%)` : 'Total Value'}
          </text>
        </svg>
      </div>

      {/* Legend list */}
      <div className="donut-legend">
        {allocations.map((item, index) => (
          <div
            key={item.name}
            className={`legend-item ${hoveredIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="legend-left">
              <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
              <span className="legend-name">{item.name}</span>
            </div>
            <div className="legend-right">
              <span className="legend-percent">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;

