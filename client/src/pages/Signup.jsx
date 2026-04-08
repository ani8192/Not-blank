import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [emailStatus, setEmailStatus] = useState("");
  const [emailColor, setEmailColor] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!formData.email) {
      setEmailStatus("");
      setEmailExists(false);
      return;
    }

    const timer = setTimeout(() => {
      checkEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const checkEmail = async () => {
    try {
      setCheckingEmail(true);

      const res = await api.post("/auth/check-email", {
        email: formData.email,
      });

      if (res.data.exists) {
        setEmailStatus("Email already exists");
        setEmailColor("red");
        setEmailExists(true);
      } else {
        setEmailStatus("Email available");
        setEmailColor("green");
        setEmailExists(false);
      }
    } catch (err) {
      setEmailStatus("Error checking email");
      setEmailColor("red");
      setEmailExists(true);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    setError(null);
    setSuccess(null);

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format");
    }

    if (emailExists) {
      return setError("Email already exists");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      setSuccess("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          {checkingEmail && <p>Checking...</p>}
          {!checkingEmail && emailStatus && (
            <p style={{ color: emailColor }}>{emailStatus}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading || emailExists}
            style={styles.button}
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

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
};