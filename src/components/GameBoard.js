import { motion } from 'framer-motion';
import React, { useState } from 'react';

const GameBoard = () => {
  const initialPieces = [
    { id: 1, x: null, y: null, inPlay: false, color: 'red' },  // Off-board piece for Player 1
    { id: 2, x: null, y: null, inPlay: false, color: 'red' },  // Off-board piece for Player 1
    { id: 3, x: null, y: null, inPlay: false, color: 'red' },  // Off-board piece for Player 1
    { id: 4, x: null, y: null, inPlay: false, color: 'red' },  // Off-board piece for Player 1
    { id: 5, x: null, y: null, inPlay: false, color: 'blue' },  // Off-board piece for Player 2
    { id: 6, x: null, y: null, inPlay: false, color: 'blue' },  // Off-board piece for Player 2
    { id: 7, x: null, y: null, inPlay: false, color: 'blue' },  // Off-board piece for Player 2
    { id: 8, x: null, y: null, inPlay: false, color: 'blue' },  // Off-board piece for Player 2
  ];

  const [players, setPlayers] = useState([
    { name: 'Player 1', pieces: initialPieces.slice(0, 4), color: 'red' },
    { name: 'Player 2', pieces: initialPieces.slice(4), color: 'blue' },
  ]);

  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState(null); // Track selected piece for movement
  const [isPieceSelected, setIsPieceSelected] = useState(false); // Track if piece is selected for moving

  const player1Path = [
    [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6],
    [1, 6], [0, 6], [0, 5], [0, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [5, 4],
    [5, 3], [5, 2], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4],
    [2, 4], [3, 4], [4, 4], [4, 3], [4, 2], [3, 2], [2, 2], [2, 3], [3, 3]
  ];

  const player2Path = [
    [6, 3], [6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
    [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [5, 0], [6, 0], [6, 1], [6, 2], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2],
    [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [5, 4], [5, 3], [5, 2],
    [4, 2], [3, 2], [2, 2], [2, 3], [2, 4], [3, 4], [4, 4], [3, 3]
  ];

  const getCellClasses = (x, y) => {
    const safeSpaces =  [
      [0, 3], 
      [1, 1], [1, 5],
      [2, 3],
      [3, 0], [3, 2], [3, 4], [3, 6],
      [4,3],
      [5,1], [5,5],
      [6, 3],
    ];

    return safeSpaces.some(([sx, sy]) => sx === x && sy === y)
      ? 'bg-green-400'
      : 'bg-gray-200';
  };

  const handleDiceRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);

      const currentPlayer = players[currentPlayerIdx];
      const hasPiecesInPlay = currentPlayer.pieces.some(piece => piece.inPlay);

      if (roll !== 6 && !hasPiecesInPlay) {
        // Switch turn to the other player if no pieces are in play
        setCurrentPlayerIdx((currentPlayerIdx + 1) % 2);
        setDiceRoll(null); // Reset the dice roll after each turn
      }
    }, 1000); // Dice roll animation duration
  };

  const bringPieceIn = (pieceIdx) => {
    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIdx];

    if (currentPlayer.pieces[pieceIdx].inPlay) {
      alert("This piece is already in play.");
      return;
    }

    // Bring the piece onto the board
    currentPlayer.pieces[pieceIdx] = {
      ...currentPlayer.pieces[pieceIdx],
      inPlay: true,
      x: currentPlayerIdx === 0 ? 0 : 6, // Player 1 starts at row 0, Player 2 starts at row 6
      y: 3, // Pieces start in the middle column
    };

    setPlayers(updatedPlayers);
    setSelectedPieceIdx(pieceIdx); // Set the selected piece index
    setIsPieceSelected(true); // Allow the player to choose which piece to move next
  };

  const movePiece = () => {
    const roll = diceRoll;
    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentPlayerIdx];
    const piece = currentPlayer.pieces[selectedPieceIdx];

    if (piece.x === null || piece.y === null) return;

    const path = currentPlayerIdx === 0 ? player1Path : player2Path;
    const currentPos = path.findIndex(([x, y]) => x === piece.x && y === piece.y);

    // Check if the piece is already at the center
    if (currentPos === path.length - 1) {
      alert("This piece has reached the center and cannot be moved further.");
      return;
    }

    const newPos = Math.min(currentPos + roll, path.length - 1);
    const [newX, newY] = path[newPos];

    // Check if the new position is occupied by an opponent's piece
    const opponentIdx = (currentPlayerIdx + 1) % 2;
    const opponentPiece = updatedPlayers[opponentIdx].pieces.find(p => p.x === newX && p.y === newY);

    if (opponentPiece) {
      // Move the opponent's piece out of the board
      opponentPiece.x = null;
      opponentPiece.y = null;
      opponentPiece.inPlay = false;
    }

    piece.x = newX;
    piece.y = newY;

    setPlayers(updatedPlayers);
    setIsPieceSelected(false); // Deselect after moving
    setSelectedPieceIdx(null); // Reset selected piece index

    // Switch turn to the other player
    setCurrentPlayerIdx((currentPlayerIdx + 1) % 2);
    setDiceRoll(null); // Reset the dice roll after each turn
  };

  const selectPiece = (pieceIdx) => {
    const currentPlayer = players[currentPlayerIdx];
    if (currentPlayer.pieces[pieceIdx].inPlay) {
      setSelectedPieceIdx(pieceIdx);
      setIsPieceSelected(true);
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h2>{players[currentPlayerIdx].name}'s Turn</h2>
      </div>

      {/* Player Pieces */}
      <div className="flex justify-between mb-4">
        {players.map((player, playerIdx) => (
          <div key={playerIdx} className="flex flex-col items-center">
            <h3>{player.name}</h3>
            <div className="flex">
              {player.pieces.map((piece, idx) => (
                !piece.inPlay && (
                  <motion.div
                    key={idx}
                    className={`w-8 h-8 rounded-full bg-${piece.color}-500 mx-1 flex items-center justify-center cursor-pointer ${currentPlayerIdx === playerIdx && diceRoll === 6 ? 'ring-4 ring-yellow-500' : ''}`}
                    onClick={() => currentPlayerIdx === playerIdx && diceRoll === 6 && bringPieceIn(idx)}
                    style={{ transform: diceRoll === 6 ? 'perspective(500px) rotateX(10deg) rotateY(10deg)' : 'none' }}
                  >
                    <span className="text-white">{piece.id}</span>
                  </motion.div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="grid grid-cols-7 gap-1 w-full max-w-md mx-auto aspect-square">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const piece = players.flatMap(player => player.pieces).find(p => p.x === rowIndex && p.y === colIndex);
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-full h-full relative border border-gray-300 ${getCellClasses(rowIndex, colIndex)}`}
                >
                  {piece && (
                    <motion.div
                      className={`absolute inset-0 m-auto w-8 h-8 rounded-full bg-${piece.color}-500 ${selectedPieceIdx === piece.id - 1 ? 'ring-4 ring-yellow-500' : ''}`}
                      onClick={() => selectPiece(piece.id - 1)}
                      style={{ transform: diceRoll === 6 ? 'perspective(500px) rotateX(10deg) rotateY(10deg)' : 'none' }}
                    >
                      <span className="text-white">{piece.id}</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Dice Roll Button */}
      <div className="my-4 text-center">
        <motion.div
          className="inline-block p-4 bg-white rounded-full shadow-md cursor-pointer"
          onClick={handleDiceRoll}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
            animate={{
              rotate: isRolling ? [0, 180, 360] : 0,
              scale: isRolling ? 1.2 : 1,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              loop: isRolling ? Infinity : 0,
            }}
          >
            <span className="text-2xl font-semibold">{isRolling ? '?' : diceRoll}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Move Selected Piece */}
      {isPieceSelected && (
        <div className="text-center">
          <button
            onClick={movePiece}
            className="p-2 bg-green-500 text-white rounded"
          >
            Move Selected Piece
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;