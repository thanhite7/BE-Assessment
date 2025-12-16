# Teacher Student Management API

A Node.js REST API for managing teacher-student relationships with MySQL database.

## Features

- Register students to teachers
- Retrieve common students across multiple teachers
- Suspend students
- Get notification recipients with @mention support
- Comprehensive input validation
- Full test coverage
- Secure coding practices

## Tech Stack

- **Backend**: Node.js, Express.js, JavaScript (ES6+)
- **Database**: MySQL with Prisma ORM
- **Testing**: Jest with Supertest
- **Validation**: Joi
- **Security**: Helmet, CORS

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your system

### Using Docker Compose
1. Clone the repository and navigate to the project directory:
```bash
cd /path/to/CodingAssessment/BE
```

2. Start the application with MySQL database:
```bash
docker-compose up -d
```

This will:
- Build the Node.js application image
- Start MySQL database
- Run database migrations automatically
- Start the API server on port 3000

3. Check if services are running:
```bash
docker-compose ps
```

4. View logs:
```bash
docker-compose logs -f app
```

5. Stop the application:
```bash
docker-compose down
```

### Environment Variables
- `DATABASE_URL`: MySQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### 1. Register Students
Register one or more students to a teacher.

```
POST /api/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "teacher": "teacherken@gmail.com",
  "students": [
    "studentjon@gmail.com",
    "studenthon@gmail.com"
  ]
}
```

**Response:**
- Success: `204 No Content`
- Error: `400 Bad Request` with error message

### 2. Get Common Students
Retrieve students common to all specified teachers.

```
GET /api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com
```

**Response:**
```json
{
  "students": [
    "commonstudent1@gmail.com", 
    "commonstudent2@gmail.com"
  ]
}
```

### 3. Suspend Student
Suspend a student from receiving notifications.

```
POST /api/suspend
Content-Type: application/json
```

**Request Body:**
```json
{
  "student": "studentmary@gmail.com"
}
```

**Response:**
- Success: `204 No Content`
- Error: `404 Not Found` if student doesn't exist

### 4. Get Notification Recipients
Retrieve students who can receive notifications.

```
POST /api/retrievefornotifications
Content-Type: application/json
```

**Request Body:**
```json
{
  "teacher": "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

**Response:**
```json
{
  "recipients": [
    "studentbob@gmail.com",
    "studentagnes@gmail.com", 
    "studentmiche@gmail.com"
  ]
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BE
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Database**
```bash
# Create MySQL database named 'class'
mysql -u root -p -e "CREATE DATABASE class;"

# Or using Docker
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=class -p 3306:3306 -d mysql:8.0
```

4. **Configure Environment Variables**
Copy `.env.example` to `.env` and update database connection:
```bash
DATABASE_URL="mysql://root:root@localhost:3306/class"
PORT=3000
NODE_ENV=development
```

5. **Run Database Migrations**
```bash
npm run db:generate
npm run db:migrate
```

### Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Running Tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio (Database GUI)
npm run db:studio
```

## Project Structure

```
src/
├── app.js                 # Express app setup
├── controllers/           # Route handlers
│   └── teacherController.js
├── middleware/           # Custom middleware
│   ├── errorHandler.js
│   ├── notFoundHandler.js
│   └── validation.js
├── routes/              # API routes
│   └── teacherRoutes.js
├── services/            # Business logic
│   ├── database.js
│   └── teacherService.js
└── __tests__/          # Test files
    ├── setup.js
    └── teacher.test.js
```

## API Design Decisions

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Middleware**: Handle validation, error handling

### 2. **Database Design**
- Many-to-many relationship between teachers and students
- Student suspension is a boolean flag
- Email addresses are used as unique identifiers

### 3. **Error Handling**
- Centralized error handling middleware
- Consistent error response format
- Proper HTTP status codes

### 4. **Validation**
- Input validation using Joi schemas
- Email format validation
- Required field validation
