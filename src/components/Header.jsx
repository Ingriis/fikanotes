import { Menu, Search, Settings, RefreshCcw, LayoutGrid, Coffee, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const { profile } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 hover:rotate-6 focus:outline-none group"
        >
          <Menu size={24} className="text-gray-600 group-hover:text-yellow-500" />
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-xl transition-all transform group-hover:scale-105 group-hover:rotate-3">
            <Coffee size={22} className="text-white" />
          </div>
          <span className="text-xl font-medium text-gray-700 group-hover:text-yellow-600 transition-colors group-hover:animate-pulse-soft flex items-center gap-1">
            FikaNotes
            <Heart size={14} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-all group-hover:animate-heartBeat" />
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-8">
        <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 focus-within:shadow-md focus-within:ring-2 focus-within:ring-yellow-300 transition-all group border border-gray-100">
          <Search size={20} className="text-gray-400 mr-3 group-focus-within:text-yellow-500 group-focus-within:animate-wiggle" />
          <input
            type="text"
            placeholder="Buscar notas..."
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group">
          <RefreshCcw size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-spin-slow" />
        </button>
        <button className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group">
          <LayoutGrid size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-pulse" />
        </button>
        <button className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group">
          <Settings size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-wiggle" />
        </button>
        
        <Link 
          to="/profile" 
          className="ml-3 w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-110 transition-all shadow-md hover:shadow-xl hover:rotate-3"
        >
          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <Coffee size={16} />}
        </Link>
      </div>
    </header>
  );
}