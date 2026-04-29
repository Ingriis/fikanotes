import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import NoteCard from './NoteCard';

export default function NotesGrid({ notes, title }) {
  const { viewMode } = useNotes();

  if (notes.length === 0) return null;

  return (
    <div>
      {title && (
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">
          {title}
        </h2>
      )}
      <div
        className={clsx(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'flex flex-col gap-3'
        )}
      >
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
