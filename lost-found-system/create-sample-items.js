const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://202311563_db_user:fQTwdEYRyfxxQyGs@inventorysystem.6dk0bpr.mongodb.net/lost-found-db';

// Simple schemas for this script
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  location: String,
  status: {
    type: String,
    enum: ['lost', 'found', 'claimed', 'returned'],
    default: 'lost',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reportedDate: { type: Date, default: Date.now },
  foundDate: Date,
  claimedDate: Date,
  returnedDate: Date,
  contactInfo: String,
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

async function createSampleItems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use the existing test user ID
    const userId = new mongoose.Types.ObjectId('68db76071bedf99a5c632831');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Create sample items
    const sampleItems = [
      {
        name: 'Red Backpack',
        description: 'Red Nike backpack with laptop compartment, found near library entrance',
        category: 'Bags',
        location: 'Main Library',
        status: 'found',
        reportedBy: userId,
        reportedDate: new Date('2024-01-15'),
        foundDate: new Date('2024-01-15'),
      },
      {
        name: 'iPhone 14 Pro',
        description: 'Black iPhone 14 Pro in blue protective case, lost in cafeteria during lunch',
        category: 'Electronics',
        location: 'Student Cafeteria',
        status: 'lost',
        reportedBy: userId,
        reportedDate: new Date('2024-01-20'),
      },
      {
        name: 'Car Keys - Toyota',
        description: 'Toyota car keys with blue keychain and house keys, found in parking lot',
        category: 'Keys',
        location: 'Parking Lot A',
        status: 'claimed',
        reportedBy: userId,
        reportedDate: new Date('2024-01-10'),
        foundDate: new Date('2024-01-10'),
        claimedDate: new Date('2024-01-12'),
      },
      {
        name: 'Biology Textbook',
        description: 'Campbell Biology textbook, 12th edition, has student notes in margins',
        category: 'Books',
        location: 'Science Building Room 201',
        status: 'returned',
        reportedBy: userId,
        reportedDate: new Date('2024-01-05'),
        foundDate: new Date('2024-01-05'),
        claimedDate: new Date('2024-01-07'),
        returnedDate: new Date('2024-01-08'),
      },
      {
        name: 'Prescription Glasses',
        description: 'Black frame prescription glasses in brown leather case',
        category: 'Accessories',
        location: 'Library Study Room 3',
        status: 'found',
        reportedBy: userId,
        reportedDate: new Date('2024-01-25'),
        foundDate: new Date('2024-01-25'),
      },
      {
        name: 'Water Bottle',
        description: 'Stainless steel water bottle with university logo sticker',
        category: 'Other',
        location: 'Gym',
        status: 'lost',
        reportedBy: userId,
        reportedDate: new Date('2024-01-28'),
      },
      {
        name: 'Bluetooth Headphones',
        description: 'Sony WH-1000XM4 wireless headphones in carrying case',
        category: 'Electronics',
        location: 'Computer Lab B',
        status: 'found',
        reportedBy: userId,
        reportedDate: new Date('2024-01-30'),
        foundDate: new Date('2024-01-30'),
      },
      {
        name: 'Student ID Card',
        description: 'University student ID card, name partially visible',
        category: 'Documents',
        location: 'Dining Hall',
        status: 'claimed',
        reportedBy: userId,
        reportedDate: new Date('2024-02-01'),
        foundDate: new Date('2024-02-01'),
        claimedDate: new Date('2024-02-02'),
      },
    ];

    const createdItems = await Item.insertMany(sampleItems);
    console.log(`✅ Created ${createdItems.length} sample items`);

    // Display stats
    const stats = {
      total: await Item.countDocuments({}),
      lost: await Item.countDocuments({ status: 'lost' }),
      found: await Item.countDocuments({ status: 'found' }),
      claimed: await Item.countDocuments({ status: 'claimed' }),
      returned: await Item.countDocuments({ status: 'returned' }),
    };

    console.log('\n📊 Database Statistics:');
    console.log(`Total Items: ${stats.total}`);
    console.log(`Lost: ${stats.lost}`);
    console.log(`Found: ${stats.found}`);
    console.log(`Claimed: ${stats.claimed}`);
    console.log(`Returned: ${stats.returned}`);

    console.log('\n🎉 Sample data created successfully!');
    console.log('\nLogin with: test@example.com / password123');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createSampleItems();