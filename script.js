function Gameboard() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => board;

    const setMark = (x, y, mark, element) => {
        if (board[x][y] !== null) {
            return false;
        }
        const sound = new Audio("./sound/mixkit-game-click-1114.wav");
        sound.play();
        board[x][y] = mark;
        element.innerHTML = mark;
        return true;
    };

    const resetBoard = () => {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    };


    return {getBoard, setMark, resetBoard};
}

function Player(mark) {
    const getMark = () => mark;
    return {getMark};
}

function GameController() {
    let gameOver = false;

    const player1 = Player('X');
    const player2 = Player('O');
    winLogic = [
        [0, 1, 2], // horizontal
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // vertical
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // diagonal
        [2, 4, 6]
    ];

    const board = Gameboard();

    let activePlayer = player1;

    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const getActivePlayer = () => activePlayer;

    const checkWin = (mark) => {
        let win = false;
        for (let i = 0; i < winLogic.length; i++) {
            let currentBoard = board.getBoard();
            let [x, y, z] = winLogic[i];
            if (currentBoard[Math.floor(x / 3)][x % 3] === mark &&
                currentBoard[Math.floor(y / 3)][y % 3] === mark &&
                currentBoard[Math.floor(z / 3)][z % 3] === mark) {
                const winSound = new Audio("./sound/winSound.wav");
                win = true;
                gameOver = true;
                winSound.play();
            }
        }
        return win;
    };

    const checkGameOver = () => {
        // checks to see if theres an empty cell
        let stopPlaying = true;
        board.getBoard().forEach((row) => {
            row.forEach((cell) => {
                if (cell === null) {
                    stopPlaying = false;
                }
            });
        });
        return stopPlaying;
    };



    const playRound = (x, y, element) => {
        if (gameOver) {
            return;
        }
        // let the current player play, then switch, then check for win or game over
        const playerTurn = document.querySelector("#player-turn");
        if (board.setMark(x, y, activePlayer.getMark(), element)){
            if (checkWin(activePlayer.getMark())) {
                playerTurn.innerHTML = `Player ${activePlayer.getMark()} wins!`;
                return;
            }
            else if (checkGameOver()) {
                gameOver = true;
                playerTurn.innerHTML = `Game over!`;
                return;
            }else{
                switchPlayer(); 
                playerTurn.innerHTML = `Player ${activePlayer.getMark()}'s turn`;
            }
        }
        
    }

    const restartGame = () => {
        board.resetBoard();
        activePlayer = player1;
        gameOver = false;
    }

    
    return {playRound, getActivePlayer, restartGame};
}


function ScreenController() {
    
    const game = GameController();
    const playerTurn = document.querySelector("#player-turn");
    const gameBoard = document.querySelectorAll(".box");

    gameBoard.forEach((box) => {
        box.addEventListener("click", (e) => {
            let x = box.getAttribute("data-x");
            let y = box.getAttribute("data-y");
            game.playRound(x, y, e.target);
            
        });
    });

    // restart button
    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        game.restartGame();
        gameBoard.forEach(box => {
            box.innerHTML = "";
        });
        playerTurn.innerHTML = `Player ${game.getActivePlayer().getMark()}'s turn`;
    });

}

ScreenController();