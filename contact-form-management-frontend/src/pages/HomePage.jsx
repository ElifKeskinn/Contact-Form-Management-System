import { useState, useEffect } from 'react';
import axios from "axios";
import Sidebar from '../components/common/Sidebar';
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    gender: "male",
    country: "",
  });

  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.4)");
  const { darkMode } = useDarkMode();

  useEffect(() => {
    setCardBgColor("#999894");
  }, [cardBgColor]);

  useEffect(() => {
    axios
      .get("http://localhost:5166/api/countries")
      .then((res) => {
        setCountries(res.data.data.countries);
      })
      .catch((err) => {
        console.error("Error while fetching the countries", err);
      });
    console.log(countries);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // Handle user login
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Form is being submitted:", formData);

    axios
      .post("http://localhost:5166/api/message/add", formData)
      .then((res) => {
        console.log("Form submitted succesffully:", res.data);
        setShowSuccessAlert(true);
      })
      .catch((err) => {
        console.error("Error sending form data:", err);
        setError(true);
      });
  };



  return (
    <div className={darkMode ? "bg-dark text-light" : ""}

    >

      <div>
        <Sidebar />
        <div className="container mt-5 d-flex justify-content-center align-items-center">
          <div className="card w-50" style={{ backgroundColor: cardBgColor }}>
            <div className="card-header">
              <h2 className="card-title">
                {t('contactUs')}
              </h2>
            </div>
            <div className="card-body">
              {showSuccessAlert && (
                <div
                  className="alert alert-primary alert-dismissible fade show mt-3 mb-3"
                  role="alert"
                >
                  {t('formSubmittedSuccessfully')}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setShowSuccessAlert(false)}
                  ></button>
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show mt-3 mb-3"
                  role="alert"
                >
                  {t('errorSubmittingForm')}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setError(false)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    maxLength="50"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {t('gender')}
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="male">
                      {t('male')}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="female">
                      {t('female')}
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    {t('country')}

                  </label>
                  <select
                    className="form-select"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    autoComplete="country"
                  >
                    <option value="" disabled>
                      {t('selectCountry')}
                    </option>
                    {countries.map(country => (
                      <option
                        key={country._id}
                        value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    {t('message')}
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    maxLength="500"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  ></textarea>
                </div>
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
                    {t('submit')}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
