import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// const Employee = require("../models/Employee");

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [duplicateEmail, setDuplicateEmail] = useState(false);

  // Fetch employee data by ID
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/employees/${id}`
        );
        setEmployee({
          ...response.data,
          course: Array.isArray(response.data.course)
            ? response.data.course
            : [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployee();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      const courses = Array.isArray(employee.course) ? employee.course : [];
      const updatedCourses = courses.includes(value)
        ? courses.filter((course) => course !== value)
        : [...courses, value];
      setEmployee({ ...employee, course: updatedCourses });
    } else {
      setEmployee({ ...employee, [name]: value });
    }

    // Reset errors on input change
    setErrors({ ...errors, [name]: "" });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validate file type
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setErrors({ ...errors, image: "Only jpg and png formats are allowed." });
    } else {
      setEmployee({ ...employee, image: file });
      setErrors({ ...errors, image: "" });
    }
  };

  // Check for duplicate email
  const checkDuplicateEmail = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/employees/check-email",
        {
          email,
        }
      );
      setDuplicateEmail(response.data.exists);
      if (response.data.exists) {
        setErrors({ ...errors, email: "Email already exists" });
      }
    } catch (error) {
      console.error("Error checking duplicate email:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    const newErrors = {};
    if (!employee.name.trim()) newErrors.name = "Name is required";
    if (!employee.email || !/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!employee.mobile || !/^\d+$/.test(employee.mobile)) {
      newErrors.mobile = "Mobile number must be numeric";
    }
    if (!employee.image) newErrors.image = "Image is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for duplicate email before submitting
    await checkDuplicateEmail(employee.email);
    if (duplicateEmail) return;

    // Prepare form data for submission
    const formData = new FormData();
    Object.keys(employee).forEach((key) => {
      formData.append(key, employee[key]);
    });

    try {
      await axios.put(`http://localhost:5000/employees/${id}`, formData);
      navigate("/employee-list"); // Navigate back to employee list after editing
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            onBlur={() => checkDuplicateEmail(employee.email)}
            required
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <div>
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobile"
            value={employee.mobile}
            onChange={handleChange}
            required
          />
          {errors.mobile && (
            <span style={{ color: "red" }}>{errors.mobile}</span>
          )}
        </div>
        <div>
          <label>Designation:</label>
          <select
            name="designation"
            value={employee.designation}
            onChange={handleChange}
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={employee.gender === "Male"}
              onChange={handleChange}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={employee.gender === "Female"}
              onChange={handleChange}
            />{" "}
            Female
          </label>
        </div>
        <div>
          <label>Course:</label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="MCA"
              checked={employee.course.includes("MCA")}
              onChange={handleChange}
            />{" "}
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BCA"
              checked={employee.course.includes("BCA")}
              onChange={handleChange}
            />{" "}
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BSC"
              checked={employee.course.includes("BSC")}
              onChange={handleChange}
            />{" "}
            BSC
          </label>
        </div>
        <div>
          <label>Image Upload:</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
          {errors.image && <span style={{ color: "red" }}>{errors.image}</span>}
        </div>
        <button type="submit">Update Employee</button>
        <button type="button" onClick={() => navigate("/employee-list")}>
          Go to Employee List
        </button>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
