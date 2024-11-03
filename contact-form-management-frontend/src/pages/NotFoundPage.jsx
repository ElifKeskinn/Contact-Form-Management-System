import { Link } from 'react-router-dom';
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

export default function NoPage() {
  const { darkMode } = useDarkMode();
  const { t } = useTranslation();

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
      <div className="container m-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {t("pageNotFound")}
          </h1>
          <h4 style={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'underline', color: '#4c627a', fontWeight: 'bold' }}>
              {t("takeMeBackHome")}
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
}
