import { motion } from "framer-motion";

export default function Form({ children }) {


  return (
    <motion.div
      class=""
      initial={{
        x: -500,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 2,
      }}
    >
      {children}
    </motion.div>
  );
}
