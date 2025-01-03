// Select draggable items, sentence container, Check button, and modal elements
const draggableItems = document.querySelectorAll('.item');
const sentenceContainer = document.getElementById('sentenceContainer');
const checkButton = document.querySelector('.btn');
const alertModal = document.getElementById('alertModal');
const alertMessage = document.getElementById('alertMessage');
const closeModalButton = document.getElementById('closeModal');

// Define the correct sentence structure
const validStructure = ['article', 'adjective', 'noun', 'verb'];

// Mapping of words to their types
const wordTypes = {
    A: 'article',
    The: 'article',
    big: 'adjective',
    small: 'adjective',
    cute: 'adjective',
    playful: 'adjective',
    dog: 'noun',
    cat: 'noun',
    boy: 'noun',
    girl: 'noun',
    jumps: 'verb',
    smiles: 'verb',
    hides: 'verb',
};

// Variables for touch handling
let draggedElement = null;

// Add drag-and-drop and touch event listeners to draggable items
draggableItems.forEach(item => {
    // Desktop drag-and-drop events
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);

    // Mobile touch events
    item.addEventListener('touchstart', touchStart);
    item.addEventListener('touchmove', touchMove);
    item.addEventListener('touchend', touchEnd);
});

// Add event listeners to the sentence container
sentenceContainer.addEventListener('dragover', dragOver);
sentenceContainer.addEventListener('drop', drop);

// Add event listener to the Check button
checkButton.addEventListener('click', checkSentence);

// Add event listener to the Close button in the modal
closeModalButton.addEventListener('click', hideModal);

// Drag-and-drop functions (desktop)
function dragStart(event) {
    draggedElement = event.target;
    event.dataTransfer.setData('text/plain', event.target.textContent);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    draggedElement = null;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const text = event.dataTransfer.getData('text/plain');
    if (text) {
        addWordToContainer(text);
    }
}

// Touch functions (mobile)
function touchStart(event) {
    draggedElement = event.target;
    draggedElement.classList.add('dragging');
}

function touchMove(event) {
    event.preventDefault(); // Prevent scrolling while dragging
    const touch = event.touches[0];
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${touch.pageX}px`;
    draggedElement.style.top = `${touch.pageY}px`;
}

function touchEnd(event) {
    const touch = event.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget && dropTarget.id === 'sentenceContainer') {
        addWordToContainer(draggedElement.textContent);
    }

    // Reset the dragged element's position
    draggedElement.style.position = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';
    draggedElement.classList.remove('dragging');
    draggedElement = null;
}

// Helper function to add a word to the sentence container
function addWordToContainer(word) {
    const newWord = document.createElement('span');
    newWord.textContent = word;
    newWord.className = 'sentence-item';
    newWord.style.marginRight = '8px';
    sentenceContainer.appendChild(newWord);
}

// Function to check the sentence
function checkSentence() {
    const sentenceWords = Array.from(sentenceContainer.querySelectorAll('.sentence-item')).map(item => item.textContent);
    const sentenceTypes = sentenceWords.map(word => wordTypes[word]);

    if (sentenceTypes.length !== validStructure.length) {
        showModal('Invalid sentence! Please use exactly one article, adjective, noun, and verb.');
        return;
    }

    const isValid = sentenceTypes.every((type, index) => type === validStructure[index]);
    if (isValid) {
        showModal('Correct sentence! 🎉');
    } else {
        showModal('Incorrect sentence! Please follow the structure: Article -> Adjective -> Noun -> Verb.');
    }
}

// Modal management functions
function showModal(message) {
    alertMessage.textContent = message;
    alertModal.classList.add('visible');
}

function hideModal() {
    alertModal.classList.remove('visible');
}
