
import './App.css'
import { useState, useEffect, useRef } from 'react';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import Header from './components/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {

  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem('clocks');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });


  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    localStorage.setItem('clocks', JSON.stringify(clocks));
  }, [clocks]);

  const addClock = (suggestion) => {
    setClocks(prev => {
      const exists = prev.some(clock => clock.index === suggestion.index);
      if (exists) return prev;

      const { lat, lng } = suggestion;
      if (
        lat == null ||
        lng == null ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return prev;
      }

      return [...prev, suggestion];
    });
  };

  const deleteClock = (clockToDelete) => {
    setClocks(prev => prev.filter((_, index) => index !== clockToDelete ));
  }

  return (
    <>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-neutral-200 text-slate-900'}`}>
        <div className="App">
            <Header darkMode={darkMode} setDarkMode={setDarkMode}/>
            <main className="max-w-7xl mx-auto p-6 space-y-8">
              <SearchBar addClock={addClock} deleteClock={deleteClock} addedLocations={clocks} darkMode={darkMode}/>
              {clocks?.length > 0 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => scroll('left')} className={`cursor-pointer p-1.5 rounded-full border ${darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-zinc-400 hover:bg-slate-100'}`}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => scroll('right')} className={`cursor-pointer p-1.5 rounded-full border ${darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-zinc-400 hover:bg-slate-100'}`}>
                    <ChevronRight size={16} />
                  </button>
                  <div className="ml-auto">
                    <button className="flex items-end cursor-pointer" 
                    onClick={() => setClocks([])}>
                      clear all
                    </button>
                  </div>
                </div>
                )}
              <section
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {clocks.map((clock, i) => (
                  <Clock key={i} location={clock} deleteClock={() => deleteClock(i)} darkMode={darkMode}/>
                ))}
              </section>
              <Map locations={clocks}/>
            </main>
        </div>
      </div>
    </>
  );
}

export default App;