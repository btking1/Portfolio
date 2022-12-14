import { motion } from "framer-motion";

export default function Resbox({ children }) {
  return (
    <motion.div
      class="flex w-full lg:w-[70%]  h-fit lg:h-screen items-center  gap-2 lg:gap-3 flex-col lg:flex-row px-5"
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
