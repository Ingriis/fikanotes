import { useNotes } from '../context/NotesContext';
import NoteEditor from '../components/NoteEditor';
import NoteCard from '../components/NoteCard';
import { Loader2 } from 'lucide-react';

export default function Notes() {
  const { notes, loading } = useNotes();

  // Filtramos las notas que no están en la papelera ni archivadas
  const activeNotes = notes.filter(n => !n.is_trashed && !n.is_archived);
  
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
          <p className="text-sm mt-2 text-gray-400">Añade una nota para empezar</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">
                FIJADAS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">
                  OTRAS
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
