const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://root:root@numerty.t7qkzms.mongodb.net/clientproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiry: Date
});
const User = mongoose.model('User', userSchema);

// Employee Schema and Model
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  workType: { type: String, required: true },
  role: { type: String, required: true },
  workShift: { type: String, required: true },
  empId: { type: String, required: true },
  attendance: { type: String }, // You can adjust the type as per your requirement
  joiningDate: { type: Date },

  // Documents as an array of PDF files
  documents: [{
    name: { type: String },
    fileUrl: { type: String } // Assuming this is a URL to the PDF file
  }],

  bankDetails: {
    name: { type: String },
    phoneNumber: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branch: { type: String }
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },

  emergencyContacts: [{
    name: { type: String },
    phoneNumber: { type: String }
  }],

  assets: { type: String } // You can adjust the type as per your requirement
});
const Employee = mongoose.model('Employee', employeeSchema);

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Routes

// Register a new user
app.post('/register', async (req, res) => {
  const { role, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ role, email, password: hashedPassword });
  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful', role: user.role });
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = '123456'; // For future: crypto.randomInt(100000, 999999).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'OTP sent to email' });
  });
});

// Reset password route
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.otp !== otp || user.otpExpiry < Date.now()) return res.status(400).json({ error: 'Invalid or expired OTP' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

// Create a new employee
app.post('/employees', async (req, res) => {
  const { name, department, salary, workType, role, workShift, empId, attendance, joiningDate,
          documents, bankDetails, address, emergencyContacts, assets } = req.body;

  const newEmployee = new Employee({
    name, department, salary, workType, role, workShift, empId, attendance, joiningDate,
    documents, bankDetails, address, emergencyContacts, assets
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get employee by ID
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update employee by ID
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete employee by ID
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
