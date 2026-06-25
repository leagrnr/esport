import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chestAnimation from "../../assets/treasure_chest.json";
import LottieRaw from "lottie-react";
// @ts-ignore
const Lottie: typeof LottieRaw = LottieRaw.default;

const lots = [
  "Manette Gaming",
  "T-shirt Esport",
  "Casque Gaming",
  "Redbull x2",
  "Goodies exclusifs",
];

export default function Coffre() {
  const [lot, setLot] = useState<string | null>(null);
  const lottieRef = useRef<null | { setSpeed: (speed: number) => void }>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(3);
    }
  }, [lottieRef]);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <p className="text-white text-lg font-medium">Quête complétée !</p>

      <div className="cursor-pointer w-48 h-48">
        <Lottie
          animationData={chestAnimation}
          loop={false}
          lottieRef={lottieRef}
          onComplete={() => {
            const random = lots[Math.floor(Math.random() * lots.length)];
            setLot(random);
          }}
        />
      </div>

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
