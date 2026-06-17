import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, CheckSquare } from "lucide-react";
import "../index.css";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LOGO */}
        <div className="logo">
          <div className="logo-box">
            <CheckSquare />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">
          Login to manage your tasks efficiently
        </p>

        {/* USERNAME */}
        <div className="input-group">
          <label className="label">Username</label>
          <div className="input-box">
            <User size={18} />
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
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
            <Lock size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* FORGOT */}
        <div className="forgot">
          <button>Forgot Password?</button>
        </div>

        {/* LOGIN BUTTON */}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {/* REGISTER */}
        <p className="register">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}