// Drag-and-drop logic
const sortableList = document.querySelector(".sortable-list");
const items = sortableList.querySelectorAll(".item");
const correctOrder = ["para1", "para2", "para3", "para4", "para5", "para6", "para7", "para8", "para9", "para10"];
const correctAnswers = {
  "input1_1": "orphan", "input1_2": "hero", "input1_3": "scholar",
  "input2_1": "without a father", 
  "input3_1": "every day", "input3_2": "carted away", "input3_3": "across the waves", "input3_4": "kept his guard up", 
  "input4_1": "dripping down", 
  "input5_1": "the word", 
  "input7_1": "split", "input7_2": "committed suicide", 
  "input8_1": "started workin'", "input8_2": "the bow"
};

// Drag start: keep track of the item being dragged
items.forEach(item => {
    item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
});

// Initialize sortable list
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });
    if (!nextSibling) {
        sortableList.appendChild(draggingItem);
    } else {
        sortableList.insertBefore(draggingItem, nextSibling);
    }
}

sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());

// Button click event to check order and answers
document.getElementById('checkOrderBtn').addEventListener('click', function() {
  const listItems = document.querySelectorAll('.sortable-list .item');
  const blanks = document.querySelectorAll('input.blank');
  let isInOrder = true;
  let areBlanksCorrect = true;

  // Checking list order with correctOrder array
  for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].id !== correctOrder[i]) {
          isInOrder = false;
      }
  }

  // Checking blanks with correctAnswers object (matching input IDs)
  blanks.forEach(blank => {
      const inputId = blank.id;
      if (blank.value !== correctAnswers[inputId]) {
          areBlanksCorrect = false;
      }
  });

  const popupModal = document.getElementById('popupModal');
  const popupMessage = document.getElementById('popupMessage');

  if (isInOrder && areBlanksCorrect) {
      popupMessage.textContent = 'The list is in the correct order, and all blanks are correct!';
  } else if (!isInOrder && !areBlanksCorrect) {
      popupMessage.textContent = 'The list is not in the correct order, and the blanks are incorrect.';
  } else if (!isInOrder) {
      popupMessage.textContent = 'The list is not in the correct order.';
  } else if (!areBlanksCorrect) {
      popupMessage.textContent = 'Some blanks are incorrect.';
  }

  popupModal.style.display = 'flex';
});

// Close the popup modal
document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('popupModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const popupModal = document.getElementById('popupModal');
  if (event.target === popupModal) {
      popupModal.style.display = 'none';
  }
});

// Modal opening/closing logic for login and register
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');

// Event listeners to open modals
loginLink.addEventListener('click', () => loginModal.style.display = 'flex');
registerLink.addEventListener('click', () => registerModal.style.display = 'flex');

// Event listeners to close modals
closeLoginModal.addEventListener('click', () => loginModal.style.display = 'none');
closeRegisterModal.addEventListener('click', () => registerModal.style.display = 'none');

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
});
