import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.5)");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    setCardBgColor("rgba(255, 255, 255, 0.5)");

  }, [cardBgColor]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5166/api/users", {
        headers: {
          token,
        },
      })
      .then((res) => {
        setUsers(res.data.data.users);
        console.log("Users list received: ", res);
      })
      .catch((err) => {
        console.error("Users list could not be received: ", err);
      });
  }, []);
  const navigateToEditUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const navigateToAddUser = () => {
    navigate("/users/add-new-user");
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      <div>
        <Sidebar />
        <div className="container mt-4">
          <div className="card" style={{ backgroundColor: cardBgColor }}>
            <div className="card-header">
              <div className="row">
                <div className="col-3">
                  <h3>{t("usersTitle")}</h3>
                </div>
                <div
                  className="col offset-6 d-grid"
                  style={{ textAlign: "right" }}
                >
                  <button
                    className={`btn btn-outline`}
                    onClick={navigateToAddUser}
                  >
                    {t("addNewUser")}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table
                className={`table table- align-middle table-borderless`}
              >
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}></th>
                    <th>{t("username")}</th>
                    <th>{t("role")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img
                          className="rounded-circle img-fluid"
                          style={{ width: "50px", height: "auto" }}
                          src={user.base64Photo}
                          alt={t("profilePic")}
                        />
                      </td>
                      <td>{user.username}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {t("reader")}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span
                          className={`material-symbols-outlined text fs-5 clickable-row`}
                          onClick={() => {
                            navigateToEditUser(user.id);
                          }}
                        >
                          {t("clickToManage")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

