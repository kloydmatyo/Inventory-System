# Portfolio Projects Tracker

A comprehensive portfolio management system built with Next.js and MongoDB to track your projects, skills, and achievements.

## Features

### Projects Management
- ✅ Add, edit, and delete projects
- ✅ Track project status (Planning, In Progress, Completed, On Hold)
- ✅ Store GitHub and demo links
- ✅ Manage technologies used
- ✅ Search and filter by status/technology

### Skills Management
- ✅ Organize skills by categories
- ✅ Track proficiency levels (Beginner, Intermediate, Advanced, Expert)
- ✅ Visual proficiency indicators
- ✅ Filter by skill categories

### Achievements Management
- ✅ Record awards, certifications, competitions, and more
- ✅ Categorize by achievement type
- ✅ Date tracking with chronological display
- ✅ Rich descriptions and context

### Dashboard
- ✅ Overview of all portfolio items
- ✅ Quick statistics and progress tracking
- ✅ Quick action buttons for adding new items
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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
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
│   │   ├── projects/       # Projects CRUD API
│   │   ├── skills/         # Skills CRUD API
│   │   └── achievements/   # Achievements CRUD API
│   ├── projects/           # Projects page
│   ├── skills/             # Skills page
│   ├── achievements/       # Achievements page
│   ├── globals.css         # Global styles
│   ├── layout.js          # Root layout with navigation
│   └── page.js            # Dashboard page
├── components/
│   ├── Navigation.js       # Main navigation component
│   ├── ProjectForm.js      # Project form component
│   ├── ProjectList.js      # Projects display component
│   ├── SkillForm.js        # Skill form component
│   ├── SkillList.js        # Skills display component
│   ├── AchievementForm.js  # Achievement form component
│   └── AchievementList.js  # Achievements display component
├── lib/
│   └── mongodb.js         # MongoDB connection
└── public/                # Static assets
```

## API Endpoints

### Projects
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Fetch single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Skills
- `GET /api/skills` - Fetch all skills
- `POST /api/skills` - Create new skill
- `GET /api/skills/[id]` - Fetch single skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill

### Achievements
- `GET /api/achievements` - Fetch all achievements
- `POST /api/achievements` - Create new achievement
- `GET /api/achievements/[id]` - Fetch single achievement
- `PUT /api/achievements/[id]` - Update achievement
- `DELETE /api/achievements/[id]` - Delete achievement

## Database Schemas

### Projects
```javascript
{
  _id: ObjectId,
  title: String,              // Required - Project title
  description: String,        // Required - Project description
  technologies: [String],     // Array of technologies used
  githubLink: String,         // Optional - GitHub repository URL
  demoLink: String,          // Optional - Live demo URL
  status: String,            // Required - planning|in-progress|completed|on-hold
  createdAt: Date,
  updatedAt: Date
}
```

### Skills
```javascript
{
  _id: ObjectId,
  name: String,              // Required - Skill name
  category: String,          // Required - Skill category
  proficiencyLevel: String,  // Required - beginner|intermediate|advanced|expert
  createdAt: Date,
  updatedAt: Date
}
```

### Achievements
```javascript
{
  _id: ObjectId,
  title: String,             // Required - Achievement title
  description: String,       // Required - Achievement description
  date: Date,               // Required - Achievement date
  type: String,             // Required - award|certification|competition|etc
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### Adding a Project
1. Navigate to the Projects page
2. Click "Add New Project"
3. Fill in project details including title, description, technologies, and links
4. Set the project status
5. Save the project

### Managing Skills
1. Go to the Skills page
2. Add skills with categories and proficiency levels
3. Skills are automatically grouped by category
4. Use visual proficiency bars to track your progress

### Recording Achievements
1. Visit the Achievements page
2. Add achievements with dates and types
3. Achievements are displayed chronologically
4. Filter by achievement type for easy browsing

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

## Future Enhancements

- User authentication with NextAuth
- Project image uploads
- Skill endorsements
- Achievement certificates
- Export portfolio as PDF
- Public portfolio view
- Analytics and insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License