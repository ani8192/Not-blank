import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CourseStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/v1/courses/${id}/students`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setStudents(res.data?.students || []);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/courses");
          return;
        }

        console.error("Students fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchStudents();
    }
  }, [accessToken, id, navigate]);

  const handleRemoveStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this student?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(studentId);
      setSuccessMessage("");

      const res = await axios.delete(
        `http://localhost:5000/api/v1/courses/${id}/students/${studentId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setStudents((prev) => prev.filter((student) => student._id !== studentId));
      setSuccessMessage(res.data?.message || "Student removed successfully");
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/courses");
        return;
      }

      alert(err.response?.data?.message || "Failed to remove student");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading students...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Enrolled Students</h2>

      {successMessage && <p>{successMessage}</p>}

      {students.length === 0 ? (
        <p>No students enrolled</p>
      ) : (
        students.map((student) => (
          <div
            key={student._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <p>Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <button
              onClick={() => handleRemoveStudent(student._id)}
              disabled={deletingId === student._id}
            >
              {deletingId === student._id ? "Removing..." : "Remove"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseStudents;
