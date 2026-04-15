import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000/api/v1/courses";
  const ENROLL_URL = "http://localhost:5000/api/v1/enrollments";

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL, {
        withCredentials: true,
      });

      setCourses(res.data?.courses || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // FETCH MY COURSES
  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`${ENROLL_URL}/my-courses`, {
        withCredentials: true,
      });

      const ids = res.data.map((item) => item.course._id);
      setEnrolledCourses(ids);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(BASE_URL, { title }, { withCredentials: true });
      setTitle("");
      fetchCourses();
    } catch (err) {
      alert("Create failed");
    }
  };

  const handleEnroll = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/${id}/enroll`,
        {},
        { withCredentials: true }
      );

      setEnrolledCourses((prev) => [...prev, id]);
    } catch (err) {
      alert("Enroll failed");
    }
  };

  useEffect(() => {
    fetchCourses();
    if (user?.role === "student") fetchMyCourses();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Courses</h2>

      {/* CREATE */}
      {(user?.role === "teacher" || user?.role === "admin") && (
        <div style={{ marginBottom: "20px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
          />
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* GRID UI 🔥 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {courses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course._id);

          return (
            <div
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              {/* TOP BLUE BAR */}
              <div
                style={{
                  background: "#4a90e2",
                  color: "white",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {course.title}
              </div>

              {/* BODY */}
              <div style={{ padding: "10px" }}>
                <p>
                  Teacher: {course.teacher?.name || "Unknown"}
                </p>

                {/* STUDENT BUTTON */}
                {user?.role === "student" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 prevent card click
                      handleEnroll(course._id);
                    }}
                    disabled={isEnrolled}
                    style={{
                      backgroundColor: isEnrolled ? "gray" : "blue",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;