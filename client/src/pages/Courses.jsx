import { useEffect, useState } from "react";
import axios from "axios";

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const BASE_URL = "http://localhost:5000/api/v1/courses";

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(BASE_URL, {
        withCredentials: true,
      });

      console.log("API RESPONSE:", res.data);

      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE COURSE
  const handleCreate = async () => {
    try {
      const res = await axios.post(
        BASE_URL,
        { title },
        { withCredentials: true }
      );

      alert("Course created successfully");
      setTitle("");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  // ENROLL COURSE
  const handleEnroll = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${id}/enroll`,
        {},
        { withCredentials: true }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Enroll failed");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Courses</h2>

      {/* CREATE COURSE */}
      {(user?.role === "teacher" || user?.role === "admin") && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* COURSE LIST */}
      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{course.title}</h3>
            <p>Teacher: {course.teacher}</p>

            {/* STUDENT */}
            {user?.role === "student" && (
              <button onClick={() => handleEnroll(course._id)}>
                Enroll
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Courses;