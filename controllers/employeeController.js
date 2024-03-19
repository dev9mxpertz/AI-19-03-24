// employeeController.js
const Employee = require('../models/employeeModel'); // Assuming you have an Employee model

exports.addEmployee = async (req, res) => {
  try {
    const { Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary } = req.body;

    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const newEmployee = new Employee({
      Name,
      Email_id,
      Phone_Number,
      EmployeeId,
      Address,
      Join_Date,
      Salary,

    });
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    // const employeeId = req.params.id;
    const employees = await Employee.find();
    // if (!employee) {
    //  res.status(404).json({ message: "Employee not found" });
    // }
    res.status(200).json({ message: "Employee found", employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { Name, Email_id, Phone_Number, EmployeeId: newEmployeeId, Address, Join_Date, Salary} = req.body; // Assuming these are the fields you want to update.
    const employeeId = req.params.id; // Extract the employeeId from the URL parameter.

    let employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee with new values. If you're using EmployeeId from the body to potentially update it, make sure it's a valid operation in your application logic.
    Object.assign(employee, { Name, Email_id, Phone_Number, EmployeeId: newEmployeeId || employee.EmployeeId, Address, Join_Date, Salary });
    await employee.save();

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.delete_employee = async (req, res) => {
  try {
      const employeeId = req.params.id;
      // Find and delete the employee from the database
      const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
      if (!deletedEmployee) {
          return res.status(404).json({ message: "Employee not found" });
      }
      // Respond with the ID of the deleted employee
      res.status(200).json(deletedEmployee.id);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

