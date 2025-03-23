import React from 'react';
import { motion } from 'framer-motion';

const animals = [
  '🐼', '🐨', '🦊', '🦁', '🐯', '🐸', '🦉', '🦄'
];

const LoadingIndicator = () => {
  const [animal] = React.useState(() => 
    animals[Math.floor(Math.random() * animals.length)]
  );

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-4xl"
      >
        {animal}
      </motion.div>
      <p className="text-gray-400">Generating your floor plan...</p>
    </div>
  );
}

export default LoadingIndicator