import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const BudgetChart = ({ data, resetZoomRef }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.labels.length === 0) return; 
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
              label: function(context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
                }
                return label;
              }
            }
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          },
          title: {
            display: true,
            text: 'Budget Chart',
            color: 'black',
            font: {
              size: 24
            }
          },
        },
        scales: {
          x: {
            stacked: true,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            title: {
              display: true,
              text: 'Month' 
            }
          },
          y: {
            stacked: true,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
              }
            },
            title: {
              display: true,
              text: 'Amount ($)' 
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    });

    resetZoomRef.current = () => {
      myChart.resetZoom();
    };

    return () => {
      myChart.destroy();
    };
    const resetZoom = () => {
      myChart.resetZoom();
    }
  }, [data, resetZoomRef]);

  return (
    <div className="chart-container" style={{ position: 'relative', width: '85vw', margin: '0 auto' }}>
      <canvas ref={chartRef} id="budgetChart"></canvas>
    </div>
  );
};

export default BudgetChart;
