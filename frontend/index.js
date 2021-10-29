const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';
var gameID = "";
var targetPod = "";



const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');


// const serverButton = document.getElementById('serverCodeButton');
// const serverCodeInput = document.getElementById('serverCode');
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
// serverButton.addEventListener('click', processServer);
var socket;

function createSocket() {
   gameID = targetPod ? `/?gameID=${targetPod}`: "";
   console.log(gameID);
   socket = io(`ws://192.168.89.107:80${gameID}`, {
 
  });
 
 socket.on('init', handleInit);
 socket.on('gameState', handleGameState);
 socket.on('gameOver', handleGameOver);2
 socket.on('gameCode', handleGameCode);
 socket.on('unknownCode', handleUnknownCode);
 socket.on('tooManyPlayers', handleTooManyPlayers);

}

// function processServer() {
//   gameID = "/?gameID="+serverCodeInput.value;
//   console.log(gameID);
//   newGame();

// }

function newGame() {
  createSocket();

  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  targetPod = code.substring(0, code.lastIndexOf('x'));
  console.log("targetPod is:" +targetPod);

  createSocket();
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {

  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);
  gameActive = true;
}

function keydown(e) {
  socket.emit('keydown', e.keyCode);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOUR);
  paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
