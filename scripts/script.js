const cardsWrapper = document.querySelector("#cards-wrapper .wrapper"),
  playButton = document.querySelector("#play"),
  popUpWrapper = document.querySelector("#pop-up"),
  popUpTitle = document.querySelector("#pop-up h2"),
  flipsWrapper = document.querySelector("#flips"),
  timerWrapper = document.querySelector("#timer"),
  confettiCanvas = document.querySelector("#confetti");

const confetti = new JSConfetti({ canvas: confettiCanvas });

const CARDSDATA = [
  {
    image: "./assets/images/han.png",
    name: "han solo",
    type: "normal",
  },
  {
    image: "./assets/images/jinn.png",
    name: "qui-gon jinn",
    type: "jedi",
  },
  {
    image: "./assets/images/kenobi.png",
    name: "obi-wan kenobi",
    type: "jedi",
  },
  {
    image: "./assets/images/luke.png",
    name: "luke skywalker",
    type: "jedi",
  },
  {
    image: "./assets/images/sith.png",
    name: "lord sith",
    type: "sith",
  },
  {
    image: "./assets/images/yoda.png",
    name: "mestre yoda",
    type: "jedi",
  },
];

let firstCard,
  secondCard,
  isLockedBoard = false,
  flips = 0,
  timer = 0;

const generateCards = () => {
  shuffle([...CARDSDATA, ...CARDSDATA]).forEach((card) => {
    const cardHTML = document.createElement("div");
    cardHTML.classList.add("card");
    cardHTML.setAttribute("data-name", card.name);
    cardHTML.setAttribute("data-type", card.type);
    cardHTML.addEventListener("click", flipCard);

    cardHTML.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
        <p>${card.name}</p>
      </div>
      <div class="back">
        <img src="./assets/icons/star-wars.svg" alt="star wars icon" />
      </div>
    `;

    cardsWrapper.appendChild(cardHTML);
  });
};

const shuffle = (array) => {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

const flipCard = (event) => {
  const element = event.currentTarget;
  if (isLockedBoard || element === firstCard) return;

  element.classList.add("flipped");
  updateFlipCounter();

  if (!firstCard) {
    firstCard = element;
    return;
  }
  secondCard = element;
  isLockedBoard = true;

  checkIsFinished();
  checkIsMatched();
};

const checkIsMatched = () => {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableMatchedCards() : unflipCards();
};

const updateFlipCounter = (isAdding = true) => {
  isAdding && flips++;
  const flipsPadded = flips.toString().padStart(2, "0");
  flipsWrapper.textContent = flipsPadded;
};

const checkIsFinished = () => {
  const cards = Array.from(cardsWrapper.querySelectorAll(".card"));

  let counterOfMatches = 0;
  cards.forEach((card) => {
    card.classList.contains("flipped") && counterOfMatches++;
  });

  if (counterOfMatches == CARDSDATA.length * 2) winGame();
  return counterOfMatches == CARDSDATA.length * 2;
};

const createConfetti = () => {
  confetti.addConfetti({
    confettiColors: ["#ffee32"],
    confettiNumber: 500,
  });
};

const unflipCards = () => {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetBoard();
  }, 1000);
};

const disableMatchedCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
};

const startTimer = () => {
  const interval = setInterval(() => {
    const minutes = parseInt(timer / 60, 10)
      .toString()
      .padStart(2, "0");
    const seconds = parseInt(timer % 60, 10)
      .toString()
      .padStart(2, "0");

    timerWrapper.textContent = `${minutes}:${seconds}`;
    timer--;

    if (checkIsFinished() || timer < 0) {
      clearInterval(interval);
    }

    timer < 0 && lostGame();
  }, 1000);
};

const winGame = () => {
  popUpTitle.innerHTML = `você usou bem a força, mestre,<br /> sua quantidade de flipadas foi: ${flips}`;
  popUpWrapper.setAttribute("data-state", "opened");
  createConfetti();
};

const lostGame = () => {
  resetBoard();
  flips = 0;
  timer = 0;

  popUpWrapper.setAttribute("data-state", "opened");
  popUpWrapper.querySelector(
    "h2"
  ).innerHTML = `seu tempo acabou, jovem padawan, precisa treinar mais a força`;
};

const resetBoard = () => {
  firstCard = null;
  secondCard = null;
  isLockedBoard = false;
};

const resetGame = () => {
  flips = 0;
  timer = 30;
  cardsWrapper.innerHTML = "";
  popUpWrapper.setAttribute("data-state", "closed");
};

const playGame = () => {
  resetGame();
  startTimer();
  updateFlipCounter(false);
  resetBoard();
  generateCards();
};

generateCards();

playButton.addEventListener("click", () => {
  playGame();
});
