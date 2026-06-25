import React from "react";

export default function ActionCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
    return (
        <div className="bg-[#121214] border border-[#212124] rounded-xl p-4 flex flex-col justify-evenly h-36 w-full box-border cursor-pointer hover:border-gray-800 transition-colors">
            <div className="w-8 h-8 rounded-lg border border-[#2d2d32] bg-black/20 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-wide truncate m-0">{title}</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2 m-0">{description}</p>
            </div>
        </div>
    );
}