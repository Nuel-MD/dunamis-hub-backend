# Dunamis Faith Hub Backend

Backend API for the Dunamis Faith Hub platform, providing content management and user authentication services.

## Features

- User authentication and authorization
- Resource management (sermons, worship, books, movies)
- Category management
- Admin dashboard functionality
- API documentation with Swagger
- Rate limiting and security features
- MongoDB integration with pagination

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd dunamis-faith-hub-be
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Environment Setup:
   Copy `.env.example` to `.env` and update with your values:
   \`\`\`
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dunamis
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   FRONTEND_URL=http://localhost:3000
   \`\`\`

4. Database Setup:
   - Ensure MongoDB is running
   - Run database seeds:
     \`\`\`bash
     npm run seed
     \`\`\`

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

## Production Build

Build the application:
\`\`\`bash
npm run build
npm start
\`\`\`

## Docker Deployment

1. Build and run with Docker Compose:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

## API Documentation

Access the Swagger documentation at:
\`http://localhost:5000/api-docs\`

### Main Endpoints

#### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user profile

#### Resources

- GET /api/resources - List all resources
- GET /api/resources/:id - Get resource by ID
- POST /api/resources - Create new resource (Admin)
- PUT /api/resources/:id - Update resource (Admin)
- DELETE /api/resources/:id - Delete resource (Admin)
- GET /api/resources/featured - Get featured resources
- GET /api/resources/category/:category - Get resources by category
- GET /api/resources/search - Search resources

#### Categories

- GET /api/categories - List all categories
- GET /api/categories/:id - Get category by ID
- POST /api/categories - Create new category (Admin)
- PUT /api/categories/:id - Update category (Admin)
- DELETE /api/categories/:id - Delete category (Admin)

#### Users (Admin Only)

- GET /api/users - List all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Error Handling

The API uses standard HTTP response codes:

- 2xx for successful operations
- 4xx for client errors
- 5xx for server errors

Detailed error messages are included in the response body.

## Security Features

- JWT authentication
- Password hashing
- Rate limiting
- CORS protection
- Security headers (Helmet)
- Input validation
- MongoDB injection protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
# dunamis-hub-backend
