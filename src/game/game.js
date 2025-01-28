import { motion } from "framer-motion";

// Define the game logic
const generateSpiralPath = () => {
  const path = [];
  const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0], // Up
  ];

  let [x, y] = [3, 0]; // Starting at one side (center of the left side)
  let dir = 0; // Start direction is to move right
  let steps = 1; // Number of steps to move initially
  let turnCounter = 0;

  for (let i = 0; i < 25; i++) {
    // Enough moves for the spiral
    for (let j = 0; j < steps; j++) {
      path.push([x, y]);
      x += directions[dir][0];
      y += directions[dir][1];
    }

    // Turn clockwise (right)
    dir = (dir + 1) % 4;
    turnCounter++;

    // Increase steps after every two turns
    if (turnCounter % 2 === 0) {
      steps++;
    }
  }

  return path;
};

// The safe spaces
const safeSpaces = [
  [0, 3],
  [1, 1],
  [1, 5],
  [2, 3],
  [3, 0],
  [3, 2],
  [3, 4],
  [3, 6],
  [4, 3],
  [5, 1],
  [5, 5],
  [6, 3],
];

// Check if position is a safe space
const isSafeSpace = (pos) => {
  return safeSpaces.some(([x, y]) => x === pos[0] && y === pos[1]);
};

// The game logic for managing player movement and checking collision
export const Game = ({
  players,
  setPlayers,
  currentPlayerIdx,
  setCurrentPlayerIdx,
}) => {
  const spiralPath = generateSpiralPath();

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const movePiece = (player, pieceIndex) => {
    const diceRoll = rollDice();
    console.log(`${player.name} rolled a ${diceRoll}`);

    // Find the current position of the piece
    let currentPos = player.pieces[pieceIndex];
    let newPos = moveToNextPosition(currentPos, diceRoll);

    // Check if the move is valid (collision, safe space, etc.)
    if (isMoveValid(player, newPos)) {
      player.pieces[pieceIndex] = newPos;
    } else {
      console.log(`${player.name}'s piece was killed! Starting over.`);
      player.pieces[pieceIndex] = player.startPosition;
    }

    // Update the player state
    setPlayers([...players]);
  };

  const moveToNextPosition = (currentPos, steps) => {
    const currentIdx = spiralPath.findIndex(
      ([x, y]) => x === currentPos[0] && y === currentPos[1]
    );
    return spiralPath[currentIdx + steps] || currentPos;
  };

  const isMoveValid = (player, newPos) => {
    // Check if the position is outside a safe space
    if (isSafeSpace(newPos)) {
      return true; // It's a safe space
    }

    // Check if opponent's piece is in the new position
    for (let opponent of players) {
      if (
        opponent !== player &&
        opponent.pieces.some(
          (piece) => piece[0] === newPos[0] && piece[1] === newPos[1]
        )
      ) {
        return false; // The move is invalid as it conflicts with the opponent
      }
    }
    return true;
  };

  const checkVictory = (player) => {
    return player.pieces.every(([x, y]) => x === 3 && y === 3); // Center position
  };

  const handleMove = () => {
    const currentPlayer = players[currentPlayerIdx];
    movePiece(currentPlayer, currentPlayer.activePiece);

    // Check if the current player wins
    if (checkVictory(currentPlayer)) {
      alert(`${currentPlayer.name} wins!`);
      return;
    }

    // Switch player
    setCurrentPlayerIdx((currentPlayerIdx + 1) % 2);
  };

  return (
    <div className="text-center p-4">
      <motion.div
      initial={{ x: 0, y: 0 }}
        animate={{ x: 100, y: 100 }}
        transition={{ duration: 2 }}
        // >
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 1 }}
      >
        <h1 className="text-2xl my-4 font-semibold">Dice Game</h1>
        <motion.button
          onClick={handleMove}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          whileTap={{ scale: 0.95 }}
        >
          Roll Dice
        </motion.button>
      </motion.div>
    </div>
  );
};
