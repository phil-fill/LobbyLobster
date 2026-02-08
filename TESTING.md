# 🧪 LobbyLobster Testing Guide

Quick guide to test all features of LobbyLobster.

## Prerequisites

Make sure you have both frontend and backend running:

### Terminal 1: Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on: http://localhost:8000

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## 🌱 Seeding Test Data

To populate the database with sample rooms and reservations:

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python seed_data.py
```

This creates:
- **8 rooms** (singles, doubles, suites, family room)
- **6 reservations** (mix of confirmed, checked-in, future bookings)

You can re-run the seed script anytime to reset test data (it will ask for confirmation).

## 🧭 What to Test

### 1. Landing Page
- Visit: http://localhost:3000
- Check: Lobster red header, hero section, feature cards
- Click: "Open Dashboard" button → should go to calendar

### 2. API Documentation
- Visit: http://localhost:8000/docs
- Explore: Interactive API docs (Swagger UI)
- Try: GET /api/rooms (should return 8 rooms if seeded)
- Try: GET /api/reservations (should return 6 reservations)

### 3. Calendar Dashboard
- Visit: http://localhost:3000/dashboard
- Check: Calendar grid with rooms (vertical) × dates (horizontal)
- See: Colored reservation blocks:
  - 🔴 Red = Confirmed
  - 🔵 Blue = Checked In
  - ⚪ Gray = Checked Out

### 4. Creating a Reservation
- Click: Any **empty cell** (shows "+")
- Fill in: Guest name (required), email, phone, dates, notes
- Click: "Create Reservation"
- Result: New reservation appears on calendar
- Try: Create overlapping reservation → should show error

### 5. Calendar Navigation
- Click: "Previous" / "Next" buttons → shifts date range
- Click: "Today" → jumps to current date
- Change: "Days to show" dropdown (7/14/21/30 days)
- Check: Calendar adjusts accordingly

### 6. Double-Booking Prevention
- Try to create a reservation that overlaps with an existing one
- Expected: Error message "Room X is not available for the selected dates"

### 7. Responsive Design
- Resize browser window
- Check: Calendar scrolls horizontally if needed
- Check: Room column stays fixed (sticky) on the left

## 🐛 Common Issues

### Backend won't start
```bash
# Make sure you're in the venv
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Calendar is empty
```bash
# Seed the database
cd backend
python seed_data.py
```

### CORS errors in browser console
- Make sure backend is running on port 8000
- Check that frontend is on port 3000
- Restart both servers

## 📊 API Testing (Manual)

### Create a Room
```bash
curl -X POST http://localhost:8000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "number": "501",
    "name": "Penthouse Suite",
    "room_type": "SUITE",
    "capacity": 6,
    "floor": 5
  }'
```

### Get All Rooms
```bash
curl http://localhost:8000/api/rooms
```

### Create a Reservation
```bash
curl -X POST http://localhost:8000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "<ROOM_ID>",
    "guest_name": "Test Guest",
    "guest_email": "test@example.com",
    "check_in": "2026-02-15",
    "check_out": "2026-02-18"
  }'
```

### Get Calendar Data
```bash
curl "http://localhost:8000/api/reservations/calendar?start_date=2026-02-01&end_date=2026-02-28"
```

## ✅ Feature Checklist

- [ ] Landing page loads with correct colors
- [ ] Backend API docs accessible
- [ ] Database seeded successfully
- [ ] Calendar displays rooms and dates
- [ ] Existing reservations show correctly
- [ ] Can create new reservation
- [ ] Cannot create overlapping reservation
- [ ] Calendar navigation works
- [ ] Date range selector works
- [ ] Room list stays sticky on scroll
- [ ] Color coding is correct
- [ ] Hover states work
- [ ] Modal opens and closes

## 📸 Screenshots

### Calendar View (Expected)
```
┌─────────────┬─────┬─────┬─────┬─────┬─────┐
│ Room        │ Mon │ Tue │ Wed │ Thu │ Fri │
├─────────────┼─────┼─────┼─────┼─────┼─────┤
│ 101 Single  │█████│█████│█████│  +  │  +  │ ← John Smith (Checked In)
│ 201 Double  │  +  │  +  │█████│█████│█████│ ← Sarah Johnson (Confirmed)
│ 301 Suite   │  +  │  +  │  +  │  +  │  +  │
└─────────────┴─────┴─────┴─────┴─────┴─────┘
```

### Reservation Modal (Expected)
```
┌──────────────────────────────────┐
│ New Reservation              [×] │
│                                  │
│ Room: 101 - Cozy Single          │
│                                  │
│ Guest Name: ________________     │
│ Email:      ________________     │
│ Phone:      ________________     │
│ Check-in:   [2026-02-10]         │
│ Check-out:  [2026-02-12]         │
│ Notes:      ________________     │
│                                  │
│   [Cancel]  [Create Reservation] │
└──────────────────────────────────┘
```

---

**Questions?** Check the main README or ask JP! 🦝
