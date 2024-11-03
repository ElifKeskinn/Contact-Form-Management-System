import { useDarkMode } from "../context/DarkModeContext";

const AdminPage = () => {

  const { darkMode } = useDarkMode();

    return (
      <div className={darkMode ? "bg-dark text-light" : ""}>
      <div>
        <h1>Admin Sayfası</h1>
        <p>Admin olarak giriş yaptınız. Burada admin özellikleri gösterilecek.</p>
      </div>
      </div>
    );
  };
  
  export default AdminPage;