import Coffre from "./coffre";

type QuestProgressionProps = {
  title: string;
  current: number;
  total: number;
  description: string;
};

export default function QuestProgression({
  title,
  current,
  total,
  description,
}: QuestProgressionProps) {
  const progress = (current / total) * 100;

  return (
    <div className="bg-[#1e1e1e] rounded-xl px-4 py-3 mx-4 mb-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-gray-400 text-xs">
          {current}/{total} stands
        </p>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
        <div
          className="bg-red-600 h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-400 text-xs text-left">{description}</p>

      {current === total && <Coffre />}
    </div>
  );
}
