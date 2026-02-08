# LobbyLobster Backend

Python FastAPI backend for the LobbyLobster hotel management system.

## Setup

### Prerequisites
- Python 3.11+
- pip

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
```

### Running the Server

```bash
# Development mode (with hot reload)
uvicorn main:app --reload

# Or using the script
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive docs (Swagger)**: http://localhost:8000/docs
- **Alternative docs (ReDoc)**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── database.py          # Database configuration
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic validation schemas
├── routes/              # API route handlers
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (not in git)
```

## API Endpoints

### Core
- `GET /` - API root
- `GET /health` - Health check

### Coming Soon
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a room
- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create a reservation

## Database

Currently using **SQLite** for development (file: `lobbylobster.db`).

For production, switch to **PostgreSQL** by updating `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost/lobbylobster
```

## Development

### Adding a New Model

1. Create model in `models/your_model.py`
2. Import in `models/__init__.py`
3. Create Pydantic schema in `schemas/your_model.py`
4. Create routes in `routes/your_model.py`
5. Register routes in `main.py`

### Running Tests

```bash
pytest
```

(Tests will be added as development progresses)

## Technologies

- **FastAPI**: Modern async web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
