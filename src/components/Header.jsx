import { Menu, Search, Settings, RefreshCcw, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <span className="text-xl font-medium text-gray-600">FikaNotes</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-8">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-200 transition-shadow">
          <Search size={20} className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <RefreshCcw size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <LayoutGrid size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
        
        {/* Placeholder para Perfil de Usuario (Parte 2) */}
        <div className="ml-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
