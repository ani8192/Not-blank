import { useState } from "react";
import api from "../api/axios";

const OTPReset = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-otp-reset", form);
      alert("Password reset successful");
    } catch (err) {
      alert(err.response?.data?.message || "Reset Failed");
    }
  };

  return (
    <div>
      <h2>Reset Password via OTP</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <br /><br />

        <input
          placeholder="OTP"
          onChange={(e) =>
            setForm({ ...form, otp: e.target.value })
          }
        />
        <br /><br />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <br /><br />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default OTPReset;