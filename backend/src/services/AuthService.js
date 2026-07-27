import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });
  }

  async registerUser(userData) {
    const { fullName, email, password } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (user) {
      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  }
}

export default new AuthService();
