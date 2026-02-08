from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Room
from schemas import RoomCreate, RoomUpdate, RoomResponse

router = APIRouter()


@router.get("/", response_model=List[RoomResponse])
async def get_rooms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all rooms with pagination"""
    rooms = db.query(Room).offset(skip).limit(limit).all()
    return rooms


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: str, db: Session = Depends(get_db)):
    """Get a specific room by ID"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    return room


@router.post("/", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(room_data: RoomCreate, db: Session = Depends(get_db)):
    """Create a new room"""
    # Check if room number already exists
    existing = db.query(Room).filter(Room.number == room_data.number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Room number {room_data.number} already exists"
        )
    
    # Create new room
    room = Room(**room_data.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.put("/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: str,
    room_data: RoomUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing room"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    
    # Check if updating room number to one that already exists
    if room_data.number and room_data.number != room.number:
        existing = db.query(Room).filter(Room.number == room_data.number).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Room number {room_data.number} already exists"
            )
    
    # Update fields
    update_data = room_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(room, field, value)
    
    db.commit()
    db.refresh(room)
    return room


@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_room(room_id: str, db: Session = Depends(get_db)):
    """Delete a room"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    
    db.delete(room)
    db.commit()
    return None
