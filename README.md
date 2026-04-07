Name: Jiaqi Chen
Student ID: 13002718
Subject: 32516 Internet Programming 
Assignment: Flashcard Web App（An application that allows users to create questions as flashcards and click to see answers. ）

## 1.Flashcard Learning Application 

## 2. A brief summary of the problem this website solves 
This is a single-page website flashcard learning system designed to help users efficiently memorize and learn knowledge through grouped flashcards.
Users can create different learning card groups, each containing cards with added questions and answers. Clicking on a card flips it to reveal the answer, providing a flashcard-like learning experience.

## 3. illustration（technical stack）
[ User (Browser) ]
        ↓
[ index.html ]
        ↓
[ style.css ]   [ script.js ]
       (UI)      (control logic + Fetch API)
        ↓
        ↓  HTTP Request (GET / POST / DELETE)
        ↓
[ main.py (FastAPI) ]
        ↓
[ models.py ]  → Define data structures
[ data.py ]    → Handle data logic
        ↓
[ database.db ]
   (SQLite)
        ↑
[ init_db.py ] → Initialize the database

## 4. list of bullet points 
Create and delete decks
Add, view, and delete cards
Click a card to display the answer
Use the Fetch API for front-end and back-end communication
Create, delete, modify, and query operations based on the RESTful API
Store data using an SQLite database

## 5. project structure

FLASHCARD-APP/
│
├── backend/
│   ├── data.py          # Handles data operations
│   ├── models.py        # Defines data models
│   ├── main.py          # FastAPI application entry point
│   ├── init_db.py       # Initializes the database
│   ├── database.db      # SQLite database
│   ├── requirement.txt  # Backend dependencies
│   └── .venv/           # Virtual environment
│
├── frontend/  
│   ├── index.html       # Main page structure
│   ├── css/
│   │   └── style.css    # Styling and layout
│   └── js/
│       └── script.js    # Frontend logic and API communication
│
├── .gitignore           # Git ignore rules
├── .gitattributes       # Git configuration
└── README.md

## 6.challenges overcome

At the beginning, I was not very familiar with frontend development, so I was not always sure how my changes would appear on the page and had to debug them manually. Another challenge was making the frontend and backend communicate through the Fetch API. By testing step by step and gradually understanding the overall logic, I was able to keep improving the code until the communication worked.

## 7. AI STATEMENT

This project was developed with the assistance of AI tools (e.g, Copilot) for idea clarification, code guidance, and debugging support. All final code, design decisions, and implementations were reviewed, modified, and understood by the myself.