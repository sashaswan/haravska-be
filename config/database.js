const mongoose = require('mongoose');
const User = require('../api/models/user');
const bcrypt = require('bcryptjs');

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const connectDB = async () => {
  try {
    const dbUser = process.env.DB_USER || 'haravska';
    const dbPassword = process.env.DB_PASSWORD || '8nMe6wtJF8EgXPBt';
    const dbName = process.env.DB_NAME || 'haravska'; // Ensure the database name is explicitly specified
    const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@haravska.fzydr.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=haravska`;

    await mongoose.connect(mongoURI); // Remove deprecated options
    console.log('MongoDB Cluster Connected Successfully...');

    const admin = await User.findOne({ role: 'admin' }).exec();
    if (!admin) {
      const hashedPassword = await cryptPassword('Aa123456');
      const newAdmin = new User({
        email: 'admin@haravska.com',
        password: hashedPassword,
        role: 'admin',
        username: 'Haravska',
      });
      await newAdmin.save();
      console.log('Admin was created');
    }
  } catch (err) {
    console.error('Error connecting to MongoDB Cluster:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;