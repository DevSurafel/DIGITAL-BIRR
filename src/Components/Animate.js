import { motion } from "framer-motion";

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
};

const Animate = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.1, delay: 0.1 }}
      className=""
    >
      {children}
    </motion.div>
  );
};

export default Animate;
