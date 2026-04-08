import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(logout());

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔥 force reload (fixes blank/login issue)
      window.location.href = "/login";
    }
  };

  return (
    <nav style={styles.nav}>
      <h3>My School</h3>

      <div style={styles.right}>
        {user ? (
          <>
            <span>Welcome {user.email}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#1f2937",
    color: "white",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  logoutBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};