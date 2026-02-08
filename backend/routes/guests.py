from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from typing import List
from datetime import date

from database import get_db
from models import Reservation, Room

router = APIRouter()


@router.get("/")
async def get_guests(
    db: Session = Depends(get_db)
):
    """Get all unique guests with their reservation history"""
    
    # Get all reservations with room details, ordered by most recent
    reservations = (
        db.query(Reservation)
        .join(Room)
        .order_by(Reservation.check_in.desc())
        .all()
    )
    
    # Group by guest name (could use email as better identifier in future)
    guests_dict = {}
    
    for res in reservations:
        guest_key = res.guest_name.lower().strip()
        
        if guest_key not in guests_dict:
            guests_dict[guest_key] = {
                "guest_name": res.guest_name,
                "guest_email": res.guest_email,
                "guest_phone": res.guest_phone,
                "guest_company": res.guest_company,
                "total_stays": 0,
                "total_nights": 0,
                "last_visit": None,
                "first_visit": None,
                "reservations": []
            }
        
        guest = guests_dict[guest_key]
        guest["total_stays"] += 1
        
        # Calculate nights
        nights = (res.check_out - res.check_in).days
        guest["total_nights"] += nights
        
        # Track first and last visits
        if guest["last_visit"] is None or res.check_in > guest["last_visit"]:
            guest["last_visit"] = res.check_in
            # Update contact info with most recent
            guest["guest_email"] = res.guest_email
            guest["guest_phone"] = res.guest_phone
            guest["guest_company"] = res.guest_company
        
        if guest["first_visit"] is None or res.check_in < guest["first_visit"]:
            guest["first_visit"] = res.check_in
        
        # Add reservation details
        guest["reservations"].append({
            "id": res.id,
            "room_number": res.room.number,
            "room_name": res.room.name,
            "check_in": res.check_in.isoformat(),
            "check_out": res.check_out.isoformat(),
            "status": res.status,
            "nights": nights
        })
    
    # Convert to list and sort by total stays (most frequent guests first)
    guests_list = sorted(
        guests_dict.values(),
        key=lambda x: (x["total_stays"], x["total_nights"]),
        reverse=True
    )
    
    # Format dates for JSON
    for guest in guests_list:
        if guest["last_visit"]:
            guest["last_visit"] = guest["last_visit"].isoformat()
        if guest["first_visit"]:
            guest["first_visit"] = guest["first_visit"].isoformat()
    
    return guests_list
