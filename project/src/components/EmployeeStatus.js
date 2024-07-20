import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Checkbox, FormControlLabel, Button } from '@mui/material';

const EmployeeStatus = () => {
  const [dataKey] = useState('value');
  const [selectedBarChart, setSelectedBarChart] = useState('by Designation');
  const [selectedSegments, setSelectedSegments] = useState(['Early', 'Regular', 'Late']);

  // Sample data for bar chart and pie chart
  const barDataDesignation = [
    { name: 'Emp 1', value: 48 },
    { name: 'Emp 2', value: 33 },
    { name: 'Emp 3', value: 20 },
    { name: 'Emp 4', value: 278 },
    { name: 'Emp 5', value: 189 },
  ];

  const barDataDepartment = [
    { name: 'Dev', value: 70 },
    { name: 'Testing', value: 35 },
    { name: 'BPO', value: 22 },
    { name: 'HR', value: 28 },
    { name: 'Management', value: 3},
  ];

  const barDataEmployment = [
    { name: 'Job 1', value: 60 },
    { name: 'Job 2', value: 41 },
    { name: 'Job 3', value: 23 },
    { name: 'Job 4', value: 29 },
    { name: 'Job 5', value: 33 },
  ];

  const pieData = [
    { name: 'Early', value: 40 },
    { name: 'Regular', value: 7 },
    { name: 'Late', value: 3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleChartChange = (chart) => {
    setSelectedBarChart(chart);
  };

  const handleSegmentToggle = (segment) => {
    setSelectedSegments((prevSelected) =>
      prevSelected.includes(segment)
        ? prevSelected.filter((s) => s !== segment)
        : [...prevSelected, segment]
    );
  };

  const filteredPieData = pieData.filter((entry) => selectedSegments.includes(entry.name));

  let barData;
  switch (selectedBarChart) {
    case 'by Department':
      barData = barDataDepartment;
      break;
    case 'by Designation':
      barData = barDataDesignation;
      break;
    default:
      barData = barDataEmployment;
      break;
  }

  return (
    <div className="employee-status">
      <div className="header">
        <Button variant="contained" color="primary" style={{ margin: '5px' }} onClick={() => handleChartChange('Punch In/Punch Out')}>
          Punch In/Punch Out
        </Button>
        <Button variant="contained" color="primary" style={{ margin: '5px' }} onClick={() => handleChartChange('Take Break')}>
          Take Break
        </Button>
        <Button variant="contained" color="primary" style={{ margin: '5px' }} onClick={() => handleChartChange('View as Employee')}>
          View as Employee
        </Button>
      </div>
      <div className="statistics">
        <div className="stats-box">
          <h3>Total Employees</h3>
          <div className="box-content"></div>
        </div>
        <div className="stats-box">
          <h3>Total Departments</h3>
          <div className="box-content"></div>
        </div>
        <div className="stats-box">
          <h3>Leave Status</h3>
          <div className="box-content"></div>
        </div>
        <div className="stats-box">
          <h3>On Leave Today</h3>
          <div className="box-content"></div>
        </div>
      </div>
      <div className="charts">
        <div className="bar-chart">
          <h4> Employee statistics :
            <span style={{ color: selectedBarChart === 'by Designation' ? 'skyblue' : 'inherit', cursor: 'pointer' }} onClick={() => handleChartChange('by Designation')}>
              by Designation
            </span>
            {' | '}
            <span style={{ color: selectedBarChart === 'by Department' ? 'skyblue' : 'inherit', cursor: 'pointer' }} onClick={() => handleChartChange('by Department')}>
              by Department
            </span>
            {' | '}
            <span style={{ color: selectedBarChart === 'by Job' ? 'skyblue' : 'inherit', cursor: 'pointer' }} onClick={() => handleChartChange('by Job')}>
              by Job
            </span>
          </h4>
          <ResponsiveContainer width="100%" height={370}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey={dataKey}  barSize={30}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="pie-chart">
          <h3>Total Attendance Today: 25</h3>
          <div className="checkbox-container">
            {pieData.map((entry) => (
              <FormControlLabel
                key={entry.name}
                control={
                  <Checkbox
                    checked={selectedSegments.includes(entry.name)}
                    onChange={() => handleSegmentToggle(entry.name)}
                    name={entry.name}
                  />
                }
                label={entry.name}
              />
            ))}
          </div>
          <ResponsiveContainer width="100%" height={370}>
            <PieChart>
              <Pie
                data={filteredPieData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {filteredPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatus;
