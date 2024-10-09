import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css"; // Add this line to include your CSS styles

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/employees/getall"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(employee.createdAt).toLocaleDateString().includes(searchTerm)
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-list-container">
      <h1 className="title">Employee List</h1>
      <div className="buttons">
        <Link to="/create-employee">
          <button className="primary-button">Create Employee</button>
        </Link>
        <Link to="/dashboard">
          <button className="secondary-button">Go to Dashboard</button>
        </Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, ID, or date"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("uniqueID")}>Unique ID</th>
            <th>Image</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th onClick={() => handleSort("createdAt")}>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>
                <img
                  src={`http://localhost:5000/${employee.image}`}
                  alt={employee.name}
                  className="employee-image"
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>
                {Array.isArray(employee.course)
                  ? employee.course.join(", ")
                  : employee.course}
              </td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/editemployee/${employee._id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredEmployees.length / employeesPerPage) },
          (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
