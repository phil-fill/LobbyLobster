from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from database import Base


class ReservationStatus(str, enum.Enum):
    """Reservation status enumeration"""
    CONFIRMED = "CONFIRMED"
    CHECKED_IN = "CHECKED_IN"
    CHECKED_OUT = "CHECKED_OUT"
    CANCELLED = "CANCELLED"


class Reservation(Base):
    """Reservation model representing a room booking"""
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=True)
    guest_phone = Column(String, nullable=True)
    check_in = Column(Date, nullable=False, index=True)
    check_out = Column(Date, nullable=False, index=True)
    status = Column(SQLEnum(ReservationStatus), nullable=False, default=ReservationStatus.CONFIRMED)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to room
    room = relationship("Room", back_populates="reservations")

    def __repr__(self):
        return f"<Reservation {self.guest_name} in Room {self.room_id} ({self.check_in} - {self.check_out})>"
