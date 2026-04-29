import { useState } from 'react';
import { Loader2, Tag } from 'lucide-react';
import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import NotesGrid from '../components/NotesGrid';

export default function Labels() {
  const { notes, loading, allLabels, filteredBySearch } = useNotes();
  const [selectedLabel, setSelectedLabel] = useState('');

  const currentLabel = selectedLabel || allLabels[0] || '';
  const labelNotes = filteredBySearch(
    notes.filter((note) =>
      !note.is_trashed &&
      !note.is_archived &&
      currentLabel &&
      note.labels?.includes(currentLabel)
    )
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      {allLabels.length === 0 ? (
        <div className="text-gray-400 mt-20 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <Tag size={40} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-500">Aún no hay etiquetas</p>
          <p className="text-sm text-gray-400 mt-2">Crea etiquetas desde una nota o escribiendo hashtags.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-3 h-fit">
            <h1 className="px-2 pb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Etiquetas
            </h1>
            <div className="space-y-1">
              {allLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedLabel(label)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    currentLabel === label
                      ? 'bg-yellow-100 text-yellow-800 font-semibold'
                      : 'text-gray-600 hover:bg-yellow-50'
                  )}
                >
                  <Tag size={16} />
                  #{label}
                </button>
              ))}
            </div>
          </section>

          <section>
            {labelNotes.length === 0 ? (
              <div className="text-gray-400 mt-16 flex flex-col items-center">
                <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                  <Tag size={34} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-500">No hay notas con #{currentLabel}</p>
              </div>
            ) : (
              <NotesGrid notes={labelNotes} title={`#${currentLabel}`} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
