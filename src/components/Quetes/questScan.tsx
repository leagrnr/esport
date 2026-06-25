import { MapPin } from "lucide-react";

type ScanCardProps = {
  stand: string;
  title: string;
  subtitle: string;
  onScan?: () => void;
};

export default function ScanCard({
  stand,
  title,
  subtitle,
  onScan,
}: ScanCardProps) {
  return (
    <div className="flex items-center gap-4 bg-[#1e1e1e] border border-gray-600 rounded-xl px-4 py-3 mx-4 mb-4">
      <span className="text-white text-sm font-medium w-12 shrink-0">
        {stand}
      </span>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
      </div>

      <button
        onClick={onScan}
        style={{ cursor: "pointer" }}
        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-sm"
      >
        Scanner
      </button>
    </div>
  );
}
