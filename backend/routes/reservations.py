from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import date

from database import get_db
from models import Reservation, Room
from schemas import ReservationCreate, ReservationUpdate, ReservationResponse, ReservationWithRoom

router = APIRouter()


@router.get("/search-guests")
async def search_guests(
    query: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Search for guests by name for autocomplete"""
    if not query or len(query) < 2:
        return []
    
    # Search for unique guests matching the query
    results = (
        db.query(
            Reservation.guest_name,
            Reservation.guest_email,
            Reservation.guest_phone,
            Reservation.guest_address,
            Reservation.guest_city,
            Reservation.guest_postal_code,
            Reservation.guest_country,
            Reservation.guest_company,
            Reservation.company_address,
            Reservation.company_city,
            Reservation.company_postal_code,
            Reservation.company_country,
            func.max(Reservation.created_at).label('last_visit')
        )
        .filter(Reservation.guest_name.ilike(f"%{query}%"))
        .group_by(
            Reservation.guest_name,
            Reservation.guest_email,
            Reservation.guest_phone,
            Reservation.guest_address,
            Reservation.guest_city,
            Reservation.guest_postal_code,
            Reservation.guest_country,
            Reservation.guest_company,
            Reservation.company_address,
            Reservation.company_city,
            Reservation.company_postal_code,
            Reservation.company_country
        )
        .order_by(func.max(Reservation.created_at).desc())
        .limit(limit)
        .all()
    )
    
    return [
        {
            "guest_name": r.guest_name,
            "guest_email": r.guest_email,
            "guest_phone": r.guest_phone,
            "guest_address": r.guest_address,
            "guest_city": r.guest_city,
            "guest_postal_code": r.guest_postal_code,
            "guest_country": r.guest_country,
            "guest_company": r.guest_company,
            "company_address": r.company_address,
            "company_city": r.company_city,
            "company_postal_code": r.company_postal_code,
            "company_country": r.company_country,
        }
        for r in results
    ]


def check_room_availability(
    db: Session,
    room_id: str,
    check_in: date,
    check_out: date,
    exclude_reservation_id: Optional[str] = None
) -> bool:
    """Check if a room is available for the given dates"""
    query = db.query(Reservation).filter(
        Reservation.room_id == room_id,
        Reservation.status.in_(["CONFIRMED", "CHECKED_IN"]),
        or_(
            # New reservation starts during existing reservation
            and_(
                Reservation.check_in <= check_in,
                Reservation.check_out > check_in
            ),
            # New reservation ends during existing reservation
            and_(
                Reservation.check_in < check_out,
                Reservation.check_out >= check_out
            ),
            # New reservation completely encompasses existing reservation
            and_(
                Reservation.check_in >= check_in,
                Reservation.check_out <= check_out
            )
        )
    )
    
    # Exclude the current reservation if updating
    if exclude_reservation_id:
        query = query.filter(Reservation.id != exclude_reservation_id)
    
    conflicting = query.first()
    return conflicting is None


@router.get("/", response_model=List[ReservationResponse])
async def get_reservations(
    skip: int = 0,
    limit: int = 100,
    room_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all reservations with optional filters"""
    query = db.query(Reservation)
    
    if room_id:
        query = query.filter(Reservation.room_id == room_id)
    if status:
        query = query.filter(Reservation.status == status)
    
    reservations = query.offset(skip).limit(limit).all()
    return reservations


@router.get("/calendar", response_model=List[ReservationWithRoom])
async def get_calendar_reservations(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Get all reservations for the calendar view within a date range"""
    reservations = db.query(Reservation).join(Room).filter(
        or_(
            # Reservations that start in the range
            and_(
                Reservation.check_in >= start_date,
                Reservation.check_in <= end_date
            ),
            # Reservations that end in the range
            and_(
                Reservation.check_out >= start_date,
                Reservation.check_out <= end_date
            ),
            # Reservations that span the entire range
            and_(
                Reservation.check_in <= start_date,
                Reservation.check_out >= end_date
            )
        ),
        Reservation.status.in_(["CONFIRMED", "CHECKED_IN"])
    ).all()
    
    # Add room details to response
    result = []
    for reservation in reservations:
        result.append({
            **reservation.__dict__,
            "room_number": reservation.room.number,
            "room_name": reservation.room.name
        })
    
    return result


@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    """Get a specific reservation by ID"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found"
        )
    return reservation


@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    reservation_data: ReservationCreate,
    db: Session = Depends(get_db)
):
    """Create a new reservation"""
    # Check if room exists
    room = db.query(Room).filter(Room.id == reservation_data.room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {reservation_data.room_id} not found"
        )
    
    # Check availability
    if not check_room_availability(
        db,
        reservation_data.room_id,
        reservation_data.check_in,
        reservation_data.check_out
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room {room.number} is not available for the selected dates"
        )
    
    # Calculate total price if price_per_night is provided
    data_dict = reservation_data.model_dump()
    if data_dict.get('price_per_night'):
        nights = (reservation_data.check_out - reservation_data.check_in).days
        data_dict['total_price'] = data_dict['price_per_night'] * nights
    
    # Create reservation
    reservation = Reservation(**data_dict)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.put("/{reservation_id}", response_model=ReservationResponse)
async def update_reservation(
    reservation_id: str,
    reservation_data: ReservationUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing reservation"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found"
        )
    
    # If updating room or dates, check availability
    update_dict = reservation_data.model_dump(exclude_unset=True)
    room_id = update_dict.get("room_id", reservation.room_id)
    check_in = update_dict.get("check_in", reservation.check_in)
    check_out = update_dict.get("check_out", reservation.check_out)
    
    if any(k in update_dict for k in ["room_id", "check_in", "check_out"]):
        if not check_room_availability(
            db,
            room_id,
            check_in,
            check_out,
            exclude_reservation_id=reservation_id
        ):
            room = db.query(Room).filter(Room.id == room_id).first()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Room {room.number if room else room_id} is not available for the selected dates"
            )
    
    # Update fields
    for field, value in update_dict.items():
        setattr(reservation, field, value)
    
    db.commit()
    db.refresh(reservation)
    return reservation


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reservation(reservation_id: str, db: Session = Depends(get_db)):
    """Delete a reservation"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found"
        )
    
    db.delete(reservation)
    db.commit()
    return None
