import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signUp = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists', { cause: 409 });

  const hashedPassword = await bcrypt.hash(password, 13);
  let newUser = await User.create({ ...req.sanitizedBody, password: hashedPassword });

  newUser = newUser.toObject();
  delete newUser.password;

  res.json(newUser);
};

const signIn = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  let user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid Credentials', { cause: 400 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid Credentials', { cause: 400 });

  const payload = { id: user._id, firstName: user.firstName };
  const jwtSecret = process.env.JWT_SECRET;
  const tokenOptions = { expiresIn: '7d' };

  const token = jwt.sign(payload, jwtSecret, tokenOptions);

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax'
  };

  user = user.toObject();
  delete user.password;

  res.cookie('token', token, cookieOptions);
  res.json(user);
};

const signOut = async (_req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax'
  };

  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: 'Goodbye' });
};

const me = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) throw new Error('User does not exist', { cause: 404 });

  res.json(user);
};

export { signIn, signUp, signOut, me };
