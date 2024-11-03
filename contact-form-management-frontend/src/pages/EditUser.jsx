import Sidebar from '../components/common/Sidebar';
import { useEffect, useState } from "react";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

export default function EditUser() {

  const [user, setUser] = useState({});
  const [ setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpdatedAlert, setPasswordUpdatedAlert] = useState(false);
  const [passwordUpdatedAlertErr, setPasswordUpdatedAlertErr] = useState(false);
  const [imgChangedAlert, setImgChangedAlert] = useState(false);
  const [imgChangedErr, setImgChangedErr] = useState(false);
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.5)");
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {

    setCardBgColor("#999894");

  }, [cardBgColor]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    axios
    .get(`http://localhost:5166/api/user?username=${storedUsername}&password=${storedPassword}`, { headers: { token } })
    .then((res) => {
        setUser(res.data);
        setUsername(res.data.username)
        setPassword(res.data.password);
        console.log("User successfully retrieved: ", res);
      })
      .catch((err) => {
        console.error("Error while retrieving user: ", err);
      });
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.slice(0, 10));
  };

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files[0];
    setPhoto(selectedPhoto);
  };

  const handlePhotoUpload = () => {
    const token = localStorage.getItem("token");

    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = () => {
      const base64Photo = reader.result;

      const updatedUser = {
        ...user,
        base64Photo,
      };
      console.log(updatedUser);

      axios
        .post(`http://localhost:5166/api/user/update`, updatedUser, {
          headers: { token },
        })
        .then((res) => {
          setUser(updatedUser);
          console.log(
            "User's profile picture has been succesfully updated: ",
            res
          );
          setImgChangedAlert(true);
          setImgChangedErr(false);
        })
        .catch((err) => {
          console.error("Error while updating profile picture: ", err);
          setImgChangedAlert(false);
          setImgChangedErr(true);
        });
    };
  };

  const handleSavePassword = () => {
    if (!password) {
      setPasswordUpdatedAlert(false);
      setPasswordUpdatedAlertErr(true);
      return;
    }

    const token = localStorage.getItem("token");
    const updatedUser = {
      ...user,
      password,
    };

    axios
      .post(`http://localhost:5166/api/user/update`, updatedUser, {
        headers: { token },
      })
      .then((res) => {
        setUser(updatedUser);
        console.log("User's password have been succesfully updated: ", res);
        setPasswordUpdatedAlert(true);
        setPasswordUpdatedAlertErr(false);
      })
      .catch((err) => {
        console.error("Error while updating user password: ", err);
        setPasswordUpdatedAlert(false);
        setPasswordUpdatedAlertErr(true);
      });
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
    <div>
      <Sidebar />
      <div className="container mt-5" >
        <div className="card" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <h3>{t('userPage')}</h3>
          </div>
          <div className="card-body">
            <div className="container" style={{ backgroundColor: cardBgColor }}>
              <div className="row">
                <div
                  className={`col-3 text -  d-flex align-items-center`}
                >
                {t('username')}
                </div>
                <div className="col-9">{user.username}</div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className="col-3 text -  d-flex align-items-center" style={{ marginLeft: '-10px' }}
                >
                   {t('role')}
                </div>
                <div className="col-9" style={{ textTransform: "capitalize" }}>
                  {user.role === "admin"}
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                   {t('password')}
                </div>
                <div className="col-6 d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={10}
                  />
                </div>
                <div className="col-1 d-flex align-items-center justify-content-center clickable-row">
                  <span
                    className="material-symbols-outlined"
                    onClick={handlePasswordToggle}
                  >
                    👀
                  </span>
                </div>
                <div className="col d-flex justify-content-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSavePassword}
                    style={{
                      borderRadius: '12px',
                      padding: '10px 20px',
                      fontSize: '16px',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      border: '2px solid #49464a',
                      color: "grey",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#211926'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     {t('changePassword')}
                  </button>
                </div>
              </div>
              {passwordUpdatedAlert && (
                <>
                  <div className="row mb-2 mt-4">
                    <div className="col offset-3">
                      <div className="alert alert-info">
                      {t('passwordChanged')}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {passwordUpdatedAlertErr && (
                <>
                  <div className="row mb-2 mt-4">
                    <div className="col offset-3">
                      <div className="alert alert-danger">
                      {t('passwordChangeError')}                      </div>
                    </div>
                  </div>
                </>
              )}
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                 {t('profilePicture')}
                </div>
                <div className="col-9">
                  <img
                    src={user.base64Photo}
                    className="rounded-circle"
                    alt="Profile Picture"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text- d-flex align-items-center`}
                >
                {t('changeProfilePicture')}
                </div>
                <div className="col">
                  <input
                    type="file"
                    id="photo"
                    className="form-control"
                    accept=".jpg, .jpeg, .png"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              {photo && (
                <div className="row mb-2 mt-4">
                  <div className="col-2 offset-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                  <div className="col d-flex align-items-center">
                    <button
                      className="btn btn-outline-info"
                      onClick={handlePhotoUpload}
                    >
                      {t('setAsProfilePicture')}
                    </button>
                  </div>
                  {imgChangedAlert && (
                    <div className="col d-flex align-items-center">
                      <div className="alert alert-info">
                      {t('profilePictureChanged')}                      </div>
                    </div>
                  )}
                  {imgChangedErr && (
                    <div className="col d-flex align-items-center">
                      <div className="alert alert-danger">
                      {t('profilePictureChangeError')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
