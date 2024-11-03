import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js/auto";
import { useDarkMode } from "../../context/DarkModeContext";

function PieChart({ chartId, maleCount, femaleCount }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const { darkMode } = useDarkMode();

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");

    // Define colors based on dark mode
    const backgroundColors = darkMode
      ? ["#2f3e4f", "#6e4459"]  // Dark mode colors
      : ["#007bff", "#ff007f"]; // Light mode colors (if different)

    const borderColor = darkMode ? "#000000" : "#ffffff"; // Light mode border color

    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = [maleCount, femaleCount];
      chartInstance.current.data.datasets[0].backgroundColor = backgroundColors;
      chartInstance.current.data.datasets[0].borderColor = borderColor;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(context, {
        type: "pie",
        data: {
          labels: ["Male", "Female"],
          datasets: [
            {
              label: "Gender Distribution",
              data: [maleCount, femaleCount],
              backgroundColor: backgroundColors,
              borderColor: borderColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
              font: {
                size: 28,
                weight: "normal",
              },
              text: "Gender Distribution",
              color: darkMode ? "white" : "black", // Title color based on dark mode
            },
            legend: {
              labels: {
                color: darkMode ? "white" : "black", // Legend text color based on dark mode
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartId, maleCount, femaleCount, darkMode]); // Include darkMode in dependency array

  return <canvas ref={canvasRef} id={`pieChart-${chartId}`} />;
}

PieChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  maleCount: PropTypes.number.isRequired,
  femaleCount: PropTypes.number.isRequired,
};

export default PieChart;