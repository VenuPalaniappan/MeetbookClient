// src/pages/Login.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google user info:", decoded);

      const res = await fetch("http://localhost:8800/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error("Google login failed");

      navigate("/");
    } catch (error) {
      console.error(error);
      setErr("Google login failed");
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Let's Meet Up.</h1>
          <p>
            A place where everyone can connect, share life experiences, and create memories.
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {err && <p className="error">{err}</p>}
            <button onClick={handleLogin}>Login</button>
          </form>
          <h2>OR</h2>
          <div style={{ marginTop: "1rem" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErr("Google login failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
