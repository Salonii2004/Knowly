import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Op } from "sequelize";
import { models } from "../models/index.js";
const { User, RefreshToken } = models;



const router = express.Router();


// Helper: Generate Access + Refresh tokens
const generateTokens = async (user) => {
  try {
    // Generate access token (valid for 1 hour)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token (valid for 7 days)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // ✅ Ensure RefreshToken model exists in your DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    // Return both tokens
    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error generating tokens:", err);
    throw new Error("Failed to generate tokens");
  }
};


// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password });
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const validRoles = ['user', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'user';

    console.log('Checking for existing user:', email);
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('Creating user:', { name, email, role: userRole });
    const user = await User.create({ name, email, password, role: userRole });
    console.log('User created:', user.id);

    console.log('Generating tokens for user:', user.id);
    const tokens = await generateTokens(user);
    console.log('Tokens generated successfully');

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (err) {
    console.error('Signup error:', {
      message: err.message,
      stack: err.stack,
      userData: req.body,
      environment: process.env.NODE_ENV,
    });
    res.status(500).json({
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing required fields for login:', { email, password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format for login:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    console.log('Finding user:', email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Validating password for user:', user.id);
    const valid = await user.validatePassword(password);
    if (!valid) {
      console.log('Invalid password for user:', user.id);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Generating tokens for login:', user.id);
    const tokens = await generateTokens(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (err) {
    console.error('Login error:', {
      message: err.message,
      stack: err.stack,
      userEmail: req.body.email,
      environment: process.env.NODE_ENV,
    });
    res.status(500).json({
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    console.log('Refreshing token for refreshToken length:', refreshToken.length);
    const savedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!savedToken) {
      console.log('Refresh token not found in database');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('User not found for refresh:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Generating new tokens for user:', user.id);
    const tokens = await generateTokens(user);
    await savedToken.destroy();

    res.json(tokens);
  } catch (err) {
    console.error('Refresh token error:', {
      message: err.message,
      stack: err.stack,
      environment: process.env.NODE_ENV,
    });
    res.status(403).json({
      message: 'Invalid or expired refresh token',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    console.log('Deleting refresh token length:', refreshToken.length);
    await RefreshToken.destroy({ where: { token: refreshToken } });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', {
      message: err.message,
      stack: err.stack,
      environment: process.env.NODE_ENV,
    });
    res.status(500).json({
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    console.log('Finding user for password reset:', email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for password reset:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    console.log('Sending password reset email to:', email);
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Knowly Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<h3>Password Reset</h3>
             <p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link will expire in 1 hour.</p>`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', {
      message: err.message,
      stack: err.stack,
      email: req.body.email,
      environment: process.env.NODE_ENV,
    });
    res.status(500).json({
      message: 'Failed to send reset link',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    console.log('Finding user for password reset with token:', token.substring(0, 10) + '...');
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      console.log('Invalid or expired token for password reset');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log('Updating password for user:', user.id);
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', {
      message: err.message,
      stack: err.stack,
      environment: process.env.NODE_ENV,
    });
    res.status(500).json({
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

export default router;

