import { Star } from "lucide-react";

type FavoritesButtonProps = {
  onToggle: () => void;
  isActive?: boolean;
};

export default function FavoritesButton({
  onToggle,
  isActive,
}: FavoritesButtonProps) {
  return (
    <button
      onClick={onToggle}
      style={{ background: "none", cursor: "pointer" }}
      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm border ${
        isActive
          ? "border-yellow-400 text-yellow-400"
          : "border-gray-600 text-gray-400"
      }`}
    >
      <Star size={14} fill={isActive ? "currentColor" : "none"} />
      Favoris
    </button>
  );
}
