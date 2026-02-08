"""
Seed script to populate database with sample data for testing
"""
from datetime import date, timedelta
from database import SessionLocal, init_db
from models import Room, RoomType, Reservation, ReservationStatus

def seed_rooms(db):
    """Create 20 sample rooms"""
    rooms = [
        # Floor 1 - Singles (101-105)
        Room(number="101", name="Cozy Single", room_type=RoomType.SINGLE, capacity=1, floor=1),
        Room(number="102", name="Comfort Single", room_type=RoomType.SINGLE, capacity=1, floor=1),
        Room(number="103", name="Budget Single", room_type=RoomType.SINGLE, capacity=1, floor=1),
        Room(number="104", name="Standard Single", room_type=RoomType.SINGLE, capacity=1, floor=1),
        Room(number="105", name="Economy Single", room_type=RoomType.SINGLE, capacity=1, floor=1),
        
        # Floor 2 - Doubles (201-208)
        Room(number="201", name="Deluxe Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="202", name="Premium Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="203", name="Garden View Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="204", name="Street View Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="205", name="Courtyard Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="206", name="Standard Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="207", name="Comfort Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        Room(number="208", name="Classic Double", room_type=RoomType.DOUBLE, capacity=2, floor=2),
        
        # Floor 3 - Suites (301-304)
        Room(number="301", name="Executive Suite", room_type=RoomType.SUITE, capacity=4, floor=3),
        Room(number="302", name="Honeymoon Suite", room_type=RoomType.SUITE, capacity=2, floor=3),
        Room(number="303", name="Business Suite", room_type=RoomType.SUITE, capacity=3, floor=3),
        Room(number="304", name="Junior Suite", room_type=RoomType.SUITE, capacity=3, floor=3),
        
        # Floor 4 - Family Rooms (401-403)
        Room(number="401", name="Large Family Room", room_type=RoomType.FAMILY, capacity=5, floor=4),
        Room(number="402", name="Family Room", room_type=RoomType.FAMILY, capacity=4, floor=4),
        Room(number="403", name="XL Family Room", room_type=RoomType.FAMILY, capacity=6, floor=4),
    ]
    
    for room in rooms:
        db.add(room)
    
    db.commit()
    print(f"✅ Created {len(rooms)} rooms")
    return rooms

def seed_reservations(db, rooms):
    """Create sample reservations"""
    today = date.today()
    
    reservations = [
        # Room 101 - occupied now
        Reservation(
            room_id=rooms[0].id,
            guest_name="John Smith",
            guest_email="john@example.com",
            guest_phone="+1 234 567 8900",
            check_in=today,
            check_out=today + timedelta(days=3),
            status=ReservationStatus.CHECKED_IN,
            notes="Early check-in requested"
        ),
        # Room 201 - future booking
        Reservation(
            room_id=rooms[2].id,
            guest_name="Sarah Johnson",
            guest_email="sarah@example.com",
            check_in=today + timedelta(days=2),
            check_out=today + timedelta(days=5),
            status=ReservationStatus.CONFIRMED
        ),
        # Room 202 - current
        Reservation(
            room_id=rooms[3].id,
            guest_name="Michael Chen",
            guest_email="michael@example.com",
            guest_phone="+1 555 123 4567",
            check_in=today - timedelta(days=1),
            check_out=today + timedelta(days=2),
            status=ReservationStatus.CHECKED_IN,
            notes="Anniversary celebration"
        ),
        # Room 301 - suite booking
        Reservation(
            room_id=rooms[5].id,
            guest_name="Emily Davis",
            guest_email="emily@example.com",
            check_in=today + timedelta(days=5),
            check_out=today + timedelta(days=8),
            status=ReservationStatus.CONFIRMED,
            notes="Business trip, late checkout requested"
        ),
        # Room 302 - honeymoon
        Reservation(
            room_id=rooms[6].id,
            guest_name="Robert & Lisa Wilson",
            guest_email="wilson@example.com",
            check_in=today + timedelta(days=1),
            check_out=today + timedelta(days=7),
            status=ReservationStatus.CONFIRMED,
            notes="Honeymoon - champagne and flowers in room"
        ),
        # Room 401 - family
        Reservation(
            room_id=rooms[7].id,
            guest_name="Thompson Family",
            guest_email="thompson@example.com",
            guest_phone="+1 555 987 6543",
            check_in=today + timedelta(days=3),
            check_out=today + timedelta(days=10),
            status=ReservationStatus.CONFIRMED,
            notes="2 adults, 3 children (ages 5, 8, 12)"
        ),
    ]
    
    for reservation in reservations:
        db.add(reservation)
    
    db.commit()
    print(f"✅ Created {len(reservations)} reservations")

def main():
    """Main seed function"""
    print("🌱 Seeding database...")
    
    # Initialize database
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_rooms = db.query(Room).count()
        if existing_rooms > 0:
            print(f"⚠️  Database already has {existing_rooms} rooms")
            response = input("Do you want to clear and re-seed? (yes/no): ")
            if response.lower() != 'yes':
                print("❌ Seed cancelled")
                return
            
            # Clear existing data
            db.query(Reservation).delete()
            db.query(Room).delete()
            db.commit()
            print("🗑️  Cleared existing data")
        
        # Seed data
        rooms = seed_rooms(db)
        seed_reservations(db, rooms)
        
        print("✅ Database seeded successfully!")
        print(f"   - Rooms: {db.query(Room).count()}")
        print(f"   - Reservations: {db.query(Reservation).count()}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
