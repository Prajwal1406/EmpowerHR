import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Importing the CSS styles

function Dashboard() {
  const [adminUsername, setAdminUsername] = useState("");
  const navigate = useNavigate();
  console.log(adminUsername);
  useEffect(() => {
    const storedUsername = localStorage.getItem("adminUsername");
    if (storedUsername) {
      setAdminUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Remove login state and admin username
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2 className="dashboard-title">Welcome to Admin Dashboard</h2>
        <div className="dashboard-buttons">
          <button
            className="dashboard-button"
            onClick={() => navigate("/create-employee")}
          >
            Create Employee
          </button>
          <button
            className="dashboard-button"
            onClick={() => navigate("/employee-list")}
          >
            View Employees
          </button>
          <button
            className="dashboard-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
