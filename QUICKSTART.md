# 🚀 LobbyLobster Quick Start Guide

Welcome! Here's how to get LobbyLobster running on your machine.

## 📦 Prerequisites

- **Node.js 18+** ([download](https://nodejs.org/))
- **Python 3.11+** ([download](https://www.python.org/))
- **Git** ([download](https://git-scm.com/))

## 🎯 First Time Setup

### 1. Clone the Repository

```bash
git clone git@github.com:phil-fill/LobbyLobster.git
cd LobbyLobster
```

### 2. Choose Your Branch

```bash
# To see the initial implementation with the color scheme:
git checkout raccoon-feature-initial-setup

# Or stay on main for the stable version
```

## 🎨 Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (this takes a minute)
npm install

# Run the development server
npm run dev
```

✅ **Frontend is now running!**  
Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the LobbyLobster landing page with:
- 🦞 Lobster red header
- Hero section with feature cards
- Modern, clean design

### Frontend Commands

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐍 Backend Setup (Python + FastAPI)

Open a **new terminal window** (keep the frontend running).

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run the server
python main.py
```

✅ **Backend is now running!**  
- API: [http://localhost:8000](http://localhost:8000)
- Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Backend Commands

```bash
# Run with hot reload
uvicorn main:app --reload

# Or use the main script
python main.py

# Deactivate virtual environment when done
deactivate
```

## 🎨 Color Palette Reference

When styling components, use these colors:

- **Lobster Red** `#E63946` - Primary actions, highlights
- **Deep Slate** `#1D3557` - Text, headers
- **Soft Cream** `#F1FAEE` - Backgrounds
- **Accent Blue** `#457B9D` - Supporting elements

In Tailwind CSS:
```tsx
className="bg-[#E63946]"    // Lobster red
className="text-[#1D3557]"  // Deep slate
className="bg-[#F1FAEE]"    // Soft cream
```

Or use the custom tokens:
```tsx
className="bg-lobster-red"
className="text-deep-slate"
className="bg-soft-cream"
```

## 🗂️ Project Structure

```
LobbyLobster/
├── frontend/          # Next.js app
│   ├── app/          # Pages and routes
│   ├── components/   # React components
│   └── ...
├── backend/          # FastAPI app
│   ├── main.py      # Entry point
│   ├── models/      # Database models
│   ├── routes/      # API endpoints
│   └── ...
└── docs/            # Documentation
```

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b raccoon-feature-your-feature-name
   ```

2. **Make your changes**
   - Frontend: Edit files in `frontend/`
   - Backend: Edit files in `backend/`

3. **Test locally**
   - Frontend auto-reloads on save
   - Backend auto-reloads with `--reload` flag

4. **Commit & push**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push -u origin raccoon-feature-your-feature-name
   ```

5. **Create a Pull Request on GitHub**

## 🐛 Troubleshooting

### Frontend won't start
- Make sure you ran `npm install` first
- Check if port 3000 is already in use
- Try `rm -rf node_modules && npm install`

### Backend won't start
- Make sure virtual environment is activated
- Check if port 8000 is already in use
- Verify Python version: `python --version` (should be 3.11+)

### "Module not found" errors
- Frontend: `cd frontend && npm install`
- Backend: `pip install -r requirements.txt`

## 📚 Next Steps

- [ ] Review the landing page
- [ ] Explore FastAPI docs at `/docs`
- [ ] Start building the calendar component
- [ ] Add Room and Reservation models

## 💡 Helpful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

**Questions?** Ask JP or Raccoony! 🦝
