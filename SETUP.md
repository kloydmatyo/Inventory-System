# Portfolio Projects Tracker - Setup Guide

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
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

## 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Features

### Dashboard
- View overview statistics of your portfolio items
- Use quick action buttons to navigate to different sections

### Projects Management
1. Navigate to the Projects page
2. Click "Add New Project"
3. Fill in project details:
   - Title and description
   - Technologies used (add multiple by typing and pressing Enter)
   - GitHub and demo links (optional)
   - Project status
4. Save and view your project in the list
5. Test editing and deleting projects

### Skills Management
1. Go to the Skills page
2. Add skills with:
   - Skill name (e.g., "React", "Python")
   - Category (e.g., "Frontend Development")
   - Proficiency level (Beginner to Expert)
3. Skills are automatically grouped by category
4. Test the category filter buttons

### Achievements Management
1. Visit the Achievements page
2. Add achievements with:
   - Title and description
   - Date of achievement
   - Type (Award, Certification, etc.)
3. View achievements in chronological order
4. Test the type filter buttons

## 6. Example Data

Here are some example entries to get you started:

### Sample Project
- **Title**: "E-commerce Website"
- **Description**: "Full-stack e-commerce platform with user authentication and payment processing"
- **Technologies**: ["React", "Node.js", "MongoDB", "Stripe"]
- **Status**: "Completed"

### Sample Skill
- **Name**: "React"
- **Category**: "Frontend Development"
- **Proficiency**: "Advanced"

### Sample Achievement
- **Title**: "AWS Certified Developer"
- **Description**: "Achieved AWS Certified Developer - Associate certification"
- **Date**: "2024-01-15"
- **Type**: "Certification"

## 7. Database Collections

The application will automatically create three collections in your MongoDB database:
- `projects` - Stores project information
- `skills` - Stores skill information
- `achievements` - Stores achievement information

## 8. Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Verify your connection string in `.env.local`
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check that your database user has proper permissions

2. **API Errors**
   - Check the browser console for detailed error messages
   - Verify all required fields are filled in forms

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check that all component imports are correct

### Getting Help:
- Check the browser console for error messages
- Verify your MongoDB Atlas setup
- Ensure all environment variables are set correctly

That's it! Your Portfolio Projects Tracker is ready to use. Start building your portfolio by adding your projects, skills, and achievements!