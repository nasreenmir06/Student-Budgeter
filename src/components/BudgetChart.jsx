import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const BudgetChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.labels.length === 0) return; 
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
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
          }
        },
        scales: {
          x: {
            stacked: true,
            barPercentage: 1.0,
            categoryPercentage: 1.0
          },
          y: {
            stacked: true,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
              }
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    });

    return () => {
      myChart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} id="budgetChart"></canvas>
    </div>
  );
};

export default BudgetChart;
