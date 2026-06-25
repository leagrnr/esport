import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chestAnimation from "../../assets/treasure_chest.json";
import lottie, { AnimationItem } from "lottie-web";
import { useLocalStorage } from "@uidotdev/usehooks";

const lots = [
  "Manette Gaming",
  "T-shirt Esport",
  "Casque Gaming",
  "Redbull x2",
  "Goodies exclusifs",
];

export default function Coffre() {
  const [lot, setLot] = useLocalStorage<string | null>("lot", null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      animationData: chestAnimation,
      loop: false,
      autoplay: true,
    });

    animRef.current = anim;

    anim.setSpeed(3);

    const handleComplete = () => {
      const random = lots[Math.floor(Math.random() * lots.length)];
      setLot(random);
    };

    if (lot === null) {
      anim.addEventListener("complete", handleComplete);
    }

    return () => {
      anim.removeEventListener("complete", handleComplete);
      anim.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <p className="text-white text-lg font-medium">Quête complétée !</p>

      <div className="cursor-pointer w-48 h-48" ref={containerRef} />

      <AnimatePresence>
        {lot && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="bg-[#1e1e1e] border border-yellow-500 rounded-2xl px-8 py-6 text-center"
          >
            <p className="text-yellow-400 text-xs font-medium mb-1 uppercase tracking-widest">
              Tu as gagné
            </p>
            <p className="text-white text-2xl font-bold">{lot}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
