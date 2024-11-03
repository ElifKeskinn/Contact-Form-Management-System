import { useEffect, useState } from "react";
import Sidebar from '../components/common/Sidebar';
import axios from "axios";
import PieChart from "../components/reports/PieChart";
import BarChart from "../components/reports/BarChart";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const [messages, setMessages] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0 });
  const [countryMessageCounts, setCountryMessageCounts] = useState({});
  const [cardColor, setCardColor] = useState("rgba(0, 0, 0, 0.2)");
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    setCardColor("#999894");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5166/api/messages", { headers: { token } })
      .then(response => {
        setMessages(response.data.data.messages);
        console.log("Messages fetched: ", response);
      })
      .catch(error => {
        console.error("Error fetching messages: ", error);
      });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setGenderDistribution(calculateGenderDistribution(messages));
      setCountryMessageCounts(calculateCountryMessageCounts(messages));
    }
  }, [messages]);

  const calculateGenderDistribution = (messages) => {
    const counts = { male: 0, female: 0 };

    messages.forEach(message => {
      if (message.gender === "male") {
        counts.male++;
      } else if (message.gender === "female") {
        counts.female++;
      }
    });

    return counts;
  };

  const calculateCountryMessageCounts = (messages) => {
    const counts = {};

    messages.forEach(message => {
      const country = message.country;

      counts[country] = (counts[country] || 0) + 1;
    });

    return counts;
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      <div>
        <Sidebar />
        <div className="container mt-3">
          <div className="card" style={{ height: '910px' ,backgroundColor: cardColor }}>
            <div className="card-header">
              <h3>{t('reportDashboard')}</h3>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-4 d-flex align-items-center">
                  <h3 className="card-title text-warning">{t('countryMessageDistribution')}</h3>
                </div>
                <div className="col">
                  <BarChart
                    chartId="countryDistribution"
                    chartData={countryMessageCounts}
                  />
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-4 d-flex align-items-center">
                  <h3 className="card-title text-warning">{t('genderMessageDistribution')}</h3>
                </div>
                <div className="col">
                  <PieChart
                    chartId="genderDistribution"
                    maleCount={genderDistribution.male}
                    femaleCount={genderDistribution.female}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
