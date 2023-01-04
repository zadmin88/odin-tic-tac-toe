const fields = document.querySelectorAll(".field");

const Player = (name, mark, itsTime) => {
  let movement;
  let turn = itsTime;

  const getMark = () => mark;
  const getName = () => name;
  const getTurn = () => turn;

  const makeMove = (position) => {
    movement = position;
    // return movement;
  };

  const setTurn = (itsTime) => (turn = itsTime);

  const getMovement = () => movement;

  return { getName, getMark, makeMove, getMovement, getTurn, setTurn };
};

const Gameboard = (() => {
  let gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let validMove;
  let gameIsOver = false;

  const addMove = (player) => {
    if (gameboard[player.getMovement()[0]][[player.getMovement()[1]]] === "") {
      gameboard[player.getMovement()[0]][[player.getMovement()[1]]] =
        player.getMark();
      validMove = true;
    } else {
      validMove = false;
    }
  };

  const getValidMove = () => validMove;

  const checkGame = (player) => {
    const columns = [[], [], []];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        columns[i].push(gameboard[j][i]);
      }
    }

    if (!gameIsOver) {
      if (
        gameboard[0].every((v) => v === gameboard[0][0] && v !== "") ||
        gameboard[1].every((v) => v === gameboard[1][0] && v !== "") ||
        gameboard[2].every((v) => v === gameboard[2][0] && v !== "")
      ) {
        gameIsOver = true;

        return `the winner is ${player.getName()} with ${player.getMark()}`;
      } else if (
        columns[0].every((v) => v === columns[0][0] && v !== "") ||
        columns[1].every((v) => v === columns[1][0] && v !== "") ||
        columns[2].every((v) => v === columns[2][0] && v !== "")
      ) {
        gameIsOver = true;
        return `the winner is ${player.getName()} with ${player.getMark()}`;
      } else if (
        (gameboard[0][0] === gameboard[1][1] &&
          gameboard[0][0] === gameboard[2][2] &&
          gameboard[0][0] !== "") ||
        (gameboard[0][2] === gameboard[1][1] &&
          gameboard[0][2] === gameboard[2][0] &&
          gameboard[0][2] !== "")
      ) {
        gameIsOver = true;
        return `the winner is ${player.getName()} with ${player.getMark()}`;
      } else if (
        columns[0].every((v) => v !== "") &&
        columns[1].every((v) => v !== "") &&
        columns[2].every((v) => v !== "")
      ) {
        gameIsOver = true;
        return `It's a Draw!`;
      }
    }
  };

  const getStatus = () => gameIsOver;

  const setInitial = () =>
    (gameboard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);

  const announceWinner = (message) =>
    setTimeout(() => {
      window.alert(message);
    }, 100);

  return {
    gameboard,
    addMove,
    checkGame,
    getStatus,
    setInitial,
    announceWinner,
    getValidMove,
  };
})();

function render(gameboard) {
  let nodeEl = 0;

  gameboard.forEach((column) => {
    column.forEach((row) => {
      if (row !== "") {
        fields[nodeEl].classList.add(`${row}-field`);
      }
      nodeEl++;
    });
  });
}

const EachGame = (() => {
  let winner;
  const player1 = Player(prompt("Whats your name?"), "x", true);
  const player2 = Player("ultron", "o", false);

  player2.cpuMove = () => {
    player2.makeMove([
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 3),
    ]);
  };

  fields.forEach((field) => {
    field.addEventListener("click", (e) => {
      if (player1.getTurn()) {
        player1.makeMove(field.dataset.idx.split(","));
        if (Gameboard.addMove(player1)) {
          player1.setTurn(false);
          player2.setTurn(true);
        } else {
          player1.setTurn(true);
          player2.setTurn(false);
        }
        winner = Gameboard.checkGame(player1);
        if (!winner) {
          if (player2.getName() === "ultron") {
            do {
              player2.cpuMove();
              Gameboard.addMove(player2);
            } while (!Gameboard.getValidMove());
            winner = Gameboard.checkGame(player2);
          }
        }
      } else if (player2.getTurn() && player2.getName() !== "ultron") {
        player2.makeMove(field.dataset.idx.split(","));

        if (Gameboard.addMove(player2)) {
          player1.setTurn(true);
          player2.setTurn(false);
        } else {
          player1.setTurn(false);
          player2.setTurn(true);
        }

        winner = Gameboard.checkGame(player2);
      }

      render(Gameboard.gameboard);

      if (Gameboard.getStatus()) {
        Gameboard.announceWinner(winner);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  });
})();
