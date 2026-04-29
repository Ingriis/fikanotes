import { useNotes } from '../context/NotesContext';
import NotesGrid from '../components/NotesGrid';
import { Loader2 } from 'lucide-react';

export default function Archive() {
  const { notes, loading, filteredBySearch } = useNotes();
  const archivedNotes = filteredBySearch(notes.filter(n => n.is_archived && !n.is_trashed));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      {archivedNotes.length === 0 ? (
        <div className="text-gray-400 mt-20 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-4xl">📥</span>
          </div>
          <p className="text-lg font-medium text-gray-500">Tus notas archivadas aparecerán aquí</p>
        </div>
      ) : (
        <div className="w-full">
          <NotesGrid notes={archivedNotes} title="ARCHIVO" />
        </div>
      )}
    </div>
  );
}
