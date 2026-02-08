from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

from models.room import RoomType


class RoomBase(BaseModel):
    """Base schema for room data"""
    number: str = Field(..., description="Room number (e.g., '101', '205')")
    name: str = Field(..., description="Room name or description")
    room_type: RoomType = Field(..., description="Type of room")
    capacity: int = Field(..., gt=0, description="Maximum guest capacity")
    floor: Optional[int] = Field(None, description="Floor number")
    description: Optional[str] = Field(None, description="Additional room details")


class RoomCreate(RoomBase):
    """Schema for creating a new room"""
    pass


class RoomUpdate(BaseModel):
    """Schema for updating a room (all fields optional)"""
    number: Optional[str] = None
    name: Optional[str] = None
    room_type: Optional[RoomType] = None
    capacity: Optional[int] = Field(None, gt=0)
    floor: Optional[int] = None
    description: Optional[str] = None


class RoomResponse(RoomBase):
    """Schema for room response"""
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
