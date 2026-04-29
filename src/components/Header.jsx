import { useState } from 'react';
import { Menu, Search, Settings, RefreshCcw, LayoutGrid, List, Coffee, Heart, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

export default function Header({ toggleSidebar }) {
  const { profile } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    fetchNotes,
    supportsMetadata,
  } = useNotes();
  const [showSettings, setShowSettings] = useState(false);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

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
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={fetchNotes}
          className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group"
          title="Actualizar notas"
        >
          <RefreshCcw size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-spin-slow" />
        </button>
        <button
          onClick={toggleViewMode}
          className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group"
          title={viewMode === 'grid' ? 'Cambiar a lista' : 'Cambiar a cuadrícula'}
        >
          {viewMode === 'grid' ? (
            <List size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-pulse" />
          ) : (
            <LayoutGrid size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-pulse" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-yellow-50 transition-all transform hover:scale-110 group"
            title="Configuración"
          >
            <Settings size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:animate-wiggle" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-11 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Moon size={16} />
                  Modo oscuro
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-400">Próximamente</span>
              </div>
              <div className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                {supportsMetadata
                  ? 'Etiquetas y recordatorios conectados.'
                  : 'Agrega las columnas de Supabase para guardar etiquetas y recordatorios.'}
              </div>
            </div>
          )}
        </div>
        
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
