"""
init_db.py
initialize the sqlite database
"""

import sqlite3

#name of database
DB_NAME = "database.db"

def init_db():
    """
    1. link sql 
    2. create groups table
    3. create cards table
    4. save and change
    """

    # link and create 
    conn = sqlite3.connect(DB_NAME)

    # sql using
    cursor = conn.cursor()
    
    #create group table 
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
    """)

    #create card table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
    )
    """)

    #save
    conn.commit()

    conn.close()

    print("Database initialized successfully")

# run this file directly
if __name__=="__main__":
    init_db()
