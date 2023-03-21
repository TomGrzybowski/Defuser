'use strict';
const game = document.querySelector('.defuser__game'); //this is the main gameplay window
const inputs = document.querySelectorAll('input');
let rows = Number(document.querySelector('#defuser__rows').value); //check for input how many rows
let cols = Number(document.querySelector('#defuser__cols').value); //check for input how many cols
let bombsAmount = Number(document.querySelector('#defuser__bombs').value); //check for input how many cols
const selectRows = document.querySelectorAll('.defuser__row'); //selects all created rows
const playButton = document.querySelector('#defuser__play'); //Select PLAY button
const hiders = document.querySelectorAll('.unrevealed');
const cellsObj = {}; //This object will hold all cell coordinates and value true if it is revealed. It will be used to asses win condition
const backdrop = document.querySelector('.backdrop');
const victoryScreen = document.querySelector('.victory');
const defeatScreen = document.querySelector('.defeat');
const closeBtn = document.querySelector('.close-btn');

let won = false;
let bombsLeft = bombsAmount;

game.addEventListener('click', hideHider);
game.addEventListener('contextmenu', flager);
closeBtn.addEventListener('click', closeModal);

inputs.forEach(input => {
  //add event listeners to inputs
  input.addEventListener('change', handleUpdate);
});

playButton.addEventListener('click', setup); //add event listener to play button

function hideHider(e) {
  const hiderBox = e.target;
  if (hiderBox.classList[0] === 'unrevealed') {
    //execute only if the hider is clicked
    hiderBox.classList.add('is-hidden');

    const selectedCell = hiderBox.parentElement;

    if (isBomb(selectedCell)) {
      //Execute only if lost
      lost(selectedCell);
      return;
    }

    const selectedCol = Number(selectedCell.classList[1].split('-')[1]); //find column nr
    const selectedRow = Number(
      selectedCell.closest('.defuser__row').classList[1].split('-')[1]
    );
    cellsObj[`cell-${selectedRow}-${selectedCol}`] = true;

    if (selectedCell.textContent === '') {
      revealNearEmpty(selectedCell);
    }

    if (checkWinCondition()) {
      win();
    }
  }
}

function closeModal() {
  backdrop.classList.add('is-hidden');
  victoryScreen.classList.add('is-hidden');
  defeatScreen.classList.add('is-hidden');

  if (!won) {
    setup();
  }
  if (won) {
    won = false;
  }
}
//This function reveals everything around empty cells
function revealNearEmpty(selectedCell) {
  const emptyCol = Number(selectedCell.classList[1].split('-')[1]); //find column nr
  const emptyRow = Number(
    selectedCell.closest('.defuser__row').classList[1].split('-')[1]
  );

  for (let i = emptyRow - 1; i <= emptyRow + 1; i++) {
    if (i < 1 || i > rows) continue; //exclude places out of playing field
    for (let j = emptyCol - 1; j <= emptyCol + 1; j++) {
      if (j < 1 || j > cols) continue; //exclude places out of playing field
      if (j === emptyCol && i === emptyRow) continue; //exclude central cell
      const currentCell = document.querySelector(`.row-${i} > .col-${j}`);
      let currentCellContent = currentCell.childNodes[0].textContent;

      cellsObj[`cell-${i}-${j}`] = true;
      if (!currentCell.childNodes[1].classList.contains('is-hidden')) {
        currentCell.childNodes[1].classList.add('is-hidden');
      } else {
        continue;
      }

      if (currentCellContent === '') {
        revealNearEmpty(currentCell);
      }
    }
  }
}

function checkWinCondition() {
  const areTrue = Object.values(cellsObj).every(value => value === true);
  return areTrue;
}

//Execute if player lost (stepped on a bomb)
function lost(selectedCell) {
  selectedCell.style.backgroundColor = 'red';

  backdrop.classList.remove('is-hidden');
  defeatScreen.classList.remove('is-hidden');
}

//Execute if player won (discovered all non-bomb tiles)
function win() {
  won = true;
  backdrop.classList.remove('is-hidden');
  victoryScreen.classList.remove('is-hidden');
}

//Helper function to check if the selected cell contains a bomb
function isBomb(selectedCell) {
  if (
    selectedCell.firstChild.firstChild &&
    Number(selectedCell.textContent) < 1
  ) {
    //Execute only if lost
    return true;
  }
  return false;
}

//Adds flag with a right click
function flager(e) {
  const hiderBox = e.target;
  e.preventDefault();

  if (hiderBox.classList[0] === 'unrevealed') {
    //execute only if the hider is clicked
    const svg = document.createElement('i');
    svg.classList.add('fa-solid');
    svg.classList.add('fa-flag');
    hiderBox.append(svg);
    bombsLeft -= 1;
    updateBombsLeft();
  } else if (hiderBox.classList[1] === 'fa-question') {
    e.preventDefault();
    hiderBox.parentElement.innerHTML = '';
  } else if (hiderBox.classList[1] === 'fa-flag') {
    e.preventDefault();
    hiderBox.classList.add('fa-question');
    hiderBox.classList.remove('fa-flag');
    bombsLeft += 1;
    updateBombsLeft();
  }
}

