# Lost & Found Inventory System

A comprehensive web-based lost and found inventory management system built with Next.js and MongoDB Atlas.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration, login, and session management using JWT
- **Item Management**: Full CRUD operations for lost and found items
- **Smart Search**: Text-based search across item names and descriptions
- **Advanced Filtering**: Filter by status, category, location, and date
- **Status Tracking**: Real-time status updates (Lost → Found → Claimed → Returned)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### User Experience
- **Dashboard**: Overview with statistics and recent activity
- **My Items**: Personal item management with edit/delete capabilities
- **All Items**: Browse all system items with pagination
- **Report Item**: Intuitive form to report lost or found items
- **Real-time Updates**: Color-coded status badges for instant recognition

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS, Lucide React (icons)
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-found-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Update the `.env.local` file with your MongoDB Atlas connection:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

4. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Get your connection string and replace the values in the `MONGODB_URI`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Dashboard**: View system statistics and recent items
3. **Report Item**: Use the form to report lost or found items
4. **Browse Items**: Search and filter through all items
5. **My Items**: Manage your reported items
6. **Status Updates**: Update item status as it progresses through the system

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication using JSON Web Tokens
- **HTTP-Only Cookies**: Tokens stored in secure cookies
- **Password Hashing**: bcrypt with salt rounds
- **Route Protection**: Middleware-based protection
- **Input Validation**: Server-side validation with Mongoose schemas

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items (with search/filter)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get specific item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `GET /api/items/my` - Get user's items

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── report/             # Report item page
│   ├── items/              # All items page
│   ├── my-items/           # User's items page
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
├── contexts/              # React contexts
└── lib/                   # Utilities and models
    ├── models/            # Mongoose models
    ├── mongodb.ts         # Database connection
    └── auth.ts            # Authentication utilities
```

## 🎨 UI Components

- **StatusBadge**: Color-coded status indicators
- **ItemCard**: Item display with actions
- **ItemForm**: Form for creating/editing items
- **SearchFilters**: Search and filtering interface
- **Navbar**: Responsive navigation
- **LoadingSpinner**: Loading state indicator

## 🚀 Deployment

The application is ready to deploy on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is accessible
3. Update the `NEXTAUTH_URL` to your domain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
