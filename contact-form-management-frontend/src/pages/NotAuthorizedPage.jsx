import { Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function NotAuthorized() {
  const { darkMode } = useDarkMode();
  const { t } = useTranslation()

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
    <div className="container m-5">
    <h1>{t("notAuthorized")}</h1>
      <h4>
        <Link to="/">
        {t("takeMeBackHome")}
          </Link>
      </h4>
    </div>
    </div>
  );
}
