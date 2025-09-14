# Inventory Management MVP

A full-stack inventory management system built with Next.js and MongoDB Atlas.

## Features

- ✅ Add new inventory items with name, description, and quantity
- ✅ View all items in a clean, responsive interface
- ✅ Edit existing items inline
- ✅ Delete items with confirmation
- ✅ Real-time updates without page refresh
- ✅ Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (React) with App Router
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-db?retryWrites=true&w=majority
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

- `GET /api/items` - Fetch all items
- `POST /api/items` - Create a new item
- `GET /api/items/[id]` - Fetch a single item
- `PUT /api/items/[id]` - Update an item
- `DELETE /api/items/[id]` - Delete an item

## Database Schema

Each inventory item has the following structure:

```javascript
{
  _id: ObjectId,           // Auto-generated unique identifier
  name: String,            // Required - Item name
  description: String,     // Optional - Item description
  quantity: Number,        // Required - Item quantity
  createdAt: Date,         // Auto-generated creation timestamp
  updatedAt: Date          // Auto-generated update timestamp
}
```

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

## Future Enhancements

- User authentication
- Item categories
- Search and filtering
- Bulk operations
- Export functionality
- Low stock alerts