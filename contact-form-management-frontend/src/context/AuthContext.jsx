import { useEffect, useState } from "react";
import axios from "axios";

export default function AuthContext() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.post(
            "http://localhost:5166/api/user/check-login",
            null,
            {
              headers: {
                token: token,
              },
            }
          );
          console.log(response.status);

          if (response.status == 200) {
            setAuthenticated(true);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          setAuthenticated(false);
          localStorage.removeItem("token");
        }
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  if (!isLoading) {
    return { authenticated };
  } else {
    return { isLoading: true };
  }
}
