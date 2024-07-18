import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import Jobdesk from './Jobdesk';
import EmployeeTable from './EmployeeTable';

const Dashboard = ({ userRole }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [selectedOption, setSelectedOption] = useState(null); 
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // logout logic here (clearing tokens, localStorage)
    navigate('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleExpand = (item) => {
    setExpanded(expanded === item ? null : item);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); 
  };

  const menuItems = [
    {
      label: 'Employee',
      subItems: ['All Employees', 'Designation', 'Employee Status'],
    },
    {
      label: 'Leave',
      subItems: ['Leave Status', 'Leave Request'],
    },
    {
      label: 'Attendance',
      subItems: ['Daily Log', 'Attendance Request', 'Summary'],
    },
    {
      label: 'Payroll',
      subItems: ['Salary Generation', 'Pay run', 'Pay Slips'],
    },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar} 
        >
          <MenuIcon />
        </IconButton>
        <h4>{selectedOption || 'Admin'}</h4>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="more"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={handleRefresh}>Refresh</MenuItem>
          <MenuItem onClick={closeSidebar}>Close Sidebar</MenuItem>
        </Menu>
      </header>
      <div className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="dashboard-sidebar">
          <ul>
            <li onClick={(e) => e.stopPropagation()}><b onClick={() => handleOptionClick('jobdesk')}>Job Desk</b></li>
            {menuItems.map(({ label, subItems }) => (
              <li key={label} onClick={() => toggleExpand(label)}>
                <b>{label}</b>
                {expanded === label && (
                  <ul>
                    {subItems.map((subItem) => (
                      <li key={subItem} onClick={(e) => { e.stopPropagation(); handleOptionClick(subItem); }}>
                        {subItem}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li onClick={(e) => e.stopPropagation()}><b>Administrations</b></li>
            <li onClick={(e) => e.stopPropagation()}><b>Assets</b></li>
            <li onClick={(e) => e.stopPropagation()}><b>Settings</b></li>
          </ul>
        </div>
        <main className="dashboard-content">
          <div className="content">
            {selectedOption === 'jobdesk' && <Jobdesk />}
            {selectedOption === 'All Employees' && <EmployeeTable />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
