import { useNotes } from '../context/NotesContext';
import NoteEditor from '../components/NoteEditor';
import NotesGrid from '../components/NotesGrid';
import { Loader2 } from 'lucide-react';

export default function Notes() {
  const { notes, loading, filteredBySearch, searchQuery } = useNotes();

  // Filtramos las notas que no están en la papelera ni archivadas
  const activeNotes = filteredBySearch(notes.filter(n => !n.is_trashed && !n.is_archived));
  
  const pinnedNotes = activeNotes.filter(n => n.is_pinned);
  const otherNotes = activeNotes.filter(n => !n.is_pinned);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      <NoteEditor />
      
      {activeNotes.length === 0 ? (
        <div className="text-gray-400 mt-20 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-lg font-medium text-gray-500">Tus notas aparecerán aquí</p>
          <p className="text-sm mt-2 text-gray-400">
            {searchQuery ? 'No hay coincidencias con tu búsqueda' : 'Añade una nota para empezar'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          <NotesGrid notes={pinnedNotes} title="FIJADAS" />
          <NotesGrid notes={otherNotes} title={pinnedNotes.length > 0 ? 'OTRAS' : undefined} />
        </div>
      )}
    </div>
  );
}
