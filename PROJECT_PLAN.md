# LobbyLobster - Project Plan

## Problem Statement

Hotel administration software (Property Management Systems) are expensive:
- Commercial solutions cost €100-500/month
- Often bloated with unused features
- Poor user experience
- Vendor lock-in

**Goal**: Build a lean, modern PMS focused on essential features at minimal cost.

## Phase 1 - MVP (Minimum Viable Product)

### Core Features
1. **Calendar View**
   - Excel-like grid: Rooms (vertical) × Days (horizontal)
   - Color-coded availability status
   - Quick visual overview of the entire property
   
2. **Room Management**
   - List of rooms with properties (number, type, capacity)
   - CRUD operations for rooms
   
3. **Reservation System**
   - Create new reservations
   - View existing reservations
   - Edit/cancel reservations
   - Check-in/check-out dates
   - Guest name (basic info)
   
4. **Database**
   - Persistent storage
   - Data integrity (no double bookings)
   - Efficient queries for calendar view

### Technical Requirements
- Responsive design (desktop-first, mobile-friendly)
- Fast performance (<1s page loads)
- Type-safe (catch errors at compile time)
- Easy to deploy

### Success Criteria
- Can manage 20-50 rooms
- Staff can view availability at a glance
- Can create/edit reservations in <30 seconds
- No data loss
- Deployment cost <€10/month

## Phase 2 - Enhanced Features (Future)

### Guest Management
- Full guest profiles (contact, preferences)
- Guest history
- Notes/special requests

### Financial Features
- Pricing management (base rates, seasonal pricing)
- Invoice generation
- Payment tracking
- Reporting (occupancy, revenue)

### Operations
- Housekeeping status
- Maintenance tracking
- Multi-user accounts with roles
- Audit logs

### Integrations
- Email notifications
- Channel managers (Booking.com, Expedia, etc.)
- Payment processors
- Export to accounting software

## Development Timeline (Estimated)

### Week 1-2: Foundation
- [x] Project setup
- [ ] Next.js + TypeScript configuration
- [ ] Database schema design
- [ ] UI component library setup
- [ ] Basic routing structure

### Week 3-4: Calendar View
- [ ] Calendar grid component
- [ ] Room list sidebar
- [ ] Date navigation
- [ ] Availability visualization
- [ ] Responsive layout

### Week 5-6: Reservation CRUD
- [ ] Create reservation form
- [ ] Edit reservation dialog
- [ ] Delete/cancel reservation
- [ ] Double-booking prevention
- [ ] Validation & error handling

### Week 7-8: Polish & Deploy
- [ ] Testing (manual + automated)
- [ ] Performance optimization
- [ ] User feedback & adjustments
- [ ] Documentation
- [ ] First production deployment

### Month 3+: User Feedback & Iteration
- [ ] Collect feedback from hotel staff
- [ ] Fix bugs & UX issues
- [ ] Prioritize Phase 2 features
- [ ] Gradual rollout of new features

## Technology Decisions

### Why Next.js?
- Full-stack in one codebase (easier maintenance)
- Great developer experience (fast refresh, TypeScript support)
- Built-in API routes (no separate backend needed)
- Excellent deployment options (Vercel, self-host)
- Large community & ecosystem

### Why Prisma?
- Type-safe database access
- Auto-generated client from schema
- Migration system
- Works with SQLite (dev) and PostgreSQL (prod)
- Great DX (autocomplete, inline docs)

### Why SQLite → PostgreSQL?
- **SQLite**: Perfect for local development (zero setup)
- **PostgreSQL**: Production-ready, scalable, ACID compliant
- Prisma makes switching databases trivial

### Why Tailwind CSS?
- Fast prototyping
- Consistent design system
- Small bundle size (unused styles purged)
- No CSS conflicts
- Easy to customize

### Why shadcn/ui?
- Beautiful, accessible components
- Built on Radix UI (robust primitives)
- Copy-paste approach (you own the code)
- Customizable with Tailwind
- TypeScript first

## Risk Management

### Potential Risks
1. **Scope Creep**: Too many features too soon
   - *Mitigation*: Strict MVP focus, defer non-essential features

2. **Data Loss**: Critical for a production system
   - *Mitigation*: Regular backups, database transactions, thorough testing

3. **Double Bookings**: Business-critical to prevent
   - *Mitigation*: Database constraints, optimistic locking, validation

4. **Performance**: Slow calendar rendering with many rooms/dates
   - *Mitigation*: Virtualization, pagination, caching

5. **Learning Curve**: New technologies for JP
   - *Mitigation*: Clear documentation, pair programming with Raccoony

## Success Metrics

### MVP Success
- ✅ Deployed and running
- ✅ Managing real reservations
- ✅ Zero data loss incidents
- ✅ Positive feedback from hotel staff
- ✅ Cost savings vs. commercial PMS

### Long-term Success
- 📈 Adding new features based on real needs
- 📈 Stable, bug-free operation
- 📈 Potential to use in other hotels
- 📈 JP gains valuable full-stack experience

## Next Steps

1. **Immediate**: Initialize Next.js project
2. **Day 1-2**: Set up Prisma, create initial schema
3. **Day 3-5**: Build basic calendar layout
4. **Week 2**: First working reservation flow

---

**Remember**: Start small, ship often, iterate based on feedback. Perfect is the enemy of good. 🚀
