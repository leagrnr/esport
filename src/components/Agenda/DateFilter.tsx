import { useState } from "react";

type DateFilterProps = {
  dates: string[];
  onDateChange?: (date: string) => void;
};

export default function DateFilter({ dates, onDateChange }: DateFilterProps) {
  const [activeDate, setActiveDate] = useState(dates[0]);

  const handleClick = (date: string) => {
    setActiveDate(date);
    onDateChange?.(date);
  };

  return (
    <div className="flex gap-2 ml-5">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => handleClick(date)}
          style={{ border: "none", cursor: "pointer" }}
          className={`px-2 py-1 rounded-lg text-sm font-medium ${
            activeDate === date
              ? "bg-red-700 text-white"
              : "bg-[#2a2a2a] text-gray-400"
          }`}
        >
          {date}
        </button>
      ))}
    </div>
  );
}
