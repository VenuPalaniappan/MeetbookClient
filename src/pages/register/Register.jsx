import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);   

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!inputs.password || inputs.password.length < 8) {
    setErr("Password must be at least 8 characters long.");
    return;
  }

    try {
     
      await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs,
        { withCredentials: true }
      );

      
      await login({ username: inputs.username, password: inputs.password });

    
      navigate("/");
    } catch (err) {
      setErr(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>MeetBook.</h1>
          <p>
            Join a growing community. Connect, share and explore stories around
            the world.
          </p>
          <span>Already have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength={8} 
              onChange={handleChange}
            />
            <small style={{ color: "#666" }}>Must be at least 8 characters.</small>
            
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
            />
            {err && <p className="error">{err}</p>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
