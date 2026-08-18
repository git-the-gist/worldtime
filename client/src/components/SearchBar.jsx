
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import {  
  Search, 
  Loader2,
} from 'lucide-react';
import { useErrors } from "../context/ErrorContext";

export default function SearchBar( { addClock, addedLocations, darkMode } ) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const cancelSourceRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const { addError } = useErrors();

    const isAdded = (suggestion) => {
        return addedLocations.some(
            loc => loc.index === suggestion.index
        );
    };
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!query.trim()) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        debounceTimerRef.current = setTimeout(() => {
            const loadSuggestions = async () => {
                if (cancelSourceRef.current) {
                    cancelSourceRef.current.cancel('New search started');
                }

                cancelSourceRef.current = axios.CancelToken.source();

                try {
                    const response = await axios.get(
                        `/api/search?city=${encodeURIComponent(query)}`,
                        { cancelToken: cancelSourceRef.current.token }
                    );
                    if (Array.isArray(response.data)) {
                        setSuggestions(response.data);
                    } else {
                        addError("Couldn't reach the server. Please try again later.");
                    }
                    
                } catch (err) {
                    if (!axios.isCancel(err)) {
                        addError("There was an error performing your search.  Please try again later.");
                    }
                } finally {
                    setLoading(false);
                }
            };

            loadSuggestions();
        }, 250);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (cancelSourceRef.current) {
                cancelSourceRef.current.cancel('Component unmounted or query changed');
            }
        };
    }, [query])

    const onSuggestHandler = (suggestion) => {
        addClock(suggestion);
        setSuggestions([]);
        setQuery('')
    }

    const onChangeHandler = (input) => {
        setQuery(input)
    }

    return (
        <>
            <section className="space-y-4">
                <div className="flex gap-4">
                    <div className={`relative z-50 flex-1 rounded-xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        {loading && (
                            <Loader2 className={`absolute right-4 top-1/2 -translate-y-1/2 animate-spin ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} size={18} />
                        )}
                    <input 
                    type="text" 
                    value={query}
                    placeholder="Search for a city..." 
                    className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm ${darkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                    onChange={e => onChangeHandler(e.target.value)}
                    onBlur={() => {
                        setTimeout(() => {
                            setSuggestions([]);
                        }, 100);
                    }}/>
                        <div className={`absolute top-full left-0 right-0 mt-2 max-h-[200px] overflow-y-auto rounded-xl shadow-xl z-[9999] ${darkMode ? 'bg-slate-900 border border-slate-600 text-slate-100' : 'bg-white border border-slate-300 text-slate-800'}`}>
                            {suggestions && suggestions.map((suggestion, i) => {
                                const added = isAdded(suggestion);
                                return (
                                    <div
                                        key={i}
                                        onMouseDown={added ? undefined : (e) => { e.preventDefault(); onSuggestHandler(suggestion); }}
                                        className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                                            added
                                                ? 'opacity-50 text-gray-400 cursor-not-allowed'
                                                : `${darkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'}`
                                        }`}
                                    >
                                        {[suggestion.name, suggestion.state, suggestion.country].filter(Boolean).join(", ")}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}