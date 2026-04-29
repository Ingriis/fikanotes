/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { Palette, Trash2, Archive, ArchiveRestore, Pin, PinOff, Bell, Tag, X } from 'lucide-react';
import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS } from '../lib/constants';
import RichTextEditor from './RichTextEditor';

const toDateTimeLocal = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const formatReminder = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function NoteCard({ note, viewMode = 'grid' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const {
    updateNote,
    togglePin,
    toggleArchive,
    moveToTrash,
    restoreFromTrash,
    deleteNotePermanently,
    changeColor,
    toggleLabel,
    setReminder,
    clearReminder,
    allLabels,
  } = useNotes();

  const editorRef = useRef(null);
  const isTrash = note.is_trashed;

  function handleSaveEdit() {
    if (editTitle !== note.title || editContent !== note.content) {
      updateNote(note.id, { title: editTitle, content: editContent });
    }
    setIsEditing(false);
  }

  // Handle clicking outside to save
  useEffect(() => {
    function handleClickOutside(event) {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        handleSaveEdit();
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, editTitle, editContent]);

  const handleColorChange = (colorValue) => {
    changeColor(note.id, colorValue);
    setShowPalette(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleCreateLabel = (event) => {
    event.preventDefault();
    const label = newLabel.replace(/^#/, '').trim();
    if (!label) return;

    toggleLabel(note.id, label);
    setNewLabel('');
  };

  const handleReminderChange = (event) => {
    const value = event.target.value;
    setReminder(note.id, value ? new Date(value).toISOString() : null);
  };

  const cardLabels = note.labels || [];

  return (
    <>
      {/* MODAL DE VISTA/EDICIÓN COMPLETA */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
          onMouseDown={handleSaveEdit} // Al hacer clic en el fondo gris, se guarda y cierra
        >
          <div
            ref={editorRef}
            className={clsx(
              'w-full max-w-2xl flex flex-col rounded-2xl border border-gray-300 p-5 shadow-2xl animate-zoomIn',
              note.color || 'bg-white'
            )}
            onMouseDown={(e) => e.stopPropagation()} // Previene que el clic dentro del modal lo cierre
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título"
              className="w-full bg-transparent text-xl font-bold outline-none mb-4 placeholder-gray-500 text-gray-800"
              autoFocus
            />

            {/* Contenedor con scroll para evitar que el modal crezca infinitamente */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <RichTextEditor
                content={editContent}
                onChange={setEditContent}
                placeholder="Añade una nota..."
              />
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 border-opacity-30">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 hover:bg-black/5 rounded-lg transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm shadow-md"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TARJETA EN LA GRILLA */}
      <div
        className={clsx(
          'group relative flex rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md min-h-[120px]',
          viewMode === 'list' ? 'flex-row gap-4' : 'flex-col',
          note.color || 'bg-white'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowPalette(false);
          setShowLabels(false);
          setShowReminder(false);
        }}
      >
        {!isTrash && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(note.id, note.is_pinned);
            }}
            className={clsx(
              'absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 transition-opacity z-10',
              note.is_pinned ? 'opacity-100 text-yellow-800' : 'opacity-0 group-hover:opacity-100 text-gray-500'
            )}
            title={note.is_pinned ? "Desfijar" : "Fijar nota"}
          >
            {note.is_pinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>
        )}

        <div
          className={clsx('flex-grow cursor-pointer min-w-0', viewMode === 'list' && 'pr-4')}
          onClick={() => !isTrash && setIsEditing(true)}
        >
          {note.title && (
            <h3 className="font-semibold text-gray-900 mb-2 pr-6 line-clamp-2">
              {note.title}
            </h3>
          )}

          {/* Contenedor con altura limitada y máscara de degradado al final */}
          <div
            className="text-gray-800 text-sm prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 break-words overflow-hidden"
            style={{
              maxHeight: '7rem',
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
            }}
            dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-gray-400 italic">Contenido oculto por modo seguro...</p>' }}
          />

          {(cardLabels.length > 0 || note.reminder_at) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {note.reminder_at && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                  <Bell size={12} />
                  {formatReminder(note.reminder_at)}
                </span>
              )}
              {cardLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                >
                  #{label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={clsx(
          'pt-2 flex items-center justify-between transition-opacity duration-200',
          viewMode === 'list' ? 'mt-0 shrink-0 self-end' : 'mt-4',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
          {isTrash ? (
            <div className="flex gap-2 w-full justify-end">
              <button
                onClick={() => deleteNotePermanently(note.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors text-xs font-bold"
              >
                Eliminar definitivamente
              </button>
              <button
                onClick={() => restoreFromTrash(note.id)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors text-xs font-bold"
              >
                Restaurar
              </button>
            </div>
          ) : (
            <div className="flex gap-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPalette(!showPalette);
                }}
                className="p-1.5 text-gray-700 hover:bg-black/10 rounded-full transition-colors"
                title="Cambiar color"
              >
                <Palette size={16} />
              </button>

              {showPalette && (
                <div
                  className="absolute bottom-8 left-0 bg-gray-800 shadow-2xl border border-gray-700 rounded-xl p-3 flex flex-wrap gap-2 w-64 z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      title={c.label}
                      onClick={() => handleColorChange(c.value)}
                      className={clsx(
                        'w-5 h-5 rounded-full border border-gray-600 hover:scale-110 transition-transform hover:border-white shadow-sm',
                        c.value,
                        note.color === c.value && 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white'
                      )}
                    />
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLabels(!showLabels);
                    setShowPalette(false);
                    setShowReminder(false);
                  }}
                  className="p-1.5 text-gray-700 hover:bg-black/10 rounded-full transition-colors"
                  title="Etiquetas"
                >
                  <Tag size={16} />
                </button>

                {showLabels && (
                  <div
                    className="absolute bottom-8 left-0 bg-white shadow-2xl border border-gray-200 rounded-xl p-3 w-64 z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Etiquetas</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {allLabels.length === 0 ? (
                        <p className="text-xs text-gray-400 py-2">Crea la primera etiqueta.</p>
                      ) : (
                        allLabels.map((label) => (
                          <label
                            key={label}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-yellow-50 text-sm text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={cardLabels.includes(label)}
                              onChange={() => toggleLabel(note.id, label)}
                              className="accent-yellow-500"
                            />
                            #{label}
                          </label>
                        ))
                      )}
                    </div>
                    <form onSubmit={handleCreateLabel} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="#Universidad"
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-yellow-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-500"
                      >
                        Añadir
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReminder(!showReminder);
                    setShowPalette(false);
                    setShowLabels(false);
                  }}
                  className={clsx(
                    'p-1.5 hover:bg-black/10 rounded-full transition-colors',
                    note.reminder_at ? 'text-yellow-800' : 'text-gray-700'
                  )}
                  title="Recordatorio"
                >
                  <Bell size={16} />
                </button>

                {showReminder && (
                  <div
                    className="absolute bottom-8 left-0 bg-white shadow-2xl border border-gray-200 rounded-xl p-3 w-64 z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recordatorio</p>
                    <input
                      type="datetime-local"
                      value={toDateTimeLocal(note.reminder_at)}
                      onChange={handleReminderChange}
                      className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    {note.reminder_at && (
                      <button
                        type="button"
                        onClick={() => clearReminder(note.id)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        <X size={12} />
                        Quitar recordatorio
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArchive(note.id, note.is_archived);
                }}
                className="p-1.5 text-gray-700 hover:bg-black/10 rounded-full transition-colors"
                title={note.is_archived ? "Desarchivar" : "Archivar"}
              >
                {note.is_archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveToTrash(note.id);
                }}
                className="p-1.5 text-gray-700 hover:bg-black/10 rounded-full transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
