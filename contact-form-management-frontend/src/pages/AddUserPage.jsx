import { useEffect, useState } from "react";
import Sidebar from '../components/common/Sidebar';
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function AddUser() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fillAllFieldsAlert, setFillAllFieldsAlert] = useState(false);
  const [userAddedAlert, setUserAddedAlert] = useState(false);
  const [userAddedAlertErr, setUserAddedAlertErr] = useState(false);
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.5)");
  const { darkMode } = useDarkMode();
  const { t } = useTranslation(); 
  
  useEffect(() => {

    setCardBgColor("#999894");

  }, [cardBgColor]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.slice(0, 10));
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files[0];
    setPhoto(selectedPhoto);
  };

  const handleAddUser = () => {
    if (userName && password && photo) {
      const token = localStorage.getItem("token");
      const reader = new FileReader();

      reader.readAsDataURL(photo);
      reader.onloadend = () => {
        const base64Photo = reader.result;

        const newUser = {
          username: userName,
          password: password,
          base64Photo: base64Photo,
        };

        axios
          .post("http://localhost:5166/api/user/add-reader", newUser, {
            headers: { token },
          })
          .then((res) => {
            setUserAddedAlert(true);
            setUserAddedAlertErr(false);
            setFillAllFieldsAlert(false);
            setUserName("");
            setPassword("");
            setPhoto(null);
            console.log("New user successfully added: ", res);


          })
          .catch((err) => {
            setUserAddedAlert(false);
            setUserAddedAlertErr(true);
            setFillAllFieldsAlert(false);

            console.error("User could not be added: ", err);
          });
      };
    } else {
      setFillAllFieldsAlert(true);
      return;
    }
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
    <div>
      <Sidebar />
      <div className="container mt-5">
        <div className="card" style={{ backgroundColor: cardBgColor, fontSize: "1.2rem", padding: "2rem" }}>
          <div className="card-header">
             <h3 style={{ fontSize: "2rem" }}>{t('Add New User')}</h3>
          </div>
          <div className="card-body">
            <div className="container">
              <div className="row">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                 {t('Username')}:
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    id="text"
                    className="form-control"
                    value={userName}
                    onChange={handleUserNameChange}
                    maxLength={10}
                    minLength={1}
                  />
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className="col-3 text- d-flex align-items-center" style={{ marginLeft: '-10px' }}
                >
                   {t('Role')}:
                </div>
                <div className="col-9" style={{ textTransform: "capitalize", marginLeft: '10px' }}>
                {t('Reader')}
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                 {t('Password')}:
                </div>
                <div className="col-8 d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={10}
                    style={{ marginRight: '8px' }}
                  />
                </div>
                <div className="col d-flex align-items-center justify-content-center clickable-row">
                  <span
                    className="material-symbols-outlined"
                    onClick={handlePasswordToggle}
                  >
                    👀
                  </span>
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                   {t('Profile Picture:')}
                </div>
                {photo && (
                  <div className="col-2">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                )}
                <div className="col d-flex align-items-center">
                  <input
                    type="file"
                    id="photo"
                    className="form-control"
                    accept=".jpg, .jpeg, .png"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="row mb-2 mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleAddUser}
                    style={{
                      borderRadius: '12px',
                      padding: '10px 20px',
                      fontSize: '16px',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      border: '2px solid #49464a',
                      color: "black",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#211926'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                   {t('Add User')}
                  </button>
                </div>
                {fillAllFieldsAlert && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-primary">
                      {t('Please make sure to fill all of the fields')}                      </div>
                    </div>
                  </div>
                )}
                {userAddedAlert && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-success">
                      {t('User added successfully.')}                      </div>
                    </div>
                  </div>
                )}
                {userAddedAlertErr && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-danger">
                      {t('User could not be added.')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
