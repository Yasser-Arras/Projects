// ==========================
// MEMORY CARD GAME
// ==========================

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const difficultySelect = document.getElementById('difficulty');
const restartBtn = document.getElementById('restartBtn');
const timerDisplay = document.getElementById('timer');
const clicksDisplay = document.getElementById('clicks');

// Game state
let rows, cols;
let firstCard = null, secondCard = null;
let clicks = 0, matches = 0;
let timer = 0, timerInterval = null;
let timerStarted = false;
let globalColor = '';
let canclick = true;

// --------------------------
// IMAGE and SOUNDS
// --------------------------
const images = [
  'images/apple.png',
  'images/cherries.png',
  'images/grapes.png',
  'images/lemon.png',
  'images/orange.png',
  'images/pear.png',
  'images/strawberry.png',
  'images/tomato.png',
  'images/watermelon.png'
];
const sounds = {
  flip: new Audio('sounds/flip.ogg'),
  match: new Audio('sounds/match.ogg'),
  win: new Audio('sounds/win.ogg')
};
// --------------------------
// HINT SYSTEM
// --------------------------
let hintCD = false; // false = hint ready, true = on cooldown
let hintTimeout = null;
const hintBtn = document.getElementById('hintBtn');

function showHint() {
  if (hintCD) return; 

  hintCD = true; 
  canclick = false; 
  updateHintBtn();
  const allCards = document.querySelectorAll('.card');

  allCards.forEach(card => card.classList.add('flipped'));

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flipped'));
   
  }, 3000);

  
  hintTimeout = setTimeout(() => {
    hintCD = false;
  }, 60000);
}
function updateHintBtn() {
  hintBtn.style.backgroundColor = hintCD ? 'gray' : 'green';
  hintBtn.style.cursor = hintCD ? 'not-allowed' : 'pointer';
}
// --------------------------
// UTILITY FUNCTIONS
// --------------------------

// Shuffle an array in place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate a random pastel-ish color
function randomColor() {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgb(${r},${g},${b})`;
}

// Darken a color by a factor for back of cards
function darkenColor(rgb, factor) {
  const vals = rgb.match(/\d+/g).map(Number);
  return `rgb(${Math.floor(vals[0]*factor)},${Math.floor(vals[1]*factor)},${Math.floor(vals[2]*factor)})`;
}

// --------------------------
// TIMER FUNCTIONS
// --------------------------
function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Temps: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0; 
    sounds[type].play();
  }
}
// --------------------------
// GAME INITIALIZATION
// --------------------------
function initGame() {
  // Reset board and state
  if (hintTimeout) clearTimeout(hintTimeout);
  hintCD = false;
  canclick = true;
  updateHintBtn();
  gameBoard.innerHTML = '';
  firstCard = null; secondCard = null;
  clicks = 0; matches = 0;
  clicksDisplay.textContent = `Clics: ${clicks}`;
  timerDisplay.textContent = `Temps: 0s`;
  timerStarted = false;
  clearInterval(timerInterval);

  // Set grid size based on difficulty
  const diff = difficultySelect.value;
  if (diff === 'easy') { rows = 5; cols = 5; }
  else if (diff === 'medium') { rows = 6; cols = 6; }
  else { rows = 8; cols = 8; }

  const totalCards = rows * cols;

  // Ensure even number of cards
  if (totalCards % 2 !== 0) {
    cols += 1; // add a column if odd
  }

  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 60px)`;

  // Pick global color
  globalColor = randomColor();

  // Prepare card images with pairs
  const neededPairs = Math.ceil((rows*cols)/2);
  const selectedImages = [];
  for (let i = 0; i < neededPairs; i++) {
    const img = images[i % images.length]; // cycle through available images
    selectedImages.push(img, img); // add pair
  }

  // Shuffle the full set
  const cardImages = shuffleArray(selectedImages);

  // Create the card elements
  cardImages.forEach(src => createCard(src));
}

// --------------------------
// CREATE CARD
// --------------------------
function createCard(src) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.image = src;

  const inner = document.createElement('div');
  inner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  front.textContent = '?';
  front.style.backgroundColor = globalColor;

  const back = document.createElement('div');
  back.classList.add('card-back');
  back.style.backgroundColor = darkenColor(globalColor, 0.7);

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'icon';
  back.appendChild(img);

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);
  gameBoard.appendChild(card);

  // Add click event
  card.addEventListener('click', () => flipCard(card));
}

// --------------------------
// FLIP CARD
// --------------------------
function flipCard(card) {
  if (card.classList.contains('flipped') || secondCard) return;

  // Start timer at first click
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  card.classList.add('flipped');


  clicks++;
  clicksDisplay.textContent = `Clics: ${clicks}`;

  if (!firstCard) { firstCard = card;  playSound('flip'); }
  else { secondCard = card; checkMatch(); }
}

// --------------------------
// CHECK MATCH
// --------------------------
function checkMatch() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    matches += 2;
   setTimeout(() => {
      playSound('match');
    }, 100);
    firstCard = null; secondCard = null;
    if (matches === rows*cols) {
      stopTimer();
      setTimeout(() => alert(`Gagné! Temps: ${timer}s, Clics: ${clicks}`), 200);
      playSound('win');
    }
  } else {
    
      playSound('flip');
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = null; secondCard = null;
    }, 800);
  }
}

// --------------------------
// EVENT LISTENERS
// --------------------------
restartBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', initGame);
hintBtn.addEventListener('click', showHint);
// Start the first game
initGame();