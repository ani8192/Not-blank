import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "20px",
    background: "#f3f4f6",
    flex: 1,
  },
};