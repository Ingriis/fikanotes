import { useState, useRef, useEffect } from 'react';
import { Palette, Trash2, Archive, ArchiveRestore, Pin, PinOff, X, Check } from 'lucide-react';
import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS } from '../lib/constants';
import RichTextEditor from './RichTextEditor';

export default function NoteCard({ note }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

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
    changeColor
  } = useNotes();

  const editorRef = useRef(null);
  const isTrash = note.is_trashed;

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

  const handleSaveEdit = async () => {
    if (editTitle !== note.title || editContent !== note.content) {
      await updateNote(note.id, { title: editTitle, content: editContent });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

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
          'group relative flex flex-col rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md min-h-[120px]',
          note.color || 'bg-white'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowPalette(false);
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
          className="flex-grow cursor-pointer"
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
        </div>

        <div className={clsx(
          'mt-4 pt-2 flex items-center justify-between transition-opacity duration-200',
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
