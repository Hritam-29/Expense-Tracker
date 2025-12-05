import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h3 className="nav-title">Expense Tracker</h3>

      {isLoggedIn && (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add">Add Expense</Link>
          <Link to="/reports">Reports</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
