let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameMode = null;
let difficulty = null;
let xWins = 0;
let oWins = 0;

const xSound = document.getElementById("x-sound");
const oSound = document.getElementById("o-sound");

function playMarkSound(player) {
  if (soundsEnabled) {
    if (player === "X") {
      xSound.play();
    } else if (player === "O") {
      oSound.play();
    }
  }
}

function setMode(mode) {
  gameMode = mode;
  if (mode === "computer") {
    showDifficultySelection();
  } else {
    document.querySelector("#game-board").style.pointerEvents = "auto";
    resetBoard();
  }
}

function showDifficultySelection() {
  document.getElementById("mode-selection").classList.add("hidden"); 
  document.getElementById("difficulty-selection").classList.remove("hidden");
}

function setDifficulty(level) {
  difficulty = level;
  document.getElementById("difficulty-selection").classList.add("hidden"); 
  document.querySelector("#game-board").style.pointerEvents = "auto";
  resetBoard();
}

function makeMove(cell, row, col) {
  if (board[row][col] === "" && gameMode) {
    board[row][col] = currentPlayer;  
    cell.textContent = currentPlayer; 
    currentPlayer === "X" ? xSound.play() : oSound.play();

    if (checkWinner(currentPlayer)) {
      showWinnerMessage(`${currentPlayer} gana!`);
      updateScore(currentPlayer);
    } else if (isBoardFull()) {
      showWinnerMessage("¡Es un empate!");
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (gameMode === "computer" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
      }
    }
  }
}

function computerMove() {
  if (difficulty === "easy") {
    easyComputerMove();
  } else if (difficulty === "medium") {
    mediumComputerMove();
  } else if (difficulty === "hard") {
    hardComputerMove();
  }
}

function easyComputerMove() {
  let emptyCells = getEmptyCells();
  let randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)]; 
  const cellIndex = randomMove.row * 3 + randomMove.col;
  const cell = document.querySelectorAll(".cell")[cellIndex];
  makeMove(cell, randomMove.row, randomMove.col); 
}

function mediumComputerMove() {
  let bestMove = getWinningMove("O") || getBlockMove("X") || getRandomMove();
  const cellIndex = bestMove.row * 3 + bestMove.col;
  const cell = document.querySelectorAll(".cell")[cellIndex];
  makeMove(cell, bestMove.row, bestMove.col);
}

function getWinningMove(player) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        board[i][j] = player;
        if (checkWinner(player)) {
          board[i][j] = "";
          return { row: i, col: j };
        }
        board[i][j] = "";
      }
    }
  }
  return null;
}

function getBlockMove(player) {
  return getWinningMove(player === "X" ? "O" : "X");
}

function hardComputerMove() {
  let bestMove = minimax(board, "O").position;
  const cellIndex = bestMove.row * 3 + bestMove.col;
  const cell = document.querySelectorAll(".cell")[cellIndex];
  makeMove(cell, bestMove.row, bestMove.col);
}

function getEmptyCells() {
  return board.flatMap((row, i) =>
    row
      .map((cell, j) => (cell === "" ? { row: i, col: j } : null))
      .filter(Boolean)
  );
}

function minimax(board, player) {
  if (checkWinner("O")) return { score: 10 };
  if (checkWinner("X")) return { score: -10 };
  if (isBoardFull()) return { score: 0 };

  const moves = [];
  getEmptyCells().forEach(({ row, col }) => {
    board[row][col] = player;
    const result = minimax(board, player === "O" ? "X" : "O");
    moves.push({ score: result.score, position: { row, col } });
    board[row][col] = "";
  });

  return player === "O"
    ? moves.reduce((best, move) => (move.score > best.score ? move : best))
    : moves.reduce((best, move) => (move.score < best.score ? move : best));
}

function checkWinner(player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every((cell) => cell === player)) return true;
    if (board.map((row) => row[i]).every((cell) => cell === player)) return true;
  }

  return (
    (board[0][0] === player &&
      board[1][1] === player &&
      board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)
  );
}

function isBoardFull() {
  return board.flat().every((cell) => cell !== "");
}

function showWinnerMessage(message) {
  const messageDiv = document.getElementById("winner-message");
  messageDiv.textContent = message;
  messageDiv.classList.remove("hidden");
  setTimeout(resetBoard, 2000);
}

function updateScore(player) {
  if (player === "X") document.getElementById("x-wins").textContent = ++xWins;
  else document.getElementById("o-wins").textContent = ++oWins;
}

function resetBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  document.getElementById("winner-message").classList.add("hidden");
}

function resetGame() {
  resetBoard();
  document.getElementById("mode-selection").classList.remove("hidden"); 
  document.getElementById("difficulty-selection").classList.add("hidden");
  document.querySelector("#game-board").style.pointerEvents = "none";
  gameMode = null;
  difficulty = null;
}

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", function () {
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));
    if (gameMode !== null && board[row][col] === "") {
      makeMove(cell, row, col);
    }
  });
});

function toggleHelpModal() {
  const modal = document.getElementById("help-modal");
  modal.classList.toggle("hidden");
}