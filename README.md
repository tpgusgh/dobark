# Gambling Platform with FastAPI Backend

A full-stack gambling platform with React frontend and FastAPI backend, featuring user authentication, snail racing game, and inquiry management system.

## Features

### Frontend (React + TypeScript)
- User authentication (login/register)
- Snail racing game with betting system
- User dashboard with balance tracking
- CRUD inquiry board for user support
- Responsive design with dark theme

### Backend (FastAPI + PostgreSQL)
- JWT-based authentication
- RESTful API endpoints
- PostgreSQL database with SQLAlchemy ORM
- Docker containerization
- Database migrations with Alembic

## Quick Start

### Using Docker (Recommended)

1. **Start the services:**
   ```bash
   docker-compose up -d
   ```

2. **The services will be available at:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - PostgreSQL: localhost:5432

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start PostgreSQL database:**
   ```bash
   docker run -d \
     --name gambling_postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=gambling_db \
     -p 5432:5432 \
     postgres:15
   ```

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the backend server:**
   ```bash
   python run.py
   ```

#### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

### Games
- `POST /api/v1/games/play` - Play snail race game
- `GET /api/v1/games/history` - Get game history

### Inquiries
- `GET /api/v1/inquiries/` - Get user inquiries
- `POST /api/v1/inquiries/` - Create new inquiry
- `GET /api/v1/inquiries/{id}` - Get specific inquiry
- `PUT /api/v1/inquiries/{id}` - Update inquiry
- `DELETE /api/v1/inquiries/{id}` - Delete inquiry

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `hashed_password`
- `balance` (Default: 10000.0)
- `is_active` (Default: True)
- `created_at`, `updated_at`

### Game Results Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `game_type` (Default: "snail-race")
- `bet_amount`
- `selected_snail` (1 or 2)
- `winner_snail` (1 or 2)
- `win_amount`
- `is_win` (Boolean)
- `created_at`

### Inquiries Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `title`
- `content`
- `status` (open/answered/closed)
- `response` (Optional)
- `created_at`, `updated_at`

## Development

### Adding New Features

1. **Backend:**
   - Add new models in `app/models/`
   - Create schemas in `app/schemas/`
   - Add API routes in `app/api/routes/`
   - Update database with Alembic migrations

2. **Frontend:**
   - Add new components in `src/components/`
   - Update types in `src/types/`
   - Add API calls and state management

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention with SQLAlchemy ORM
- Input validation with Pydantic

## Production Deployment

1. **Environment Variables:**
   - Set strong `SECRET_KEY`
   - Configure production database URL
   - Set appropriate CORS origins

2. **Database:**
   - Use managed PostgreSQL service
   - Set up database backups
   - Configure connection pooling

3. **Security:**
   - Enable HTTPS
   - Set up rate limiting
   - Configure proper CORS settings
   - Use environment-specific secrets

## Disclaimer

This is a demonstration platform for educational purposes only. All currency is virtual and has no real-world value. Please gamble responsibly and be aware of the risks associated with real gambling.