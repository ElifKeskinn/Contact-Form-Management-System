import { useState, useEffect } from 'react';
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.4)");
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    setCardBgColor("#999894");
  }, [cardBgColor]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5166/api/user/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        window.location.href = "/";
        console.log("User: " + localStorage.getItem("user"));
        console.log("Token: " + localStorage.getItem("token"));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        console.error("Error occurred while logging in:", error);

      }
    }
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      <div>
      <Sidebar />
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <div className={`card m-5 p-5 ${darkMode ? "bg-dark text-light" : ""}`}>
            <div className="card-body">
              <h1
                className="card-title fw-bold text-center text-warning text-strong"
                style={{ fontSize: "80px" }}
              >
                ✉️ CFMS
              </h1>
              <h4>{t('contactFormManagementSystems')}</h4>
              <hr className="mb-5" />
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginUsername" className="form-label">
                  {t('username')}
                  </label>
                  <input
                    className="form-control"
                    id="loginUsername"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                  {t('password')}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="alert alert-danger d-grid mb-2">{error}</div>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      borderColor: "#6c757d",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontSize: "16px"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#5a6268";
                      e.currentTarget.style.borderColor = "#545b62";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#6c757d";
                      e.currentTarget.style.borderColor = "#6c757d";
                    }}
                  >
                    {t('login')}
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

