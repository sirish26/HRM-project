import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    profile: '',
    id: '',
    designation: '',
    status: '',
    department: '',
    workShift: '',
    joiningDate: '',
    salary: '',
    role: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Unable to fetch data. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddClick = () => setIsAdding(true);

  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingEmployeeId(null);
    setNewEmployee({
      profile: '',
      id: '',
      designation: '',
      status: '',
      department: '',
      workShift: '',
      joiningDate: '',
      salary: '',
      role: '',
    });
  };

  const handleSubmitClick = async () => {
    try {
      if (editingEmployeeId) {
        // Update existing employee
        await axios.put(`http://localhost:5000/employees/${editingEmployeeId}`, newEmployee);
        const updatedEmployees = employees.map(emp => emp._id === editingEmployeeId ? newEmployee : emp);
        setEmployees(updatedEmployees);
      } else {
        // Add new employee
        const response = await axios.post('http://localhost:5000/employees', newEmployee);
        setEmployees([...employees, response.data]);
      }
      handleCancelClick();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEditClick = (employeeId) => {
    const employeeToEdit = employees.find(emp => emp._id === employeeId);
    setEditingEmployeeId(employeeId);
    setNewEmployee(employeeToEdit);
    setIsAdding(true);
  };

  const handleDeleteClick = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${employeeId}`);
      const updatedEmployees = employees.filter(emp => emp._id !== employeeId);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  let sortedEmployees = [...employees];
  if (sortField) {
    sortedEmployees.sort((a, b) => {
      const aValue = String(a[sortField] || '');
      const bValue = String(b[sortField] || '');
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }

  return (
    <>
      <button onClick={handleAddClick}>Add Employee</button>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Profile</th>
            <th onClick={() => handleSort('_id')}>Emp ID</th>
            <th onClick={() => handleSort('designation')}>Designation</th>
            <th onClick={() => handleSort('status')}>Employment Status</th>
            <th onClick={() => handleSort('department')}>Department</th>
            <th onClick={() => handleSort('workShift')}>Work Shift</th>
            <th onClick={() => handleSort('joiningDate')}>Joining Date</th>
            <th onClick={() => handleSort('salary')}>Salary</th>
            <th onClick={() => handleSort('role')}>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee._id}</td>
              <td>{employee.designation}</td>
              <td>{employee.status}</td>
              <td>{employee.department}</td>
              <td>{employee.workShift}</td>
              <td>{employee.joiningDate}</td>
              <td>{employee.salary}</td>
              <td>{employee.role}</td>
              <td>
                <button className="edit" onClick={() => handleEditClick(employee._id)}>Edit</button>
                <button className="delete" onClick={() => handleDeleteClick(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {isAdding && (
            <tr>
              {Object.keys(newEmployee).map((key) => (
                <td key={key}>
                  <input
                    type="text"
                    name={key}
                    value={newEmployee[key]}
                    onChange={handleChange}
                  />
                </td>
              ))}
              <td>
                <button className="save" onClick={handleSubmitClick}>Save</button>
                <button className="cancel" onClick={handleCancelClick}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default EmployeeTable;
