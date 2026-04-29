import { Bell, Loader2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NotesGrid from '../components/NotesGrid';

export default function Reminders() {
  const { notes, loading } = useNotes();

  const reminderNotes = notes
    .filter((note) => !note.is_trashed && Boolean(note.reminder_at))
    .sort((a, b) => new Date(a.reminder_at) - new Date(b.reminder_at));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      {reminderNotes.length === 0 ? (
        <div className="text-gray-400 mt-20 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <Bell size={40} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-500">Tus notas con recordatorios aparecerán aquí</p>
          <p className="text-sm mt-2 text-gray-400">Usa la campana en una nota para programar fecha y hora</p>
        </div>
      ) : (
        <NotesGrid notes={reminderNotes} title="RECORDATORIOS" />
      )}
    </div>
  );
}
