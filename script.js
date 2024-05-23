const cardsArray = [
    { name: 'A', value: 'A' },
    { name: 'A', value: 'A' },
    { name: 'B', value: 'B' },
    { name: 'B', value: 'B' },
    { name: 'C', value: 'C' },
    { name: 'C', value: 'C' },
    { name: 'D', value: 'D' },
    { name: 'D', value: 'D' },
    { name: 'E', value: 'E' },
    { name: 'E', value: 'E' },
    { name: 'F', value: 'F' },
    { name: 'F', value: 'F' },
    { name: 'G', value: 'G' },
    { name: 'G', value: 'G' },
    { name: 'H', value: 'H' },
    { name: 'H', value: 'H' }
];

const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const clicksElement = document.getElementById('clicks');
const mismatchesElement = document.getElementById('mismatches');
const timeElement = document.getElementById('time');
let firstCard, secondCard;
let lockBoard = false;
let hasFlippedCard = false;
let matchesFound = 0;
let clicks = 0;
let mismatches = 0;
let startTime;
let timerInterval;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    shuffle(cardsArray);
    gameBoard.innerHTML = '';
    cardsArray.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card.value;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    startTimer();
}

function startTimer() {
    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timeElement.textContent = `Time: ${elapsedTime}s`;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;

    clicks++;
    clicksElement.textContent = `Clicks: ${clicks}`;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
        matchesFound++;
        if (matchesFound === cardsArray.length / 2) {
            clearInterval(timerInterval);
            setTimeout(() => alert(`You found all matches in ${clicks} clicks with ${mismatches} mismatches and time taken: ${timeElement.textContent.split(' ')[1]}`), 500);
        }
        return;
    }

    mismatches++;
    mismatchesElement.textContent = `Mismatches: ${mismatches}`;
    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

restartButton.addEventListener('click', () => {
    matchesFound = 0;
    clicks = 0;
    mismatches = 0;
    clicksElement.textContent = 'Clicks: 0';
    mismatchesElement.textContent = 'Mismatches: 0';
    timeElement.textContent = 'Time: 0s';
    createBoard();
});

createBoard();
