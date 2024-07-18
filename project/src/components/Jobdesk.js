import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AttendanceChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div style={{ width: '370px', height: '370px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

const Jobdesk = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [selectedOption, setSelectedOption] = useState('attendance');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/employees/6698f7d1dea0ba2ebbb97558`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const getAttendanceData = () => {
    if (currentYear === new Date().getFullYear() && currentMonth > new Date().getMonth() + 1) {
      return null;
    } else {
      return {
        labels: ['Regular Days', 'Early Days', 'On Leave', 'Late'],
        datasets: [
          {
            data: [10, 5, 4, 3],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
          },
        ],
      };
    }
  };

  if (!employee) {
    return <div className="jobdesk-container loading">Loading...</div>;
  }

  console.log('Employee data:', employee);

  return (
    <div className="jobdesk-container">
      <div className="employee-details">
        <div className="details-line">
          <div className="detail-container">
            <div className="detail-label">Name</div>
            <div className="detail-value">{employee.name}</div>
          </div>
          <div className="detail-container">
            <div className="detail-label">Department</div>
            <div className="detail-value">{employee.department}</div>
          </div>
          <div className="detail-container">
            <div className="detail-label">Role</div>
            <div className="detail-value">{employee.role}</div>
          </div>
        </div>
        <div className="details-line">
          <div className="detail-container">
            <div className="detail-label">Working Shift</div>
            <div className="detail-value">{employee.workShift}</div>
          </div>
          <div className="detail-container">
            <div className="detail-label">Emp ID</div>
            <div className="detail-value">{employee._id}</div>
          </div>
          <div className="detail-container">
            <div className="detail-label">Joining Date</div>
            <div className="detail-value">{employee.joiningDate}</div>
          </div>
        </div>
      </div>
      <div className="filter-section">
        <div className="month-year">
          <span className="arrow-button" onClick={goToPreviousMonth}>&#x25C0;</span>
          <div className="current-month">{months[currentMonth - 1]}</div>
          <div className="current-year">{currentYear}</div>
          <span className="arrow-button" onClick={goToNextMonth}>&#x25B6;</span>
        </div>
      </div>
      <div className="options-content-container">
        <div className="options-list">
          <ul>
            <li className={selectedOption === 'attendance' ? 'active' : ''} onClick={() => handleOptionClick('attendance')}>Attendance</li>
            <li className={selectedOption === 'documents' ? 'active' : ''} onClick={() => handleOptionClick('documents')}>Documents</li>
            <li className={selectedOption === 'bankDetails' ? 'active' : ''} onClick={() => handleOptionClick('bankDetails')}>Bank Details</li>
            <li className={selectedOption === 'address' ? 'active' : ''} onClick={() => handleOptionClick('address')}>Address</li>
            <li className={selectedOption === 'emergencyContacts' ? 'active' : ''} onClick={() => handleOptionClick('emergencyContacts')}>Emergency Contacts</li>
            <li className={selectedOption === 'assets' ? 'active' : ''} onClick={() => handleOptionClick('assets')}>Assets</li>
          </ul>
        </div>
        <div className="details-content">
          {selectedOption === 'attendance' && getAttendanceData() && (
            <div className="attendance-section">
              <h3>Attendance Dashboard</h3>
              <div className="graph-container">
                <AttendanceChart data={getAttendanceData()} />
              </div>
              <div className="attendance-stats">
                <div className="attendance-stat-row">
                  <div>
                    <h1>160</h1>
                    <p>Total Scheduled Work Hours</p>
                  </div>
                  <div>
                    <h1>150</h1>
                    <p>Total Work Availability</p>
                  </div>
                </div>
                <div className="attendance-stat-row">
                  <div>
                    <h1>140</h1>
                    <p>Total Working Active Hours</p>
                  </div>
                  <div>
                    <h1>Good</h1>
                    <p>Average Behaviour</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedOption === 'documents' && (
            <div>
              <h3>Documents</h3>
              <ul>
                {employee.documents.map((doc, index) => (
                  <li key={index}>
                    {doc.type}: {doc.number} (Expiry: {doc.expiry})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedOption === 'bankDetails' && (
            <div>
              <h3>Bank Details</h3>
              <p>Name: {employee.bankDetails.bankName}</p>
              <p>Branch: {employee.bankDetails.branch}</p>
              <p>Account No: {employee.bankDetails.accountNumber}</p>
              <p>IFSC: {employee.bankDetails.ifscCode}</p>
            </div>
          )}
          {selectedOption === 'address' && (
            <div>
              <h3>Address</h3>
              <p>
                {employee.address.street}, {employee.address.city}, {employee.address.state}, {employee.address.zip}, {employee.address.country}
              </p>
            </div>
          )}
          {selectedOption === 'emergencyContacts' && (
            <div>
              <h3>Emergency Contacts</h3>
              <ul>
                {employee.emergencyContacts.map((contact, index) => (
                  <li key={index}>
                    {contact.name} ({contact.relationship}): {contact.phone}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedOption === 'assets' && (
            <div>
              <h3>Assets</h3>
              <ul>
                {employee.assets.map((asset, index) => (
                  <li key={index}>
                    {asset.name}: {asset.serialNumber} (Issued: {asset.issuedDate})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobdesk;
