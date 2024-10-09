import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const validateInputs = () => {
    let tempErrors = {};

    if (!name.trim()) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      tempErrors.email = "Invalid email format";

    if (!mobile) tempErrors.mobile = "Mobile number is required";
    else if (!/^\d+$/.test(mobile))
      tempErrors.mobile = "Mobile number should contain only numeric values";

    if (!designation) tempErrors.designation = "Designation is required";

    if (!gender) tempErrors.gender = "Gender is required";

    if (course.length === 0) tempErrors.course = "Select at least one course";

    if (!image) tempErrors.image = "Image upload is required";
    else if (!["image/jpeg", "image/png"].includes(image.type))
      tempErrors.image = "Only JPG/PNG files are allowed";

    setErrors(tempErrors);

    // If no errors, return true
    return Object.keys(tempErrors).length === 0;
  };

  const checkDuplicateEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/employees/check-email",
        { email }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking duplicate email", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const isDuplicateEmail = await checkDuplicateEmail();
    if (isDuplicateEmail) {
      alert("Email already exists");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("course", course);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/employees/createemployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      alert("Employee created successfully");
    } catch (error) {
      console.error("Error creating employee", error);
      alert("Failed to create employee");
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Designation:</label>
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          >
            <option value="">Select Designation</option>
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
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
        </div>
        <div>
          <label>Course:</label>
          <label>
            <input
              type="checkbox"
              value="MCA"
              checked={course.includes("MCA")}
              onChange={(e) => {
                if (e.target.checked) {
                  setCourse([...course, "MCA"]);
                } else {
                  setCourse(course.filter((c) => c !== "MCA"));
                }
              }}
            />
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              value="BCA"
              checked={course.includes("BCA")}
              onChange={(e) => {
                if (e.target.checked) {
                  setCourse([...course, "BCA"]);
                } else {
                  setCourse(course.filter((c) => c !== "BCA"));
                }
              }}
            />
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              value="BSC"
              checked={course.includes("BSC")}
              onChange={(e) => {
                if (e.target.checked) {
                  setCourse([...course, "BSC"]);
                } else {
                  setCourse(course.filter((c) => c !== "BSC"));
                }
              }}
            />
            BSC
          </label>
        </div>
        <div>
          <label>Image Upload:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit">Create Employee</button>
        <button type="button" onClick={() => navigate("/employee-list")}>
          Go to Employee List
        </button>
        <Link to="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      </form>
    </div>
  );
};

export default CreateEmployee;
