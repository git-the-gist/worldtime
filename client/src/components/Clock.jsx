import tzLookup from "tz-lookup";
import { useState, useEffect } from "react";

export default function Clock({ location, deleteClock, darkMode }) {
  if (!location) return null;
  const lat = location.lat;
  const lng = location.lng;
  const city = location.name;
  const country = location.country;
  const state = location.state;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeZone = tzLookup(lat, lng);

  const localTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(time);

  const localDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(time);

  return (
    <div
      className={`flex-none w-[280px] snap-start p-6 rounded-2xl transition-all duration-300 border
            ${darkMode ? "bg-slate-800 border-slate-700 shadow-xl" : "bg-white text-black border-transparent shadow-xl"}
        `}
    >
      <div className="flex flex-col h-full space-y-6">
        <div>
          <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">
            {city}
          </h3>
          <div className="text-5xl font-bold mt-2 font-mono tracking-tighter">
            {localTime}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text font-medium opacity-80">{localDate}</p>
        </div>
        <div
          className={`pt-4 border-t opacity-90 ${darkMode ? "border-slate-700" : "border-stone-300"}`}
        >
          {`${city}, ${country}`}
          <p className="text-xs font-medium opacity-80">Timezone: {timeZone}</p>
        </div>
        <div className="text-xs font-medium opacity-50">
          <button className="cursor-pointer" onClick={deleteClock}>
            remove
          </button>
        </div>
      </div>
    </div>
  );
}
