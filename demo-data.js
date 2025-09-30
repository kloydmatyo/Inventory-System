// Demo Data Seeder
// This script creates sample users and items for testing purposes
// Run this after setting up your MongoDB connection

export const demoUsers = [
  {
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user'
  },
  {
    email: 'jane@example.com', 
    password: 'password123',
    name: 'Jane Smith',
    role: 'user'
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

export const demoItems = [
  {
    name: 'Black iPhone 13',
    description: 'Black iPhone 13 with a cracked screen protector. Has a blue case.',
    category: 'Electronics',
    location: 'Library 2nd Floor',
    status: 'lost',
    contactInfo: 'Please call if found: (555) 123-4567'
  },
  {
    name: 'Blue Backpack',
    description: 'Navy blue Jansport backpack with laptop compartment. Contains some textbooks.',
    category: 'Bags',
    location: 'Student Center Cafeteria',
    status: 'found',
    contactInfo: 'Contact security desk'
  },
  {
    name: 'Silver MacBook Pro',
    description: '13-inch MacBook Pro 2020, silver color. Has stickers on the lid.',
    category: 'Electronics',
    location: 'Computer Lab Room 205',
    status: 'found',
    contactInfo: 'Turned in to IT department'
  },
  {
    name: 'Car Keys (Toyota)',
    description: 'Toyota car keys with black key fob and a small teddy bear keychain.',
    category: 'Keys',
    location: 'Parking Lot B',
    status: 'lost',
    contactInfo: 'Urgent! Please email: keys@email.com'
  },
  {
    name: 'Red Umbrella',
    description: 'Compact red umbrella, automatic open/close. Small tear near handle.',
    category: 'Other',
    location: 'Main Entrance',
    status: 'claimed',
    contactInfo: ''
  }
];

// Usage instructions:
// 1. Start your development server
// 2. Register these demo users manually through the UI
// 3. Login with each user and create some items
// 4. Test the search, filter, and status update functionality

console.log('Demo data ready to use!');
console.log('Demo users:', demoUsers.map(u => ({ email: u.email, password: u.password })));