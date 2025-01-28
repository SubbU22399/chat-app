import { motion } from 'framer-motion';

const PlayerInfo = ({ player }) => {
  return (
    <motion.div
      className="my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold">{player.name}'s Turn</h2>
      <div className="my-2">
        {player.pieces.map((piece, idx) => (
          <p key={idx} className="text-lg">Piece {idx + 1}: {piece[0]}, {piece[1]}</p>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayerInfo;
