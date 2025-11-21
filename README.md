# Second Brain App

A full-stack web application for storing and organizing YouTube and X.com (Twitter) links in embedded form. Users can create accounts, manage their embedded content, and generate shareable links to their collection for others to view.

## Features

- **User Authentication**: Secure signup and signin with JWT-based authentication and password hashing.
- **Content Management**: Create, read, update, and delete personal content (links, notes, etc.).
- **Content Types**: Support for different content types (e.g., links, videos, articles).
- **Sharable Brains**: Generate unique shareable links to share your entire content collection with others.
- **Responsive UI**: Modern, responsive frontend built with React and Tailwind CSS.
- **RESTful API**: Well-structured backend API with proper validation and error handling.

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for data storage
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls


## API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User login

### Content Management (Requires Authentication)
- `POST /api/v1/content` - Create new content
- `GET /api/v1/content` - Get user's content
- `DELETE /api/v1/content/:id` - Delete specific content

### Sharing
- `POST /api/v1/brain/share` - Generate or remove shareable link
- `GET /api/v1/brain/:shareLink` - Access shared brain content

### Health Check
- `GET /` - Server status

## Project Structure

```
second-brain-app/
├── backend/
│   ├── src/
│   │   ├── db.ts          # Database models and schemas
│   │   ├── index.ts       # Main server file with routes
│   │   ├── middleware.ts  # Authentication middleware
│   │   └── utils.ts       # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (SignIn, SignUp, Dashboard)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── icons/         # Icon components
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── vite.config.ts
├── package-lock.json
└── README.md
```
