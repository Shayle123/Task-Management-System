import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../index.css"; // same CSS reuse

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* TITLE */}
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Register to start managing tasks</p>

        {/* USERNAME */}
        <div className="input-group">
          <label className="label">Username</label>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter username"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <label className="label">Password</label>
          <div className="input-box">
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="input-group">
          <label className="label">Role</label>
          <div className="input-box">
            <select
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        {/* BACK TO LOGIN */}
        <p className="register">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}