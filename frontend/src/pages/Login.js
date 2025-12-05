import { useState, useContext } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;

      login(token,
        response.data.name,
         response.data.email
      );
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
  <div className="login-wrapper">

    {/* image */}
    <div className="login-left">
      <img 
        src="/Login.png"  
        alt="login visual"
      />
    </div>

    {/* form */}
    <div className="login-right">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder=" Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder=" Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/register")}
          >
            New User? Sign Up
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>

  </div>
);

}

export default Login;
