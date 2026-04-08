import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await new Promise((res) => setTimeout(res, 800));

        const res = await api.get(`/auth/verify/${token}`);

        if (res.data.status === "already_verified") {
          setStatus("already");
        } else {
          setStatus("success");
        }

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && (
          <p>Verifying your email...</p>
        )}

        {status === "success" && (
          <p style={styles.success}>
            Email verified successfully
          </p>
        )}

        {status === "already" && (
          <p style={styles.warning}>
            Email already verified
          </p>
        )}

        {status === "error" && (
          <p style={styles.error}>
            Invalid or expired link
          </p>
        )}
      </div>
    </div>
  );
};

export default Verify;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "300px",
  },
  success: {
    color: "green",
    fontWeight: "bold",
  },
  warning: {
    color: "orange",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};