import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>My School</h2>

      <Link to="/dashboard" style={styles.link}>Dashboard</Link>

      {user?.role === "student" && (
        <Link to="/courses" style={styles.link}>My Courses</Link>
      )}

      {user?.role === "teacher" && (
        <Link to="/manage" style={styles.link}>Manage Students</Link>
      )}

      {user?.role === "admin" && (
        <Link to="/admin" style={styles.link}>Admin Panel</Link>
      )}
    </div>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: "220px",
    background: "#111827",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "15px",
  },
  logo: {
    marginBottom: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
};