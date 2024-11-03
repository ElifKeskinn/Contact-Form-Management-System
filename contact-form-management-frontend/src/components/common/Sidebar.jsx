import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import LanguageSelector from "../../context/LanguageSelector"
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function Sidebar() {
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userImgBase64, setUserImgBase64] = useState("");
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
    setUserName(JSON.parse(localStorage.getItem("user"))?.username ?? "");
    setUserImgBase64(
      JSON.parse(localStorage.getItem("user"))?.base64Photo ?? "");


    console.log(userImgBase64);
  }, [userRole, userName, userImgBase64]);

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:5166/api/user/logout", null, {
        headers: {
          token,
        },
      })
      .then((res) => {
        console.log(res);
        setUserRole("");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Could not log out: ", err);
      });
  };


  const handleLanguageChange = (language) => {
    if (language) {
      i18n.changeLanguage(language)
        .then(() => {
          console.log(`Language changed to ${language}`);
        })
        .catch((error) => {
          console.error(`Failed to change language: ${error}`);
        });
    }
  };


  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      {(userRole === "admin" || userRole === "reader") && (
        <nav className={`Sidebar Sidebar-expand-lg ${darkMode ? "bg-dark text-light" : ""}`}>
          <div className="container-fluid">
            <Link className="Sidebar-brand text-warning fw-bold" to="/">
              🫡  {t('welcome')}
            </Link>
            <button
              className="Sidebar-toggler navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#SidebarNav"
              aria-controls="SidebarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <img
                src={userImgBase64}
                alt="Profile Pic"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              />
              <span className="navbar-toggler-icon">
                ☰
              </span>
            </button>
            <div className="collapse sidebar-collapse" id="SidebarNav">

              {userRole === "admin" && (
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/messages">
                      <h7 style={{ color: darkMode ? "white" : "#bbc1c9" }}>  {t('messages')}</h7>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">
                      <h7 style={{ color: darkMode ? "white" : "#bbc1c9" }}> {t('users')}</h7>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reports">
                      <h7 style={{ color: darkMode ? "white" : "#bbc1c9" }}> {t('reports')}</h7>
                    </Link>
                  </li>
                </ul>
              )}
              {userRole === "reader" && (
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/messages" style={{ color: darkMode ? "white" : "#bbc1c9" }}>
                      <h7>  {t('messages')}</h7>
                    </Link>
                  </li>
                </ul>
              )}
              <ul className="Sidebar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown me-5">
                  <Link
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={userImgBase64}
                      alt="Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="text-center">
                      <span className="dropdown-item-text">{userName}</span>
                    </li>
                    <hr />
                    <li className="dropdown-item d-grid">
                      <button
                        type="button"
                        className="btn custom-logout-button"
                        style={{ backgroundColor: "#85898f", color: "#2f3133", border: "black" }}

                        onClick={handleLogout}
                      >
                        {t('logout')}
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
      {!userRole && (
        <nav className={`Sidebar Sidebar-expand-lg ${darkMode ? "bg-dark text-light" : ""}`}>
          <div className="container-fluid">
            <Link className="Sidebar-brand text-warning fw-bold" to="/">
              {t('home')}  🏠
            </Link>
            <div className="collapse Sidebar-collapse" id="SidebarNav">

              <button type="button" className="btn custom-logout-button"
                style={{ backgroundColor: "#85898f", color: "#2f3133", border: "black" }}
              >
                <Link className="nav-link" to="/login">
                  {t('login')}
                </Link>
              </button>
            </div>
            <button
              className="Sidebar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#SidebarNav"
              aria-controls="SidebarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="Sidebar-toggler-icon"></span>
            </button>
            <ul className="Sidebar-nav mb-2 mb-lg-0"></ul>
          </div>
        </nav>
      )}

      <div className="text-center mt-3">
        <LanguageSelector onLanguageChange={handleLanguageChange} />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn btn-secondary"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            padding: "5px 10px",
            fontSize: "14px"
          }}
        >
          {darkMode ? t('lightMode') : t('darkMode')}
        </button>
      </div>
    </div>
  );
}
