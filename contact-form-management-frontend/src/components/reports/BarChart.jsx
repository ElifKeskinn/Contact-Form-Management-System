
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js/auto";
import { useDarkMode } from "../../context/DarkModeContext";

function BarChart({ chartId, chartData }) {
  // Verilerin geçerli olup olmadığını kontrol et
  const validatedData = chartData && typeof chartData === 'object' ? chartData : {};
  
  // Verileri sıralayıp düzenle
  const sortedEntries = Object.entries(validatedData).sort(([, a], [, b]) => b - a);
  const sortedChartData = Object.fromEntries(sortedEntries);

  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const { darkMode } = useDarkMode();
  
  
  const barColor = darkMode ? "#143152" : "#b728ee";
  const borderBarColor = darkMode ? "#143152" : "#850fb2";

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = Object.keys(sortedChartData);
      chartInstanceRef.current.data.datasets[0].data = Object.values(sortedChartData);
      chartInstanceRef.current.data.datasets[0].backgroundColor = barColor;
      chartInstanceRef.current.data.datasets[0].borderColor = borderBarColor;
      chartInstanceRef.current.update();

    } else {
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(sortedChartData),
          datasets: [
            {
              label: "Message Count",
              data: Object.values(sortedChartData),
              backgroundColor: barColor,
              borderColor: borderBarColor,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: darkMode ? "white" : "black",
                precision: 0,
                callback: (value) => (value % 1 === 0 ? value.toString() : ""),
              },
              grid: {
                color: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              ticks: {
                color: darkMode ? "white" : "black",
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            title: {
              display: false,
              font: {
                size: 30,
                weight: "lighter",
              },
              text: "Message Counts by Country",
              color: darkMode ? "orange" : "black",
            },
            legend: {
              labels: {
                color: darkMode ? "white" : "black",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartId, sortedChartData, darkMode]);

  return <canvas ref={canvasRef} id={`chart-${chartId}`} />;
}

BarChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.objectOf(PropTypes.number).isRequired,
};



export default BarChart;
