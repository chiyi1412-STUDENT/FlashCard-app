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

let groups = [
  {
    name: "Group 1",
    colorClass: "group-color-1",
    cards: [
      {
        question: "What is xxxx",
        answer: "abc"
      }
    ]
  }
];

let currentGroupIndex = 0;
let currentCardIndex = 0;
let editCardIndex = null;
let showingAnswer = false;
let confirmAction = null;
let isFlipping = false;

const cardHint = document.createElement("div");
cardHint.className = "card-hint";
flashcard.appendChild(cardHint);

function updateCardHint() {
  if (showingAnswer) {
    cardHint.textContent = "Answer side";
    flashcard.classList.add("answer-mode");
  } else {
    cardHint.textContent = "Click to view answer";
    flashcard.classList.remove("answer-mode");
  }
}

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

modalCancelBtn.addEventListener("click", closeConfirmModal);

modalConfirmBtn.addEventListener("click", () => {
  if (confirmAction) {
    confirmAction();
  }
  closeConfirmModal();
});

confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) {
    closeConfirmModal();
  }
});

function renderGroupList() {
  groupList.innerHTML = "";

  groups.forEach((group, index) => {
    const button = document.createElement("button");
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

    button.addEventListener("click", () => {
      currentGroupIndex = index;
      currentCardIndex = 0;
      showingAnswer = false;
      renderGroupList();
      renderStudyCard();
      renderListView();
      showView(studyView);
    });

    groupList.appendChild(button);
  });
}

function renderStudyCard() {
  const currentGroup = groups[currentGroupIndex];
  const cards = currentGroup.cards;

  if (cards.length === 0) {
    cardLabel.textContent = "No Card";
    cardText.textContent = "Please add a new card.";
    progressText.textContent = "0 of 0";
    flashcard.classList.remove("answer-mode");
    cardHint.textContent = "Add a card first";
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
  const currentGroup = groups[currentGroupIndex];
  const cards = currentGroup.cards;

  questionListPanel.innerHTML = "";

  if (cards.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const emptyText = document.createElement("p");
    emptyText.textContent = "No cards in this group.";

    const emptyAddBtn = document.createElement("button");
    emptyAddBtn.textContent = "Add Your First Card";
    emptyAddBtn.className = "empty-add-btn";

    emptyAddBtn.addEventListener("click", () => {
      editCardIndex = null;
      questionInput.value = "";
      answerInput.value = "";
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
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editCardIndex = index;
      questionInput.value = card.question;
      answerInput.value = card.answer;
      showView(addCardView);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      openConfirmModal(`Delete Q${index + 1}?`, () => {
        currentGroup.cards.splice(index, 1);

        if (currentCardIndex >= currentGroup.cards.length) {
          currentCardIndex = Math.max(0, currentGroup.cards.length - 1);
        }

        showingAnswer = false;
        renderStudyCard();
        renderListView();
      });
    });

    buttonWrapper.appendChild(editBtn);
    buttonWrapper.appendChild(deleteBtn);

    item.appendChild(text);
    item.appendChild(buttonWrapper);

    questionListPanel.appendChild(item);
  });
}

function flipCard() {
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

flashcard.addEventListener("click", flipCard);

editSetBtn.addEventListener("click", () => {
  renderListView();
  showView(listView);
});

backFromListBtn.addEventListener("click", () => {
  showingAnswer = false;
  renderStudyCard();
  showView(studyView);
});

addCardBtn.addEventListener("click", () => {
  editCardIndex = null;
  questionInput.value = "";
  answerInput.value = "";
  showView(addCardView);
});

backFromAddBtn.addEventListener("click", () => {
  renderListView();
  showView(listView);
});

doneAddCardBtn.addEventListener("click", () => {
  const questionValue = questionInput.value.trim();
  const answerValue = answerInput.value.trim();

  if (questionValue === "" || answerValue === "") {
    alert("Please enter both question and answer.");
    return;
  }

  const currentGroup = groups[currentGroupIndex];

  if (editCardIndex === null) {
    currentGroup.cards.push({
      question: questionValue,
      answer: answerValue
    });
    currentCardIndex = currentGroup.cards.length - 1;
  } else {
    currentGroup.cards[editCardIndex] = {
      question: questionValue,
      answer: answerValue
    };
    currentCardIndex = editCardIndex;
  }

  editCardIndex = null;
  showingAnswer = false;
  renderStudyCard();
  renderListView();
  showView(listView);
});

prevBtn.addEventListener("click", () => {
  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0) return;

  if (currentCardIndex > 0) {
    currentCardIndex--;
    showingAnswer = false;
    renderStudyCard();
  }
});

nextBtn.addEventListener("click", () => {
  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0) return;

  if (currentCardIndex < currentGroup.cards.length - 1) {
    currentCardIndex++;
    showingAnswer = false;
    renderStudyCard();
  }
});

addGroupBtn.addEventListener("click", () => {
  addGroupPanel.classList.remove("hidden");
});

doneAddGroupBtn.addEventListener("click", () => {
  const groupName = groupNameInput.value.trim();

  if (groupName === "") {
    alert("Please enter a group name.");
    return;
  }

  const nextColorClass = groupColors[groups.length % groupColors.length];

  groups.push({
    name: groupName,
    colorClass: nextColorClass,
    cards: []
  });

  currentGroupIndex = groups.length - 1;
  currentCardIndex = 0;
  showingAnswer = false;
  groupNameInput.value = "";
  addGroupPanel.classList.add("hidden");

  renderGroupList();
  renderStudyCard();
  renderListView();
  showView(listView);
});

removeGroupBtn.addEventListener("click", () => {
  if (groups.length === 1) {
    alert("At least one group must remain.");
    return;
  }

  openConfirmModal(`Delete group "${groups[currentGroupIndex].name}"?`, () => {
    groups.splice(currentGroupIndex, 1);
    currentGroupIndex = 0;
    currentCardIndex = 0;
    showingAnswer = false;

    renderGroupList();
    renderStudyCard();
    renderListView();
    showView(studyView);
  });
});

renderGroupList();
renderStudyCard();
renderListView();
showView(studyView);