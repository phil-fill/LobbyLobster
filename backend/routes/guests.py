from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from database import get_db
from models import Reservation, Room

router = APIRouter()


class GuestUpdate(BaseModel):
    """Schema for updating guest information across all reservations"""
    old_guest_name: str
    new_guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    guest_address: Optional[str] = None
    guest_city: Optional[str] = None
    guest_postal_code: Optional[str] = None
    guest_country: Optional[str] = None
    guest_company: Optional[str] = None
    company_address: Optional[str] = None
    company_city: Optional[str] = None
    company_postal_code: Optional[str] = None
    company_country: Optional[str] = None


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
                "guest_address": res.guest_address,
                "guest_city": res.guest_city,
                "guest_postal_code": res.guest_postal_code,
                "guest_country": res.guest_country,
                "guest_company": res.guest_company,
                "company_address": res.company_address,
                "company_city": res.company_city,
                "company_postal_code": res.company_postal_code,
                "company_country": res.company_country,
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
            guest["guest_address"] = res.guest_address
            guest["guest_city"] = res.guest_city
            guest["guest_postal_code"] = res.guest_postal_code
            guest["guest_country"] = res.guest_country
            guest["guest_company"] = res.guest_company
            guest["company_address"] = res.company_address
            guest["company_city"] = res.company_city
            guest["company_postal_code"] = res.company_postal_code
            guest["company_country"] = res.company_country
        
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


@router.put("/update")
async def update_guest_info(
    guest_update: GuestUpdate,
    db: Session = Depends(get_db)
):
    """Update guest information across all their reservations"""
    
    # Find all reservations for this guest
    reservations = (
        db.query(Reservation)
        .filter(func.lower(Reservation.guest_name) == guest_update.old_guest_name.lower())
        .all()
    )
    
    if not reservations:
        raise HTTPException(status_code=404, detail="No reservations found for this guest")
    
    # Update each reservation
    updated_count = 0
    for res in reservations:
        if guest_update.new_guest_name:
            res.guest_name = guest_update.new_guest_name
        if guest_update.guest_email is not None:
            res.guest_email = guest_update.guest_email
        if guest_update.guest_phone is not None:
            res.guest_phone = guest_update.guest_phone
        if guest_update.guest_address is not None:
            res.guest_address = guest_update.guest_address
        if guest_update.guest_city is not None:
            res.guest_city = guest_update.guest_city
        if guest_update.guest_postal_code is not None:
            res.guest_postal_code = guest_update.guest_postal_code
        if guest_update.guest_country is not None:
            res.guest_country = guest_update.guest_country
        if guest_update.guest_company is not None:
            res.guest_company = guest_update.guest_company
        if guest_update.company_address is not None:
            res.company_address = guest_update.company_address
        if guest_update.company_city is not None:
            res.company_city = guest_update.company_city
        if guest_update.company_postal_code is not None:
            res.company_postal_code = guest_update.company_postal_code
        if guest_update.company_country is not None:
            res.company_country = guest_update.company_country
        
        updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Updated {updated_count} reservations for guest {guest_update.old_guest_name}",
        "updated_count": updated_count
    }
