import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PerformanceChart from '../components/Charts/PerformanceChart';

describe('PerformanceChart Component', () => {
  it('renders the chart title and default values', () => {
    render(<PerformanceChart currencySymbol="$" />);
    
    expect(screen.getByText('Portfolio Performance')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders all timeframe selector buttons', () => {
    render(<PerformanceChart currencySymbol="$" />);
    
    const timeframes = ['1D', '7D', '30D', '1Y'];
    timeframes.forEach((tf) => {
      expect(screen.getByRole('button', { name: tf })).toBeInTheDocument();
    });
  });

  it('switches timeframe when button is clicked', () => {
    render(<PerformanceChart currencySymbol="$" />);
    
    const btn7D = screen.getByRole('button', { name: '7D' });
    fireEvent.click(btn7D);
    expect(btn7D).toHaveClass('active');

    const btn30D = screen.getByRole('button', { name: '30D' });
    fireEvent.click(btn30D);
    expect(btn30D).toHaveClass('active');
    expect(btn7D).not.toHaveClass('active');
  });

  it('renders the SVG chart container and paths', () => {
    const { container } = render(<PerformanceChart currencySymbol="$" />);
    
    const svg = container.querySelector('svg.chart-svg');
    expect(svg).toBeInTheDocument();

    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(paths[0]).toHaveAttribute('d');
  });
});
