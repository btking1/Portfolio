import { motion } from "framer-motion";

export default function Resbox({ children }) {
  return (
    <motion.div
      class="flex w-full max-h-[75%] h-screen justify-center gap-3 flex-wrap flex-col md:flex-row max-w-[85%]" 
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
