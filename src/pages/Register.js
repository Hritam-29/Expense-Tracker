import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/");
    } catch {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    
    <div className="register-wrapper">
      {/* image */}
      <div className="register-left">
        <img 
          src="/Login.png"  
          alt="register visual"
        />
      </div>
    
    {/* form */}
    <div className="register-right">
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder=" Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder=" Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder=" Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder=" Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />


        <button type="submit">Register</button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
    </div>
    </div>
  );
}

export default Register;
