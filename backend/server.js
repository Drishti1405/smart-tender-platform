import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Basic route to check if API is alive in the browser
app.get('/', (req, res) => {
  res.send('Smart Tender API is successfully running!');
});

// Define the User Schema for MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['NEEDER', 'VENDOR'], default: 'VENDOR' }
});

const UserModel = mongoose.model('User', UserSchema);

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// --- AUTHENTICATION ROUTES ---

// 1. Register Route (Saves Email and Password to MongoDB)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password so it's safely tucked away 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to MongoDB
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    const savedUser = await newUser.save();
    res.json({ message: "User registered successfully", userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login Route (Checks Email and Password from MongoDB)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by Email
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Email or Password" });

    // Verify Password matches the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid Email or Password" });

    // Create JWT token for sessions
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key');
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Connect to MongoDB
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tender-platform'; // Replace with your MongoDB Connection string if needed

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB successfully!`);
    if(process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Backend server ready on port ${PORT}`));
    }
  })
  .catch((err) => console.log('Failed to connect to MongoDB', err));

export default app;
