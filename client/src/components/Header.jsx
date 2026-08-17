
import { 
  Sun, 
  Moon,
  TriangleAlert, 
} from 'lucide-react';
import Error from './Error';

export default function Header( {darkMode, setDarkMode} ) {
  return (
    <>
        <header className={`sticky top-0 relative z-100 flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
            <h1 className="text-xl font-bold tracking-tight">WORLDTIME - Global Time & Location Explorer</h1>
            <div className="flex items-center gap-4">
              <Error darkMode={darkMode}/>
              <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full cursor-pointer transition-colors ${darkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-zinc-400 text-zinc-900'}`}
              >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
        </header>
    </>
  );
}
