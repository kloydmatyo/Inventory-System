# Simple Inventory Management System

A comprehensive inventory management system built with Next.js and MongoDB to track products, suppliers, and stock levels.

## Features

### Products Management
- ✅ Add, edit, and delete products
- ✅ Track stock quantities and pricing
- ✅ Categorize products for better organization
- ✅ Link products to suppliers
- ✅ Search and filter by category, stock level
- ✅ Low stock alerts and inventory value tracking

### Suppliers Management
- ✅ Manage supplier contact information
- ✅ Company details and addresses
- ✅ Email and phone contact management
- ✅ Prevent deletion of suppliers with active products
- ✅ Search functionality

### Dashboard & Analytics
- ✅ Overview of total products and suppliers
- ✅ Low stock item alerts
- ✅ Total inventory value calculation
- ✅ Quick action buttons for common tasks
- ✅ Responsive design for all devices

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── products/        # Products CRUD API
│   │   └── suppliers/       # Suppliers CRUD API
│   ├── products/            # Products management page
│   ├── suppliers/           # Suppliers management page
│   ├── globals.css          # Global styles
│   ├── layout.js           # Root layout with navigation
│   └── page.js             # Dashboard page
├── components/
│   ├── Navigation.js        # Main navigation component
│   ├── ProductForm.js       # Product form component
│   ├── ProductList.js       # Products display component
│   ├── SupplierForm.js      # Supplier form component
│   └── SupplierList.js      # Suppliers display component
├── lib/
│   └── mongodb.js          # MongoDB connection
└── public/                 # Static assets
```

## API Endpoints

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Fetch single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Suppliers
- `GET /api/suppliers` - Fetch all suppliers
- `POST /api/suppliers` - Create new supplier
- `GET /api/suppliers/[id]` - Fetch single supplier
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Delete supplier

## Database Schemas

### Products
```javascript
{
  _id: ObjectId,
  name: String,              // Required - Product name
  description: String,       // Optional - Product description
  category: String,          // Required - Product category
  price: Number,            // Required - Product price
  stockQuantity: Number,    // Required - Current stock quantity
  supplierId: String,       // Required - Reference to supplier
  createdAt: Date,
  updatedAt: Date
}
```

### Suppliers
```javascript
{
  _id: ObjectId,
  name: String,             // Required - Contact person name
  company: String,          // Required - Company name
  email: String,            // Required - Email address (unique)
  phone: String,            // Optional - Phone number
  address: String,          // Optional - Company address
  createdAt: Date,
  updatedAt: Date
}
```

## Sample CRUD Flow

### 1. Add a Supplier
1. Navigate to `/suppliers`
2. Click "Add New Supplier"
3. Fill in supplier details (name, company, email, phone, address)
4. Save the supplier

### 2. Add a Product
1. Navigate to `/products`
2. Click "Add New Product"
3. Fill in product details:
   - Name and description
   - Category (with autocomplete suggestions)
   - Price and stock quantity
   - Select the supplier from dropdown
4. Save the product

### 3. Update Stock
1. Go to Products page
2. Click "Edit" on any product
3. Update the stock quantity
4. Save changes

### 4. Delete Product
1. Find the product in the list
2. Click "Delete" button
3. Confirm deletion
4. Product is removed from inventory

### 5. View Low Stock Items
1. Use the dashboard "Low Stock Items" card
2. Or filter products by "Low Stock" in the products page
3. Items with quantity < 10 are flagged as low stock

## Key Features Explained

### Stock Level Management
- **In Stock**: Items with quantity > 0
- **Low Stock**: Items with quantity < 10 (configurable)
- **Out of Stock**: Items with quantity = 0
- Visual indicators and filtering options

### Supplier Integration
- Products must be linked to a supplier
- Suppliers cannot be deleted if they have associated products
- Supplier information is displayed with products

### Search and Filtering
- Search products by name or description
- Filter by category and stock level
- Real-time filtering with result counts

### Data Validation
- Required field validation
- Email uniqueness for suppliers
- Supplier existence validation for products
- Numeric validation for prices and quantities

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

## Future Enhancements

- Stock movement tracking (in/out transactions)
- Barcode scanning integration
- CSV/Excel export functionality
- User authentication and role-based access
- Purchase order management
- Automated reorder points
- Supplier performance analytics
- Multi-location inventory support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License