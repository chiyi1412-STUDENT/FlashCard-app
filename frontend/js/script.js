/*
Flashcard Web App - Frontend Logic Structure

1. View Control
2. Group Functions
3. Card Functions
4. UI Rendering
5. Card Interaction
6. Modal
*/

// Get main view sections
const studyView = document.getElementById("studyView");
const listView = document.getElementById("listView");
const addCardView = document.getElementById("addCardView");

const flashcard = document.getElementById("flashcard");
const editSetBtn = document.getElementById("editSetBtn");
const backFromListBtn = document.getElementById("backFromListBtn");
const addCardBtn = document.getElementById("addCardBtn");
const backFromAddBtn = document.getElementById("backFromAddBtn");
const doneAddCardBtn = document.getElementById("doneAddCardBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const addGroupBtn = document.getElementById("addGroupBtn");
const removeGroupBtn = document.getElementById("removeGroupBtn");
const doneAddGroupBtn = document.getElementById("doneAddGroupBtn");

const groupList = document.getElementById("groupList");
const addGroupPanel = document.getElementById("addGroupPanel");
const groupNameInput = document.getElementById("groupNameInput");

const cardLabel = document.getElementById("cardLabel");
const cardText = document.getElementById("cardText");
const progressText = document.getElementById("progressText");

const questionListPanel = document.getElementById("questionListPanel");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");

const confirmModal = document.getElementById("confirmModal");
const modalMessage = document.getElementById("modalMessage");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");

const groupColors = [
  "group-color-1",
  "group-color-2",
  "group-color-3",
  "group-color-4"
];

// Store all groups and current state
let groups = [];

let currentGroupIndex = 0;
let currentCardIndex = 0;
let editCardIndex = null;
let showingAnswer = false;
let confirmAction = null;
let isFlipping = false;

const cardHint = document.createElement("div");
cardHint.className = "card-hint";
flashcard.appendChild(cardHint);

// ---------- localStorage helpers ----------
function saveAppState(viewName = null) {
  localStorage.setItem("flashcardCurrentGroupIndex", String(currentGroupIndex));
  localStorage.setItem("flashcardCurrentCardIndex", String(currentCardIndex));
  if (viewName) {
    localStorage.setItem("flashcardCurrentView", viewName);
  }
}

function getSavedView() {
  return localStorage.getItem("flashcardCurrentView") || "study";
}

function restoreSavedIndexes() {
  const savedGroupIndex = parseInt(localStorage.getItem("flashcardCurrentGroupIndex"), 10);
  const savedCardIndex = parseInt(localStorage.getItem("flashcardCurrentCardIndex"), 10);

  if (!Number.isNaN(savedGroupIndex)) {
    currentGroupIndex = savedGroupIndex;
  }

  if (!Number.isNaN(savedCardIndex)) {
    currentCardIndex = savedCardIndex;
  }
}

function updateCardHint() {
  if (showingAnswer) {
    cardHint.textContent = "Answer side";
    flashcard.classList.add("answer-mode");
  } else {
    cardHint.textContent = "Click to view answer";
    flashcard.classList.remove("answer-mode");
  }
}

// Switch between different views
function showView(view) {
  studyView.classList.add("hidden");
  listView.classList.add("hidden");
  addCardView.classList.add("hidden");
  view.classList.remove("hidden");
}

function openConfirmModal(message, onConfirm) {
  modalMessage.textContent = message;
  confirmAction = onConfirm;
  confirmModal.classList.remove("hidden");
}

function closeConfirmModal() {
  confirmModal.classList.add("hidden");
  confirmAction = null;
}

modalCancelBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeConfirmModal();
});

modalConfirmBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (confirmAction) {
    await confirmAction();
  }
  closeConfirmModal();
});

confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) {
    closeConfirmModal();
  }
});

// Load all groups from backend
async function loadGroups() {
  const response = await fetch("http://127.0.0.1:8000/groups");
  const data = await response.json();

  groups = data.map((g, index) => ({
    id: g.id,
    name: g.name,
    colorClass: groupColors[index % groupColors.length],
    cards: []
  }));

  if (groups.length === 0) {
    currentGroupIndex = 0;
    currentCardIndex = 0;
    renderGroupList();
    renderStudyCard();
    renderListView();
    return;
  }

  if (currentGroupIndex >= groups.length) {
    currentGroupIndex = 0;
  }

  await loadCards(groups[currentGroupIndex].id);

  renderGroupList();
  renderStudyCard();
  renderListView();
}

