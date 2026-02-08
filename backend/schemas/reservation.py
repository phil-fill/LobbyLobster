from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import date, datetime
from typing import Optional

from models.reservation import ReservationStatus


class ReservationBase(BaseModel):
    """Base schema for reservation data"""
    room_id: str = Field(..., description="ID of the room being reserved")
    guest_name: str = Field(..., min_length=1, description="Guest name")
    guest_email: Optional[str] = Field(None, description="Guest email")
    guest_phone: Optional[str] = Field(None, description="Guest phone number")
    check_in: date = Field(..., description="Check-in date")
    check_out: date = Field(..., description="Check-out date")
    notes: Optional[str] = Field(None, description="Special requests or notes")

    @field_validator("check_out")
    @classmethod
    def check_out_after_check_in(cls, check_out, info):
        """Validate that check-out is after check-in"""
        check_in = info.data.get("check_in")
        if check_in and check_out <= check_in:
            raise ValueError("Check-out date must be after check-in date")
        return check_out


class ReservationCreate(ReservationBase):
    """Schema for creating a new reservation"""
    pass


class ReservationUpdate(BaseModel):
    """Schema for updating a reservation (all fields optional)"""
    room_id: Optional[str] = None
    guest_name: Optional[str] = Field(None, min_length=1)
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    status: Optional[ReservationStatus] = None
    notes: Optional[str] = None


class ReservationResponse(ReservationBase):
    """Schema for reservation response"""
    id: str
    status: ReservationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReservationWithRoom(ReservationResponse):
    """Schema for reservation response with room details"""
    room_number: str
    room_name: str

    model_config = ConfigDict(from_attributes=True)
