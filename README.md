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

### Frontend & Backend
- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library

### Database
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database toolkit
- **SQLite** (development) → **PostgreSQL** (production)

### Why This Stack?
- 🚀 **Fast Development**: Hot reload, type safety, modern tooling
- 🎨 **Beautiful UI**: Professional components out of the box
- 📊 **Type-Safe**: From database to frontend
- 🔧 **Easy Deployment**: Vercel, Railway, or self-hosted
- 💰 **Cost-Effective**: Open source, minimal hosting costs
- 📈 **Scalable**: Can grow with the business

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone git@github.com:phil-fill/LobbyLobster.git
cd LobbyLobster

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
LobbyLobster/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── (dashboard)/     # Dashboard pages
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── calendar/       # Calendar grid components
├── lib/                # Utility functions
│   ├── db.ts           # Database client
│   └── utils.ts        # Helper functions
├── prisma/             # Database schema & migrations
│   └── schema.prisma   # Prisma schema
├── public/             # Static assets
└── styles/             # Global styles
```

## 🗄️ Database Schema (Initial)

```prisma
model Room {
  id          String        @id @default(cuid())
  number      String        @unique
  name        String
  type        RoomType
  capacity    Int
  reservations Reservation[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Reservation {
  id          String   @id @default(cuid())
  roomId      String
  room        Room     @relation(fields: [roomId], references: [id])
  guestName   String
  checkIn     DateTime
  checkOut    DateTime
  status      ReservationStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum RoomType {
  SINGLE
  DOUBLE
  SUITE
  FAMILY
}

enum ReservationStatus {
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
}
```

## 🎨 UI/UX Design Principles

- **Simple & Intuitive**: Hotel staff should be able to use it without training
- **Visual First**: Color-coded statuses, drag-and-drop reservations
- **Responsive**: Works on desktop, tablet, and mobile
- **Fast**: Instant feedback, optimistic updates

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

- [ ] **Week 1-2**: Project setup, basic calendar UI
- [ ] **Week 3-4**: Database schema, API routes
- [ ] **Week 5-6**: Reservation creation & editing
- [ ] **Week 7-8**: Polish, testing, first deployment
- [ ] **Month 3+**: Guest management, invoicing, reporting

## 📞 Support

For questions or issues, contact JP.

---

**Built with 🦝 by Raccoony & JP**