// Load cards of a specific group
async function loadCards(groupId) {
  const response = await fetch(`http://127.0.0.1:8000/groups/${groupId}/cards`);
  const data = await response.json();

  groups[currentGroupIndex].cards = data;

  if (currentCardIndex >= groups[currentGroupIndex].cards.length) {
    currentCardIndex = Math.max(0, groups[currentGroupIndex].cards.length - 1);
  }
}

// Render group list on the left panel
function renderGroupList() {
  groupList.innerHTML = "";

  groups.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "group-item";

    if (index === currentGroupIndex) {
      button.classList.add("active");
    }

    const nameSpan = document.createElement("span");
    nameSpan.className = "group-name";
    nameSpan.textContent = group.name;

    const colorDot = document.createElement("span");
    colorDot.className = `group-color ${group.colorClass}`;

    button.appendChild(nameSpan);
    button.appendChild(colorDot);

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      currentGroupIndex = index;
      currentCardIndex = 0;
      showingAnswer = false;

      await loadCards(groups[index].id);

      renderGroupList();
      renderStudyCard();
      renderListView();

      if (groups[currentGroupIndex].cards.length > 0) {
        saveAppState("study");
        showView(studyView);
      } else {
        saveAppState("list");
        showView(listView);
      }
    });

    groupList.appendChild(button);
  });
}

// Display current card Q&A
function renderStudyCard() {
  if (groups.length === 0) {
    cardLabel.textContent = "No Group";
    cardText.textContent = "Please add a new group.";
    progressText.textContent = "0 of 0";
    flashcard.classList.remove("answer-mode");
    cardHint.textContent = "Add a group first";
    return;
  }

  const currentGroup = groups[currentGroupIndex];
  const cards = currentGroup.cards;

  if (cards.length === 0) {
    saveAppState("list");
    showView(listView);
    return;
  }

  const currentCard = cards[currentCardIndex];

  if (showingAnswer) {
    cardLabel.textContent = `Q${currentCardIndex + 1} Answer:`;
    cardText.textContent = currentCard.answer;
  } else {
    cardLabel.textContent = `Q${currentCardIndex + 1}:`;
    cardText.textContent = currentCard.question;
  }

  progressText.textContent = `${currentCardIndex + 1} of ${cards.length}`;
  updateCardHint();
}

function renderListView() {
  questionListPanel.innerHTML = "";

  if (groups.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const emptyText = document.createElement("p");
    emptyText.textContent = "No group available.";

    emptyState.appendChild(emptyText);
    questionListPanel.appendChild(emptyState);
    return;
  }

  const currentGroup = groups[currentGroupIndex];
  const cards = currentGroup.cards;

  if (cards.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const emptyText = document.createElement("p");
    emptyText.textContent = "No cards in this group.";

    const emptyAddBtn = document.createElement("button");
    emptyAddBtn.type = "button";
    emptyAddBtn.textContent = "Add Your First Card";
    emptyAddBtn.className = "empty-add-btn";

    emptyAddBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      editCardIndex = null;
      questionInput.value = "";
      answerInput.value = "";
      saveAppState("add");
      showView(addCardView);
    });

    emptyState.appendChild(emptyText);
    emptyState.appendChild(emptyAddBtn);
    questionListPanel.appendChild(emptyState);
    return;
  }

  cards.forEach((card, index) => {
    const item = document.createElement("div");
    item.className = "question-item";

    const text = document.createElement("span");
    text.textContent = `Q${index + 1} : ${card.question}`;

    const buttonWrapper = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      editCardIndex = index;
      questionInput.value = card.question;
      answerInput.value = card.answer;
      saveAppState("add");
      showView(addCardView);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openConfirmModal(`Delete Q${index + 1}?`, async () => {
        const cardId = currentGroup.cards[index].id;

        await fetch(`http://127.0.0.1:8000/cards/${cardId}`, {
          method: "DELETE"
        });

        await loadCards(currentGroup.id);

        if (currentCardIndex >= currentGroup.cards.length) {
          currentCardIndex = Math.max(0, currentGroup.cards.length - 1);
        }

        showingAnswer = false;
        saveAppState("list");
        renderListView();
        showView(listView);
      });
    });

    buttonWrapper.appendChild(editBtn);
    buttonWrapper.appendChild(deleteBtn);

    item.appendChild(text);
    item.appendChild(buttonWrapper);

    questionListPanel.appendChild(item);
  });
}

// Card animation
function flipCard() {
  if (groups.length === 0) return;

  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0 || isFlipping) return;

  isFlipping = true;
  flashcard.classList.add("is-flipping");

  setTimeout(() => {
    showingAnswer = !showingAnswer;
    renderStudyCard();
  }, 300);

  setTimeout(() => {
    flashcard.classList.remove("is-flipping");
    isFlipping = false;
  }, 600);
}

