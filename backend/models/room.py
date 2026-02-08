from sqlalchemy import Column, String, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from database import Base


class RoomType(str, enum.Enum):
    """Room type enumeration"""
    SINGLE = "SINGLE"
    DOUBLE = "DOUBLE"
    SUITE = "SUITE"
    FAMILY = "FAMILY"


class Room(Base):
    """Room model representing a hotel room"""
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    number = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    room_type = Column(SQLEnum(RoomType), nullable=False)
    capacity = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to reservations
    reservations = relationship("Reservation", back_populates="room", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Room {self.number}: {self.name} ({self.room_type})>"
