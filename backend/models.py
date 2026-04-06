"""
models.py

This file defines the data models 
It includes Group and Card models 

"""

from pydantic import BaseModel, validator


# =========================
# Group model
# =========================

class GroupCreate(BaseModel):
    """
    Used when creating a new group
    """
    name: str  # Group name

    @validator("name")
    def validate_name(cls, value):
        """
        null or not
        """
        value = value.strip()
        if not value:
            raise ValueError("Group name cannot be empty.")
        return value


class Group(BaseModel):
    """
    Used for returning full group information
    """
    id: int      # group id
    name: str    # group name


# =========================
# Card model
# =========================

class CardCreate(BaseModel):
    """
    when creating a new card
    """
    group_id: int
    question: str
    answer: str

    @validator("question", "answer")
    def validate_text_fields(cls, value):

        value = value.strip()
        if not value:
            raise ValueError("Question and answer cannot be empty.")
        return value


class Card(BaseModel):
    """
    Used for returning full card information
    """
    id: int
    group_id: int
    question: str
    answer: str


class CardUpdate(BaseModel):
    """
    Used when updating a card
    """
    question: str
    answer: str

    @validator("question", "answer")
    def validate_text_fields(cls, value):
        
        value = value.strip()
        if not value:
            raise ValueError("Question and answer cannot be empty.")
        return value