// next-card animation and switch to the next card
function playNextCardAnimation() {
  if (groups.length === 0) return;

  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0 || isFlipping) return;

  isFlipping = true;
  flashcard.classList.add("slide-out-up");

  setTimeout(() => {
    currentCardIndex++;
    showingAnswer = false;
    saveAppState("study");
    renderStudyCard();

    flashcard.classList.remove("slide-out-up");
    flashcard.classList.add("fade-in-card");

    setTimeout(() => {
      flashcard.classList.remove("fade-in-card");
      isFlipping = false;
    }, 300);
  }, 450);
}

flashcard.addEventListener("click", flipCard);

editSetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  renderListView();
  saveAppState("list");
  showView(listView);
});

backFromListBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  showingAnswer = false;
  renderStudyCard();
  saveAppState("study");
  showView(studyView);
});

addCardBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  editCardIndex = null;
  questionInput.value = "";
  answerInput.value = "";
  saveAppState("add");
  showView(addCardView);
});

backFromAddBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  renderListView();
  saveAppState("list");
  showView(listView);
});

doneAddCardBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (groups.length === 0) {
    alert("Please add a group first.");
    return;
  }

  const questionValue = questionInput.value.trim();
  const answerValue = answerInput.value.trim();

  if (questionValue === "" || answerValue === "") {
    alert("Please enter both question and answer.");
    return;
  }

  const groupId = groups[currentGroupIndex].id;

  if (editCardIndex === null) {
    await fetch("http://127.0.0.1:8000/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group_id: groupId,
        question: questionValue,
        answer: answerValue
      })
    });
  } else {
    const cardId = groups[currentGroupIndex].cards[editCardIndex].id;

    await fetch(`http://127.0.0.1:8000/cards/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: questionValue,
        answer: answerValue
      })
    });
  }

  editCardIndex = null;
  showingAnswer = false;

  await loadCards(groupId);

  questionInput.value = "";
  answerInput.value = "";

  saveAppState("list");
  renderListView();
  showView(listView);
});

prevBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (groups.length === 0) return;

  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0) return;

  if (currentCardIndex > 0) {
    currentCardIndex--;
    showingAnswer = false;
    saveAppState("study");
    renderStudyCard();
  }
});

nextBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (groups.length === 0) return;

  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0) return;

  if (currentCardIndex < currentGroup.cards.length - 1) {
    playNextCardAnimation();
  }
});

addGroupBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  addGroupPanel.classList.remove("hidden");
});

doneAddGroupBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const groupName = groupNameInput.value.trim();

  if (groupName === "") {
    alert("Please enter a group name.");
    return;
  }

  await fetch("http://127.0.0.1:8000/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: groupName
    })
  });

  groupNameInput.value = "";
  addGroupPanel.classList.add("hidden");

  const response = await fetch("http://127.0.0.1:8000/groups");
  const data = await response.json();

  groups = data.map((g, index) => ({
    id: g.id,
    name: g.name,
    colorClass: groupColors[index % groupColors.length],
    cards: []
  }));

  currentGroupIndex = groups.length - 1;
  currentCardIndex = 0;
  showingAnswer = false;

  await loadCards(groups[currentGroupIndex].id);

  renderGroupList();
  renderStudyCard();
  renderListView();
  saveAppState("list");
  showView(listView);
});

removeGroupBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (groups.length <= 1) {
    alert("At least one group must remain.");
    return;
  }

  openConfirmModal(`Delete group "${groups[currentGroupIndex].name}"?`, async () => {
    const groupId = groups[currentGroupIndex].id;

    await fetch(`http://127.0.0.1:8000/groups/${groupId}`, {
      method: "DELETE"
    });

    showingAnswer = false;

    await loadGroups();
    renderGroupList();
    renderListView();
    saveAppState("list");
    showView(listView);
  });
});

// ---------- initial load ----------
restoreSavedIndexes();

loadGroups().then(() => {
  const savedView = getSavedView();

  if (groups.length === 0) {
    showView(studyView);
    appContainer.classList.remove("hidden");
    return;
  }

  if (currentGroupIndex >= groups.length) {
    currentGroupIndex = 0;
  }

  if (savedView === "list") {
    renderListView();
    showView(listView);
  } else if (savedView === "add") {
    showView(addCardView);
  } else {
    renderStudyCard();
    showView(studyView);
  }

  appContainer.classList.remove("hidden");
});