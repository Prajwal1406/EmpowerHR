// backend/routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController"); // Check the path here
const upload = require("../middleware/fileUpload");

// Apply the upload middleware to the route handling file uploads
router.post(
  "/createemployee",
  upload.single("image"),
  employeeController.createEmployee
);
router.put("/:id", employeeController.updateEmployee);
router.get("/getall", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.delete("/:id", employeeController.deleteEmployee);
router.post("/check-email", employeeController.checkDuplicateEmail);
// router.post("/bulk", employeeController.createmanyemployes);

module.exports = router;
