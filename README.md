# 🦞 LobbyLobster

A modern, cost-effective hotel administration software built to replace expensive legacy PMS (Property Management System) solutions.

## 🎯 Project Goal

Develop a user-friendly hotel management system that provides essential features at a fraction of the cost of commercial alternatives, specifically tailored for small to medium-sized hotels.

## ✨ Features (Planned)

### Phase 1 - MVP (Current Focus)
- **Visual Calendar View**: Excel-like interface showing rooms (vertical) × days (horizontal)
- **Availability Tracking**: Real-time room availability status
- **Room Reservations**: Simple booking interface
- **Database Backend**: Persistent storage for reservations and room data

### Future Phases
- Guest management (contact info, preferences)
- Check-in/Check-out workflows
- Pricing management (seasonal rates, discounts)
- Invoice generation
- Reporting & analytics
- Multi-user support with roles
- Housekeeping status tracking
- Channel manager integration (booking.com, etc.)

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library

### Backend
- **[Python 3.11+](https://www.python.org/)** - Backend language
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern, fast web framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - SQL toolkit and ORM
- **[Pydantic](https://docs.pydantic.dev/)** - Data validation

### Database
- **SQLite** (development) → **PostgreSQL** (production)

### Why This Stack?
- 🚀 **Fast Development**: Hot reload, type safety, modern tooling
- 🎨 **Beautiful UI**: Professional components out of the box
- 🐍 **Python Backend**: Familiar, powerful, great ecosystem
- 📊 **Type-Safe**: TypeScript frontend + Pydantic backend
- 🔧 **Easy Deployment**: Vercel (frontend) + any Python host (backend)
- 💰 **Cost-Effective**: Open source, minimal hosting costs
- 📈 **Scalable**: Can grow with the business

## 🎨 Design System

### Color Palette
- 🦞 **Lobster Red** (`#E63946`) - Primary color, CTAs, highlights
- 🌊 **Deep Slate** (`#1D3557`) - Headers, text, professional elements
- 🤍 **Soft Cream** (`#F1FAEE`) - Backgrounds, cards, breathing room
- **Accent colors**: Success (green), Warning (amber), Error (red-dark)

### Design Principles
- **Clean & Modern**: Minimal clutter, purposeful whitespace
- **Color-Coded Status**: Visual at-a-glance understanding
- **Responsive**: Desktop-first, mobile-friendly
- **Fast Feedback**: Instant updates, smooth transitions

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm/yarn/pnpm
- **Python 3.11+** and pip
- **Git**

### Installation

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Run development server
uvicorn main:app --reload
```

Backend API runs on [http://localhost:8000](http://localhost:8000)
API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure

```
LobbyLobster/
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── calendar/    # Calendar grid components
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
│
├── backend/              # Python FastAPI backend
│   ├── main.py          # FastAPI app entry point
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── routes/          # API route handlers
│   ├── database.py      # Database connection
│   └── init_db.py       # Database initialization
│
└── docs/                # Documentation
```

## 🗄️ Database Schema (Initial)

```python
# Room model
- id: UUID (primary key)
- number: String (unique)
- name: String
- type: Enum (SINGLE, DOUBLE, SUITE, FAMILY)
- capacity: Integer
- created_at: DateTime
- updated_at: DateTime

# Reservation model
- id: UUID (primary key)
- room_id: UUID (foreign key)
- guest_name: String
- check_in: Date
- check_out: Date
- status: Enum (CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
- created_at: DateTime
- updated_at: DateTime
```

## 📝 Development Workflow

### Branch Naming Convention
```
raccoon-feature-<descriptive-name>
```

### Commit Message Convention (Conventional Commits)
```
<type>(<scope>): <subject>

feat(calendar): add drag-and-drop reservation
fix(api): resolve double-booking race condition
docs(readme): update installation steps
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🤝 Contributing

This is a private project developed for a specific hotel. Contributions are managed by the project owner (JP) and Raccoony (AI assistant).

## 📄 License

Private - All rights reserved

## 🎯 Roadmap

- [x] **Week 1**: Project setup, tech stack decision, documentation
- [ ] **Week 2**: Frontend scaffold, color system, first view
- [ ] **Week 3**: Backend API, database models
- [ ] **Week 4**: Calendar UI component
- [ ] **Week 5-6**: Reservation CRUD operations
- [ ] **Week 7-8**: Polish, testing, first deployment

## 📞 Support

For questions or issues, contact JP.

---

**Built with 🦝 by Raccoony & JP**
