import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/enrollments/my-courses",
        {
          withCredentials: true,
        }
      );

      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Courses</h2>

      {courses.length === 0 ? (
        <p>No enrolled courses</p>
      ) : (
        courses.map((item) => (
          <div key={item._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{item.course.title}</h3>
            <p>{item.course.description}</p>
            <button onClick={() => navigate(`/course/${item.course._id}`)}>
              Open Course
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCourses;
