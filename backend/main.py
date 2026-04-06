from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import GroupCreate, Group, CardCreate, Card, CardUpdate
from data import (
    get_all_groups,
    get_group_by_id,
    get_group_by_name,
    create_group,
    delete_group,
    get_cards_by_group,
    get_card_by_id,
    create_card,
    update_card,
    delete_card,
)

app = FastAPI(title="Flashcard Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Flashcard backend is running"}


# -------- Group API 13002718 --------

@app.get("/groups", response_model=List[Group]) #check group
def api_get_groups():
    return get_all_groups()


@app.post("/groups", response_model=Group) #create group 
def api_create_group(group: GroupCreate):
    existing_group = get_group_by_name(group.name)
    if existing_group:
        raise HTTPException(status_code=400, detail="Group name already exists.")
    return create_group(group.name)


@app.delete("/groups/{group_id}")  #delete group
def api_delete_group(group_id: int):
    success = delete_group(group_id)
    if not success:
        raise HTTPException(status_code=404, detail="Group not found.")
    return {"message": "Group deleted successfully."}


# -------- Card API 13002718 --------

@app.get("/groups/{group_id}/cards", response_model=List[Card]) #check card
def api_get_cards_by_group(group_id: int):
    group = get_group_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    return get_cards_by_group(group_id)


@app.post("/cards", response_model=Card) #create card
def api_create_card(card: CardCreate):
    group = get_group_by_id(card.group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    return create_card(card.group_id, card.question, card.answer)


@app.put("/cards/{card_id}", response_model=Card) #update card
def api_update_card(card_id: int, card: CardUpdate):
    updated = update_card(card_id, card.question, card.answer)
    if not updated:
        raise HTTPException(status_code=404, detail="Card not found.")
    return updated


@app.delete("/cards/{card_id}") #delete card
def api_delete_card(card_id: int):
    success = delete_card(card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found.")
    return {"message": "Card deleted successfully."}