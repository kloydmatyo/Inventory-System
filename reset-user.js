const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://202311563_db_user:fQTwdEYRyfxxQyGs@inventorysystem.6dk0bpr.mongodb.net/lost-found-db';

// User schema (simplified for script)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

async function resetTestUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Deleted existing test user');

    // Create new test user
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123', // This will be hashed automatically
      name: 'Test User',
      role: 'user'
    });

    await testUser.save();
    console.log('Created new test user:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

    // Verify the user was created and test password
    const savedUser = await User.findOne({ email: 'test@example.com' });
    const isPasswordValid = await savedUser.comparePassword('password123');
    
    console.log('User verification:');
    console.log('User found:', !!savedUser);
    console.log('Password test:', isPasswordValid);

    await mongoose.disconnect();
    console.log('Script completed successfully!');

  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

resetTestUser();