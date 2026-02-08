"""
Clear all data from the database
"""
from database import SessionLocal, init_db
from models import Room, Reservation

def clear_database():
    """Remove all data from the database"""
    print("🗑️  Clearing database...")
    
    # Initialize database (create tables if they don't exist)
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Count existing data
        reservation_count = db.query(Reservation).count()
        room_count = db.query(Room).count()
        
        if reservation_count == 0 and room_count == 0:
            print("✅ Database is already empty")
            return
        
        print(f"   Found {reservation_count} reservations")
        print(f"   Found {room_count} rooms")
        
        # Ask for confirmation
        response = input("\n⚠️  Are you sure you want to delete ALL data? (yes/no): ")
        if response.lower() != 'yes':
            print("❌ Clear cancelled")
            return
        
        # Delete all reservations first (foreign key constraint)
        db.query(Reservation).delete()
        db.commit()
        print("   ✅ Deleted all reservations")
        
        # Delete all rooms
        db.query(Room).delete()
        db.commit()
        print("   ✅ Deleted all rooms")
        
        print("\n✅ Database cleared successfully!")
        
    except Exception as e:
        print(f"❌ Error clearing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_database()
