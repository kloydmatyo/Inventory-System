import mongoose from 'mongoose';

export interface IItem extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  location: string;
  status: 'lost' | 'found' | 'claimed' | 'returned';
  reportedBy: mongoose.Types.ObjectId;
  claimedBy?: mongoose.Types.ObjectId;
  reportedDate: Date;
  foundDate?: Date;
  claimedDate?: Date;
  returnedDate?: Date;
  contactInfo?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Accessories',
        'Books',
        'Keys',
        'Bags',
        'Jewelry',
        'Documents',
        'Sports Equipment',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['lost', 'found', 'claimed', 'returned'],
      default: 'lost',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    foundDate: {
      type: Date,
    },
    claimedDate: {
      type: Date,
    },
    returnedDate: {
      type: Date,
    },
    contactInfo: {
      type: String,
      trim: true,
      maxlength: [200, 'Contact info cannot exceed 200 characters'],
    },
    images: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ reportedBy: 1 });
itemSchema.index({ reportedDate: -1 });

export default mongoose.models.Item || mongoose.model<IItem>('Item', itemSchema);