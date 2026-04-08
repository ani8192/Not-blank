import { useEffect, useState } from "react";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get("/api/v1/courses/my-courses", {
        withCredentials: true,
      });

      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div>
      <h2>My Courses</h2>

      {courses.map((course) => (
        <div key={course._id}>
          <h3>{course.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default MyCourses;