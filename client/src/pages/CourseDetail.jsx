import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [tab, setTab] = useState("stream");
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setHasAccess(false);

        await axios.get(`http://localhost:5000/api/v1/courses/${id}/access`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setHasAccess(true);

        const res = await axios.get("http://localhost:5000/api/v1/courses", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const matchedCourse =
          res.data?.data?.find((item) => item._id === id) || null;

        setCourse(matchedCourse);
      } catch (err) {
        if (err.response?.status === 403) {
          alert("You are not enrolled in this course");
          navigate("/courses");
          return;
        }

        if (err.response?.status === 404) {
          alert("Course not found");
          navigate("/courses");
          return;
        }

        console.error("Course detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadCourse();
    }
  }, [accessToken, id, navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        Checking access...
      </div>
    );
  }

  if (!hasAccess) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{course?.title || "Course Detail"}</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setTab("stream")}>Stream</button>
        <button onClick={() => setTab("assignments")}>Assignments</button>
        {(user?.role === "teacher" || user?.role === "admin") && (
          <button onClick={() => navigate(`/course/${id}/students`)}>
            View Students
          </button>
        )}
      </div>

      {tab === "stream" && (
        <div>
          <h3>Announcements</h3>
          <p>Welcome to the course</p>
          <p>Assignment uploaded</p>

          <h3>Recent Activity</h3>
          <p>New student joined</p>
        </div>
      )}

      {tab === "assignments" && (
        <div>
          <p>Assignments will appear here</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
