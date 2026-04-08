import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>

      <div style={styles.card}>
        <h2>Welcome, {user?.name || user?.email}</h2>
        <p style={styles.role}>{user?.role?.toUpperCase()}</p>
      </div>

      <div style={styles.column}>
        <div style={styles.box} onClick={() => navigate("/courses")}>
           Courses
        </div>

        <div style={styles.box} onClick={() => navigate("/assignments")}>
           Assignments
        </div>

        <div style={styles.box} onClick={() => navigate("/marks")}>
           Marks
        </div>

        <div style={styles.box} onClick={() => navigate("/profile")}>
           Profile
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  container: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
  },
  card: {
    margin: "20px auto",
    padding: "20px",
    maxWidth: "500px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  role: {
    color: "#666",
  },
  column: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  box: {
    width: "300px",
    background: "#2563eb",
    color: "white",
    padding: "18px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.2s",
  },
};