function updateBombsLeft() {
  const counter = document.querySelector('.defuser__bomb_counter_span');

  if (bombsLeft > 0) {
    counter.textContent = bombsLeft;
  } else {
    counter.textContent = 0;
  }
}

function handleUpdate() {
  rows = document.querySelector('#defuser__rows').value;
  cols = document.querySelector('#defuser__cols').value;
  bombsAmount = document.querySelector('#defuser__bombs').value;
}

function createGrid() {
  const headerRow = document.createElement('div');
  headerRow.classList.add('defuser__header');

  const bombCounter = document.createElement('p');
  bombCounter.classList.add('defuser__bomb_counter');
  bombCounter.textContent = `Bombs left: `;

  const bombCounterSpan = document.createElement('span');
  bombCounterSpan.classList.add('defuser__bomb_counter_span');
  bombCounterSpan.textContent = `${bombsLeft}`;

  bombCounter.append(bombCounterSpan);
  headerRow.append(bombCounter);

  game.append(headerRow);
  for (let i = 1; i <= rows; i++) {
    // Create rows loop
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('defuser__row'); //add universal class
    rowDiv.classList.add('row-' + i); //add numered class
    game.append(rowDiv);

    for (let ii = 1; ii <= cols; ii++) {
      //Create cells within rows
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('defuser__cell'); //add universal class
      cellDiv.classList.add('col-' + ii); //add numered class
      cellsObj[`cell-${i}-${ii}`] = false;

      rowDiv.append(cellDiv); //create the cell

      const span = document.createElement('span'); //create a content element
      span.classList.add('defuser__cell_content'); //add universal class

      cellDiv.append(span);

      const hiderDiv = document.createElement('div'); //create a hider
      hiderDiv.classList.add('unrevealed'); //add universal class

      cellDiv.append(hiderDiv); //add hidder
    }
  }
}

function insertBombs() {
  const bombs = new Set();

  while (bombs.size < bombsAmount) {
    let rowNr = Math.floor(Math.random() * rows) + 1;
    let colNr = Math.floor(Math.random() * cols) + 1;
    bombs.add(`${rowNr} - ${colNr}`);
    delete cellsObj[`cell-${rowNr}-${colNr}`];
  }

  bombsLeft = bombs.size;
  updateBombsLeft();

  bombs.forEach(el => {
    //Adds a bomb to each randomized bomb location
    const svg = document.createElement('i');

    svg.classList.add('fa-solid');
    svg.classList.add('fa-bomb');

    const arr = el.split(' - ');
    const row = document.querySelector('.row-' + arr[0]);
    const col = row.querySelector('.col-' + arr[1]);

    col.firstChild.append(svg);
  });
}

// a subfunction for inserting numbers into the grid
function iterateNearBombs(bombRow, bombCol) {
  for (let i = bombRow - 1; i <= bombRow + 1; i++) {
    if (i < 1 || i > rows) continue; //exclude places out of playing field
    for (let j = bombCol - 1; j <= bombCol + 1; j++) {
      if (j < 1 || j > cols) continue; //exclude places out of playing field
      if (j === bombCol && i === bombRow) continue;
      const currentCell = document.querySelector(`.row-${i} > .col-${j}`);
      let currentCellContent = currentCell.childNodes[0].textContent;

      if (isBomb(currentCell)) continue;
      if (currentCellContent === '') {
        currentCell.childNodes[0].textContent = 1;
      } else {
        currentCell.childNodes[0].textContent = String(
          Number(currentCell.childNodes[0].textContent) + 1
        );
      }
    }
  }
}

//A function that inserts into each cell value showing how many bombs are in near proximity
function numbersSetup() {
  const cells = document.querySelectorAll('.defuser__cell');

  cells.forEach(el => {
    if (isBomb(el)) {
      const bombCol = Number(el.classList[1].split('-')[1]); //find bomb column nr
      const bombRow = Number(
        el.closest('.defuser__row').classList[1].split('-')[1]
      ); // find bomb row nr
      iterateNearBombs(bombRow, bombCol);
    }
  });
}

function checkSettings() {
  const rowsLimit = Number(document.querySelector('#defuser__rows').max);
  const colsLimit = Number(document.querySelector('#defuser__cols').max);
  const bombsAmountLimit = Number(
    document.querySelector('#defuser__bombs').max
  );

  if (bombsAmount > rows * cols - 1) {
    return true;
  }

  if (rows > rowsLimit || cols > colsLimit || bombsAmount > bombsAmountLimit) {
    return true;
  }
  if (0 > rows || 0 > cols || 0 > bombsAmount) {
    return true;
  }

  return false;
}

//Sets up the playing field
function setup() {
  game.innerHTML = ''; // clear content

  checkSettings();
  if (checkSettings()) {
    alert(
      'Current settings do not allow to setup a game. Please Try adjusting the board size or amount of bombs.'
    );
    game.textContent =
      'Current settings do not allow to setup a game. Please Try adjusting the board size or amount of bombs.';
    return;
  }
  createGrid();
  insertBombs();
  numbersSetup();
}

setup();
