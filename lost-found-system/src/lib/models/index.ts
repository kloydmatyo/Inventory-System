import mongoose from 'mongoose';
import User from '@/lib/models/User';
import Item from '@/lib/models/Item';

/**
 * Initialize all database models
 * This ensures all schemas are registered with Mongoose
 */
export function initializeModels() {
  try {
    // Force model registration by accessing the models
    if (!mongoose.models.User) {
      User; // This triggers the model registration
    }
    if (!mongoose.models.Item) {
      Item; // This triggers the model registration
    }
    
    console.log('✅ Models initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing models:', error);
  }
}

export { User, Item };