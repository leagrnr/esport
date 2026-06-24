import { useState } from "react";
import { Star } from "lucide-react";

type FavoritesButtonProps = {
  onToggle?: (isActive: boolean) => void;
};

export default function FavoritesButton({ onToggle }: FavoritesButtonProps) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      style={{ background: "none", cursor: "pointer" }}
      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm border ${
        active
          ? "border-yellow-400 text-yellow-400"
          : "border-gray-600 text-gray-400"
      }`}
    >
      <Star size={14} fill={active ? "currentColor" : "none"} />
      Favoris
    </button>
  );
}
