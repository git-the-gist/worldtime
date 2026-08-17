import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useErrors } from "../context/ErrorContext";

export default function Error( { darkMode }) {
    const { errors, clearErrors } = useErrors();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const currentError = errors[errors.length - 1];

    return (
        <div ref={containerRef} className="relative">
            <button className={`p-2 rounded-full cursor-pointer transition-colors ${
                errors.length > 0
                    ? 'text-red-500'
                    : darkMode
                        ? 'text-stone-300'
                        : 'text-zinc-800'
                }`}
                onClick={() => setOpen(prev => !prev)}
                
            >
                <AlertTriangle size={20} />
            </button>

            {open && (
    <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 shadow-xl" : "bg-white text-black border shadow-xl"} shadow-lg z-50`}>

        {errors.length === 0 ? (
            <div className="p-2">
                <p className="text-sm font-medium">
                    No errors.
                </p>
            </div>
        ) : (
            <>
                <div>
                    {errors.map(error => (
                        <div
                            key={error.id}
                            className="px-4 py-3 text-sm flex justify-between items-center"
                        >
                            <span>{error.message}</span>
                            <span className="text-xs opacity-60">
                                {new Date(error.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={clearErrors}
                    className="w-full border-t px-4 py-3 text-sm cursor-pointer"
                >
                    Clear all
                </button>
            </>
        )}
    </div>
)}
        </div>
    );
}