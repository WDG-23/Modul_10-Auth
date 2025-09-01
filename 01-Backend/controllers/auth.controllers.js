import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // Email überprüfen
  const emailInUse = await User.exists({ email });
  if (emailInUse) {
    // throw new Error("Go to login", 200)
    throw new Error('Email already in use', 409);
  }

  // Passwort absichern
  const salt = await bcrypt.genSalt(13);
  const hashedPW = await bcrypt.hash(password, salt);

  // User speichern
  const user = (await User.create({ ...req.body, password: hashedPW })).toObject();
  delete user.password;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_DAYS + 'd',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN_DAYS) * 24 * 60 * 60 * 1000),
  });

  res.json({ msg: 'Registered', data: user });
};

export { registerUser };
