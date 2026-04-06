"""
This file handles all database CRUD operations
for groups and cards in the flashcard application.
"""

import sqlite3

DB_NAME = "database.db" #define name of database 

def get_connection():
    """
    Connect to the SQLite database
    """
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# --------Group CRUD 13002718--------- 

def get_all_groups(): #get all group from data 

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM groups ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_group_by_id(group_id): #find one group by id

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM groups WHERE id = ?", (group_id,))
    row = cursor.fetchone()

    conn.close()
    return dict(row) if row else None


def get_group_by_name(name): #find one group by name

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM groups WHERE name = ?", (name,))
    row = cursor.fetchone()

    conn.close()
    return dict(row) if row else None


def create_group(name): #create a group
 
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO groups (name) VALUES (?)", (name,))
    conn.commit()

    new_id = cursor.lastrowid
    conn.close()

    return {
        "id": new_id,
        "name": name
    }


def delete_group(group_id): #delete a group 
    """
    Delete a group and all cards inside it
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM groups WHERE id = ?", (group_id,))
    existing_group = cursor.fetchone()

    if not existing_group: #group not found
        conn.close()
        return False

    cursor.execute("DELETE FROM cards WHERE group_id = ?", (group_id,))
    cursor.execute("DELETE FROM groups WHERE id = ?", (group_id,))
    conn.commit()

    conn.close()
    return True


# ----------Card CRUD 13002718-------------

def get_cards_by_group(group_id): #get all group card from data 
   
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cards WHERE group_id = ? ORDER BY id ASC", (group_id,))
    rows = cursor.fetchall()

    conn.close()
    return [dict(row) for row in rows]


def get_card_by_id(card_id): #get one card by id

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
    row = cursor.fetchone()

    conn.close()
    return dict(row) if row else None


def create_card(group_id, question, answer): #create a card 

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO cards (group_id, question, answer) VALUES (?, ?, ?)",
        (group_id, question, answer)
    )
    conn.commit()

    new_id = cursor.lastrowid
    conn.close()

    return {
        "id": new_id,
        "group_id": group_id,
        "question": question,
        "answer": answer
    }


def update_card(card_id, question, answer): #change and update card
  
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
    existing_card = cursor.fetchone()

    if not existing_card:
        conn.close()
        return None

    cursor.execute(
        "UPDATE cards SET question = ?, answer = ? WHERE id = ?",
        (question, answer, card_id)
    )
    conn.commit()

    updated_card = {
        "id": card_id,
        "group_id": existing_card["group_id"],
        "question": question,
        "answer": answer
    }

    conn.close()
    return updated_card


def delete_card(card_id): #delete card

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
    existing_card = cursor.fetchone()

    if not existing_card:
        conn.close()
        return False

    cursor.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    conn.commit()

    conn.close()
    return True
