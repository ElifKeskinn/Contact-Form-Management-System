import { useParams } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';


const MessageDetails = () => {
  const { messageId } = useParams();
  const [message, setMessage] = useState({});
  const [outerCardBgColor, setOuterCardBgColor] =
    useState("rgba(0, 0, 0, 0.2)");
  const [innerCardBgColor, setInnerCardBgColor] =
    useState("rgba(0, 0, 0, 0.4)");
  const [formattedDate, setFormattedDate] = useState("");
  const [userRole, setUserRole] = useState("");
  const [messageDeletedAlert, setMessageDeletedAlert] = useState(false);
  const [messageDeletedErrorAlert, setMessageDeletedErrorAlert] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();
  
  //This is for formatting the dateTime
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  useEffect(() => {
    
      setOuterCardBgColor("rgba(0, 0, 0, 0.2)");
      setInnerCardBgColor("rgba(0, 0, 0, 0.4)");
    
  }, [innerCardBgColor, outerCardBgColor]);

  useEffect(() => {
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5166/api/message/${messageId}`, {
        headers: { token },
      })
      .then((res) => {
        setMessage(res.data.data.message);
        console.log(
          "Message with ID " + messageId + " retrieved successfully: ",
          res
        );
      })
      .catch((err) => {
        console.error("Message could not be received: ", err);
      });

    axios
      .post(`http://localhost:5166/api/message/read/${messageId}`, null, {
        headers: { token },
      })
      .then((res) => {
        console.log("Message is now marked as read: ", res);
      })
      .catch((err) => {
        console.log("Message could not be marked as read: ", err);
      });
  }, []);

  useEffect(() => {
    if (message.creationDate) {
      const dateTimeLang =  "en-US";
      const dateTime = new Date(message.creationDate);
      const dateTimeFormatted = new Intl.DateTimeFormat(
        dateTimeLang,
        options
      ).format(dateTime);
      setFormattedDate(dateTimeFormatted);
    }
  }, [message]);

  const handleDeleteMessage = () => {
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:5166/api/message/delete/${messageId}`, null, {
        headers: { token },
      })
      .then((res) => {
        console.log("Message succesfully deleted: ", res);
        setMessageDeletedAlert(true);
        setMessageDeletedErrorAlert(false);
        closeModal();
      })
      .catch((err) => {
        console.error("Error while deleting the message: ", err);
        setMessageDeletedAlert(false);
        setMessageDeletedErrorAlert(true);
        closeModal();
      });
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
    <div>
      <Sidebar />
      <div className="container mt-5">
        <div className="card" style={{ backgroundColor: "#999894" }} >
          <div className="card-header">
            <h3 className="card-title">{t('messageDetails')}</h3>
          </div>
          <div className="card-body">
            <div className="container" style={{ backgroundColor:" #999894" }}>
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('messageId')}
                </div>
                <div className="col-9">{message.id}</div>
              </div>
              <hr />
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('senderName')}
                </div>
                <div className="col-9">{message.name}</div>
              </div>
              <hr />
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('messageDetailsLabel')}
                </div>
                <div className="col-9">
                  <textarea
                    className="form-control readonly"
                    id="floatingTextarea"
                    value={message.message}
                    style={{ backgroundColor: innerCardBgColor }}
                  />
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('gender')}
                </div>
                <div className="col-9" style={{ textTransform: "capitalize", color: "black" }}>
                  {message.gender}
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('country')}
                </div>
                <div className="col-9" style={{ color: "black" }}>{message.country}</div>
              </div>
              <hr />
              <div className="row mb-2">
                <div className="col-3 text-warning d-flex align-items-center" style={{ color: "black" }}>
                {t('sentDate')}
                </div>
                <div className="col-9" style={{ color: "black !important"}}>{formattedDate}</div>
              </div>
              {userRole === "admin" && (
                <>
                  <hr />
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-warning"
                      onClick={openModal}
                      disabled={messageDeletedAlert}
                      style={{
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                        border: '2px solid #ccc4b8',
                        color: "#ccc4b8",
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ccc4b8'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {t('deleteMessage')}
                    </button>
                  </div>
                  {messageDeletedAlert && (
                    <div className="d-grid mt-4 alert alert-warning">
                      {t('messageDeleted')}
                    </div>
                  )}
                  {messageDeletedErrorAlert && (
                    <div className="d-grid mt-4 alert alert-danger">
                      {t('messageDeleteError')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title> {t('confirmDeletionBody')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {t('confirmDeletionBody')}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeModal}>
          {t('cancel')}
          </button>
          <button className="btn btn-danger" onClick={handleDeleteMessage}>
          {t('delete')}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
  

};

export default MessageDetails;
