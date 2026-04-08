import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendMsg, setResendMsg] = useState("");
  const [loadingResend, setLoadingResend] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setResendMsg("");
    setShowResend(false);

    if (!email || !password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, accessToken } = res.data;

      
      dispatch(setCredentials({ user, accessToken }));

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);

      if (msg.toLowerCase().includes("verify")) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoadingResend(true);
      setResendMsg("");

      const res = await api.post("/auth/resend-verification", {
        email,
      });

      setResendMsg(res.data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Error");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {showResend && (
          <p style={styles.resend} onClick={handleResend}>
            {loadingResend
              ? "Sending..."
              : "Didn't get verification email? Resend"}
          </p>
        )}

        {resendMsg && <p style={styles.success}>{resendMsg}</p>}

        <p>
          Forgot password? <Link to="/forgot-password">Reset</Link>
        </p>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  success: {
    color: "green",
    fontSize: "14px",
  },
  resend: {
    color: "blue",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
};