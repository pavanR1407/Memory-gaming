document.addEventListener("DOMContentLoaded", () => {

  // DOM elements
  const landingPage = document.getElementById("landing-page");
  const gameContainer = document.getElementById("game-container");
  const startBtn = document.getElementById("start-game");
  const difficultySelect = document.getElementById("difficulty");
  const board = document.getElementById("game-board");
  const movesCounter = document.getElementById("moves");
  const popup = document.getElementById("win-popup");
  const winMessage = document.getElementById("win-message");
  const playAgainBtn = document.getElementById("play-again");
  const restartBtn = document.getElementById("restart");

  // Game variables
  const allIcons = ["🍎","🍌","🍓","🍇","🥑","🍒","🍍","🥭","🥝","🥥","🍉","🍋","🍊","🍐","🍏","🍑"];
  let selectedPairs = 8;
  let cards = [];
  let moves = 0;
  let flippedCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let totalPairs = selectedPairs;

  // Audio
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playFlipSound() {
    const osc = audioCtx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }
  function playWinSound() {
    const notes = [400,500,600,700];
    let startTime = audioCtx.currentTime;
    notes.forEach((freq,i)=>{
      const osc = audioCtx.createOscillator();
      osc.type="sine";
      osc.frequency.setValueAtTime(freq,startTime+i*0.15);
      osc.connect(audioCtx.destination);
      osc.start(startTime+i*0.15);
      osc.stop(startTime+(i+1)*0.15);
    });
  }

  // Shuffle
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Start game
  function startGame() {
    moves = 0;
    flippedCard = null;
    lockBoard = false;
    matchedPairs = 0;
    movesCounter.textContent = "Moves: 0";
    board.innerHTML = "";

    const selectedIcons = shuffle([...allIcons]).slice(0, selectedPairs);
    cards = [...selectedIcons, ...selectedIcons];
    cards = shuffle(cards);
    totalPairs = selectedPairs;

    cards.forEach(icon=>{
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML=`
        <div class="card-inner">
          <div class="card-back">❓</div>
          <div class="card-front">${icon}</div>
        </div>`;
      card.addEventListener("click", flipCard);
      board.appendChild(card);
    });

    if(selectedPairs <= 8) board.style.gridTemplateColumns="repeat(4,100px)";
    else if(selectedPairs <= 12) board.style.gridTemplateColumns="repeat(6,100px)";
    else board.style.gridTemplateColumns="repeat(8,100px)";
  }

  // Flip card
  function flipCard(){
    if(lockBoard || this.classList.contains("flipped")) return;
    this.classList.add("flipped");
    playFlipSound();
    if(!flippedCard){ flippedCard=this; return; }
    checkMatch(this);
  }

  function checkMatch(secondCard){
    const firstIcon = flippedCard.querySelector(".card-front").textContent;
    const secondIcon = secondCard.querySelector(".card-front").textContent;
    if(firstIcon===secondIcon){
      matchedPairs++;
      flippedCard=null;
      checkWin();
    } else {
      lockBoard=true;
      setTimeout(()=>{
        flippedCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        flippedCard=null;
        lockBoard=false;
      },1000);
    }
    moves++;
    movesCounter.textContent=`Moves: ${moves}`;
  }

  function checkWin(){
    if(matchedPairs===totalPairs){
      winMessage.textContent=`🎉 You won in ${moves} moves! 🎉`;
      popup.style.display="flex";
      playWinSound();
      const popupContent = popup.querySelector(".popup-content");
      popupContent.style.animation="none";
      void popupContent.offsetWidth;
      popupContent.style.animation="popIn 0.5s forwards";
    }
  }

  // Event listeners
  startBtn.addEventListener("click", ()=>{
    selectedPairs = difficultySelect.value==="easy"?8:difficultySelect.value==="medium"?12:16;
    landingPage.style.display="none";
    gameContainer.style.display="block";
    startGame();
  });
  restartBtn.addEventListener("click", ()=>window.location.reload());
  playAgainBtn.addEventListener("click", ()=>window.location.reload());
});
