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

let groups = [
  {
    name: "Group 1",
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

function showView(view) {
  studyView.classList.add("hidden");
  listView.classList.add("hidden");
  addCardView.classList.add("hidden");
  view.classList.remove("hidden");
}

function renderGroupList() {
  groupList.innerHTML = "";

  groups.forEach((group, index) => {
    const button = document.createElement("button");
    button.className = "group-item";

    if (index === currentGroupIndex) {
      button.classList.add("active");
    }

    button.textContent = group.name;

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
}

function renderListView() {
  const currentGroup = groups[currentGroupIndex];
  const cards = currentGroup.cards;

  questionListPanel.innerHTML = "";

  if (cards.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.textContent = "No cards in this group.";
    questionListPanel.appendChild(emptyText);
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
    deleteBtn.addEventListener("click", () => {
      currentGroup.cards.splice(index, 1);

      if (currentCardIndex >= currentGroup.cards.length) {
        currentCardIndex = Math.max(0, currentGroup.cards.length - 1);
      }

      showingAnswer = false;
      renderStudyCard();
      renderListView();
    });

    buttonWrapper.appendChild(editBtn);
    buttonWrapper.appendChild(deleteBtn);

    item.appendChild(text);
    item.appendChild(buttonWrapper);

    questionListPanel.appendChild(item);
  });
}

flashcard.addEventListener("click", () => {
  const currentGroup = groups[currentGroupIndex];
  if (currentGroup.cards.length === 0) return;

  showingAnswer = !showingAnswer;
  renderStudyCard();
});

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

  groups.push({
    name: groupName,
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
  showView(studyView);
});

removeGroupBtn.addEventListener("click", () => {
  if (groups.length === 1) {
    alert("At least one group must remain.");
    return;
  }

  groups.splice(currentGroupIndex, 1);
  currentGroupIndex = 0;
  currentCardIndex = 0;
  showingAnswer = false;

  renderGroupList();
  renderStudyCard();
  renderListView();
  showView(studyView);
});

renderGroupList();
renderStudyCard();
renderListView();
showView(studyView);