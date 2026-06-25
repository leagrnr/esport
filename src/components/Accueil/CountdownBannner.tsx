import {useEffect, useState} from "react";


export function CountdownBanner({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ jours: '00', heures: '00', minutes: '00', secondes: '00' });

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    jours: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                    heures: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
                    minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
                    secondes: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="w-full bg-[#4a080c] py-4 text-center border-b border-red-900/30 px-4 box-border">
            <p className="text-[11px] font-black tracking-[0.2em] text-red-200/90 uppercase m-0">La lan débute dans</p>
            <div className="text-xl font-black font-mono tracking-wide my-1 text-white">
                {timeLeft.jours} J : {timeLeft.heures} H : {timeLeft.minutes} M : {timeLeft.secondes} S
            </div>
            <p className="text-[10px] text-red-300/50 font-medium tracking-wide m-0">Halle Tony Garnier · Lyon</p>
        </div>
    );
}
