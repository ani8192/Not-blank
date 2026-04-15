import { useState } from "react";
import axios from "axios";

const JoinCourse = () => {
  const [code, setCode] = useState("");

  const handleJoin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/enrollments/join",
        { code },
        { withCredentials: true }
      );

      alert(res.data?.message || "Success");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to join course"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Join Course</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter course code"
      />
      <button type="button" onClick={handleJoin}>
        Join Course
      </button>
    </div>
  );
};

export default JoinCourse;
