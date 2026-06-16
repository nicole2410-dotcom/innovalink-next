"use client";

import { useState, useEffect } from "react";

function calcTime(endDate) {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ endDate, className = "" }) {
  const [time, setTime] = useState(() => calcTime(endDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(calcTime(endDate)), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {["days", "hours", "minutes", "seconds"].map((unit) => (
        <div key={unit} className="text-center">
          <div className="bg-black/60 backdrop-blur rounded-lg px-2 py-1 min-w-[36px]">
            <span className="text-lg font-bold text-dorado">{pad(time[unit])}</span>
          </div>
          <span className="text-[9px] uppercase text-gray-400 mt-0.5 block">
            {unit === "days" ? "Días" : unit === "hours" ? "Horas" : unit === "minutes" ? "Min" : "Seg"}
          </span>
        </div>
      ))}
    </div>
  );
}
