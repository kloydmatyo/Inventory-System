# Simple Inventory Management System - Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier is fine)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Give it read/write access to any database
4. Get your connection string:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string

## 3. Environment Variables
1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and replace with your actual MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
   ```

## 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Complete CRUD Flow

### Step 1: Add Your First Supplier
1. Navigate to the Suppliers page (`/suppliers`)
2. Click "Add New Supplier"
3. Fill in the form:
   - **Contact Name**: "John Smith"
   - **Company**: "Tech Supplies Inc."
   - **Email**: "john@techsupplies.com"
   - **Phone**: "+1-555-0123"
   - **Address**: "123 Business St, Tech City, TC 12345"
4. Click "Add Supplier"
5. Verify the supplier appears in the list

### Step 2: Add Products to Your Inventory
1. Navigate to the Products page (`/products`)
2. Click "Add New Product"
3. Fill in the form:
   - **Product Name**: "Wireless Mouse"
   - **Category**: "Electronics" (use autocomplete)
   - **Description**: "Ergonomic wireless mouse with USB receiver"
   - **Price**: "29.99"
   - **Stock Quantity**: "50"
   - **Supplier**: Select "John Smith - Tech Supplies Inc."
4. Click "Add Product"
5. Add a few more products with different stock levels:
   - Low stock item (quantity < 10)
   - Out of stock item (quantity = 0)

### Step 3: Test Dashboard Features
1. Go back to the Dashboard (`/`)
2. Verify the statistics are updated:
   - Total Products count
   - Suppliers count
   - Low Stock Items count
   - Inventory Value calculation
3. Click on the "Low Stock Items" card to filter products

### Step 4: Test Search and Filtering
1. Go to Products page
2. Use the search box to find products by name
3. Test category filtering
4. Test stock level filtering (All, In Stock, Low Stock, Out of Stock)

### Step 5: Test Edit Functionality
1. Click "Edit" on any product
2. Update the stock quantity
3. Change the price
4. Save changes and verify updates

### Step 6: Test Delete with Validation
1. Try to delete a supplier that has products:
   - Go to Suppliers page
   - Click "Delete" on the supplier you created
   - Should show error message about associated products
2. Delete a product:
   - Go to Products page
   - Click "Delete" on any product
   - Confirm deletion
   - Verify product is removed

### Step 7: Test Data Validation
1. Try to add a product without selecting a supplier
2. Try to add a supplier with an existing email
3. Try to enter negative prices or quantities
4. Verify validation messages appear

## 6. Sample Data for Testing

Here's some sample data you can use to populate your system:

### Suppliers
```
1. Name: "Sarah Johnson", Company: "Office Depot Pro", Email: "sarah@officedepot.com"
2. Name: "Mike Chen", Company: "Electronics Wholesale", Email: "mike@elecwholesale.com"
3. Name: "Lisa Rodriguez", Company: "Home & Garden Supply", Email: "lisa@homegardens.com"
```

### Products
```
Electronics:
- Wireless Keyboard - $45.99 - Stock: 25
- USB Cable - $12.99 - Stock: 8 (Low Stock)
- Monitor Stand - $89.99 - Stock: 0 (Out of Stock)

Office Supplies:
- Printer Paper - $24.99 - Stock: 100
- Stapler - $15.99 - Stock: 5 (Low Stock)
- Desk Organizer - $32.99 - Stock: 15

Home & Garden:
- Plant Pot - $18.99 - Stock: 30
- Garden Hose - $45.99 - Stock: 3 (Low Stock)
- Fertilizer - $22.99 - Stock: 20
```

## 7. Database Collections

The application will automatically create two collections in your MongoDB database:
- `products` - Stores product information with supplier references
- `suppliers` - Stores supplier contact and company information

## 8. Understanding the System

### Key Relationships
- Each product MUST have a supplier
- Suppliers cannot be deleted if they have associated products
- Stock levels are automatically categorized (In Stock, Low Stock, Out of Stock)

### Business Rules
- Low stock threshold is set to 10 items
- Supplier emails must be unique
- All monetary values are stored as numbers with 2 decimal precision
- Products are sorted by creation date (newest first)
- Suppliers are sorted alphabetically by company name

## 9. Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Verify your connection string in `.env.local`
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check that your database user has proper permissions

2. **"No suppliers available" Error**
   - You must add at least one supplier before adding products
   - Navigate to `/suppliers` and add a supplier first

3. **Cannot Delete Supplier**
   - This is expected behavior if the supplier has associated products
   - Delete all products for that supplier first, then delete the supplier

4. **Search Not Working**
   - Search is case-insensitive and searches both name and description
   - Try partial matches or check spelling

5. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check that all component imports are correct

### Getting Help:
- Check the browser console for error messages
- Verify your MongoDB Atlas setup
- Ensure all environment variables are set correctly
- Make sure you're following the correct order: Suppliers → Products

## 10. Next Steps

Once you have the basic system running:

1. **Customize Categories**: Add your own product categories in `ProductForm.js`
2. **Adjust Stock Thresholds**: Modify the low stock threshold in the dashboard logic
3. **Add More Suppliers**: Build a comprehensive supplier database
4. **Import Data**: Use the MongoDB Atlas interface to import bulk data if needed
5. **Deploy**: Follow the deployment instructions in README.md

That's it! Your Simple Inventory Management System is ready to use. Start by adding suppliers, then products, and explore all the features!