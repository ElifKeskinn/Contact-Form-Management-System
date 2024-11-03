import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function Messages() {
  const [userRole, setUserRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [outerCardBgColor, setOuterCardBgColor] =
    useState("rgba(0, 0, 0, 0.2)");
  const [innerCardBgColor, setInnerCardBgColor] =
    useState("rgba(0, 0, 0, 0.4)");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messageIdToBeDeleted, setMessageIdToBeDeleted] = useState("");
  const [messageDeleteErrorAlert, setMessageDeleteErrorAlert] = useState(false);
  const [sortBy, setSortBy] = useState("date_desc");
  const [filterOptions, setFilterOptions] = useState({
    gender: [],
    status: [],
  });
  const [messageLimit] = useState(1);
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const openModal = () => {
    setShowModal(true);
    setMessageDeleteErrorAlert(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessageIdToBeDeleted("");
    setMessageDeleteErrorAlert(false);
  };

  useEffect(() => {

    setOuterCardBgColor("rgba(255, 255, 255, 0.2)");
    setInnerCardBgColor("rgba(255, 255, 255, 0.4)");

  }, []);


  useEffect(() => {
    fetchMessages();
  }, [messageIdToBeDeleted, sortBy, filterOptions, messageLimit]);


  const fetchMessages = () => {
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
    const token = localStorage.getItem("token");
    const requestData = {
      sortBy,
      filterOptions,
      messageLimit,
      page: currentPage,
    };

    axios
      .post("http://localhost:5166/api/messages/filter", requestData, {
        headers: {
          token,
        },
      })
      .then((res) => {
        setMessages(res.data.data.messages);
        setTotalPages(res.data.data.totalPages);
        console.log("Messages received: ", res);
      })
      .catch((err) => {
        console.error("Error while receiving messages: ", err);
      });
  };


  useEffect(() => {
    fetchMessages();
  }, [messageIdToBeDeleted, sortBy, filterOptions, messageLimit]);

  const navigateToMessageDetails = (messageId) => {
    navigate(`/messages/${messageId}`);
  };

  const handleDeleteMessage = async () => {
    const token = localStorage.getItem("token");
    console.log(messageIdToBeDeleted);
    axios
      .post(
        `http://localhost:5166/api/message/delete/${messageIdToBeDeleted}`, {},
        {
          headers: { token },


        }
      )

      .then((res) => {
        console.log("Message succesfully deleted: ", res);
        setMessageIdToBeDeleted();
        closeModal();
      })
      .catch((err) => {
        console.error("Error while deleting the message: ", err);
        setMessageIdToBeDeleted("");
        setMessageDeleteErrorAlert(true);
      });
  };

  const handleGenderFilterChange = (value) => {
    const updatedGenderOptions = filterOptions.gender.includes(value)
      ? filterOptions.gender.filter((item) => item !== value)
      : [...filterOptions.gender, value];

    setFilterOptions({
      ...filterOptions,
      gender: updatedGenderOptions,
    });
  };

  const handleReadStatusFilterChange = (value) => {
    const updatedReadOptions = filterOptions.status.includes(value)
      ? filterOptions.status.filter((item) => item !== value)
      : [...filterOptions.status, value];

    setFilterOptions({
      ...filterOptions,
      status: updatedReadOptions,
    });
  };
  /*
    useEffect(() => {
      const scrollContainer = document.querySelector(".scrollable-table") ?? null;
  
      function handleScroll() {
        if (scrollContainer) {
          console.log("Scrolling...");
          const isBottom =
            scrollContainer.scrollTop + scrollContainer.clientHeight + 50 >=
            scrollContainer.scrollHeight;
  
          if (isBottom) {
            console.log("Bottom of the container reached. New messages fetched.");
            setMessageLimit((prevMessageLimit) => prevMessageLimit + 5);
          }
        }
      }
  
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }, []);
  */
  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      <div>
        <Sidebar />
        <div className="container mt-2">
          <div
            className="card"
            style={{
              backgroundColor: outerCardBgColor,
            }}
          >
            <div className="card-header">
              <h3>{t("messages")}</h3>
            </div>
            <div className="card-body">
              <div className="row mb-4 d-flex align-items-center">
                <div className="col-">
                  <div className="form-group">
                    <label htmlFor="sortBy">
                      {t("sortBy")}
                    </label>
                    <select
                      id="sortBy"
                      className="form-control"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date_desc">
                        {t("dateDescending")}
                      </option>
                      <option value="date_asc">
                        {t("dateAscending")}
                      </option>
                      <option value="sender_name_asc">
                        {t("senderNameAscending")}
                      </option>
                      <option value="sender_name_desc">
                        {t("senderNameDescending")}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label>
                      {t("filterBy")}
                    </label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="male"
                          value="male"
                          checked={filterOptions.gender.includes("male")}
                          onChange={() => handleGenderFilterChange("male")}
                          className="form-check-input"
                        />
                        <label htmlFor="male" className="form-check-label">
                          {t("male")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="female"
                          value="female"
                          checked={filterOptions.gender.includes("female")}
                          onChange={() => handleGenderFilterChange("female")}
                          className="form-check-input"
                        />
                        <label htmlFor="female" className="form-check-label">
                          {t("female")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="read"
                          value="read"
                          checked={filterOptions.status.includes("read")}
                          onChange={() => handleReadStatusFilterChange("read")}
                          className="form-check-input"
                        />
                        <label htmlFor="read" className="form-check-label">
                          {t("read")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="unread"
                          value="unread"
                          checked={filterOptions.status.includes("unread")}
                          onChange={() => handleReadStatusFilterChange("unread")}
                          className="form-check-input"
                        />
                        <label htmlFor="unread" className="form-check-label">
                          {t("unread")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="table-responsive card"
                style={{
                  backgroundColor: innerCardBgColor,

                }}
              >
                <table
                  className={`table table-hover table- table-borderless`}
                >
                  <thead>
                    <tr>
                      <th>{t("status")}</th>
                      <th>{t("name")}</th>
                      <th>{t("message")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr
                        key={message.id}
                        className="clickable-row"
                        onClick={() => {
                          navigateToMessageDetails(message.id);
                        }}
                      >
                        <td
                          className={
                            message.read == "true" ? "text-secondary" : "text-warning"}
                        >
                          {message.read == "true" ? t("read") : t("unread")}
                        </td>
                        <td
                          className={
                            message.read == "true" ? "text-secondary" : ""
                          }
                        >
                          {message.name}
                        </td>
                        <td
                          className={
                            message.read == "true" ? "text-secondary" : ""
                          }
                        >
                          {message.message}
                        </td>
                        <td
                          className={
                            message.read == "true" ? "text-secondary" : ""
                          }
                        >
                          {userRole === "admin" && (
                            <span
                              className="material-symbols-outlined delete-icon"
                              onClick={(event) => {
                                event.stopPropagation();
                                setMessageIdToBeDeleted(message.id);
                                openModal();
                              }}
                            >
                              {t("delete")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <div className="pagination-controls">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                    >
                      {t("prevPage")}
                    </button>
                    <span>
                      {t("page")} {currentPage} {t("of")} {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
                      }
                    >
                      {t("nextPage")}
                    </button>
                  </div>
                </table>
              </div>



            </div>
          </div>
        </div>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {t("confirmDelete")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t("deleteMessageConfirm")}
            {messageDeleteErrorAlert && (
              <div className="alert alert-danger">
                {t("deleteError")}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={closeModal}>
              {t("close")}
            </button>
            <button className="btn btn-danger" onClick={handleDeleteMessage}>
              {t("delete")}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  );
}
