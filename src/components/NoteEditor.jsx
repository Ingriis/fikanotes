/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { Palette, Bell, Tag, X } from 'lucide-react';
import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS } from '../lib/constants';
import RichTextEditor from './RichTextEditor';

const extractHashtags = (value = '') =>
  [...value.matchAll(/#([\p{L}\p{N}_-]+)/gu)].map((match) => match[1]);

const stripHtml = (value = '') =>
  value.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ');

export default function NoteEditor() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-white');
  const [showPalette, setShowPalette] = useState(false);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [labels, setLabels] = useState([]);
  const [reminderAt, setReminderAt] = useState('');
  
  const { addNote, normalizeLabels } = useNotes();
  const editorRef = useRef(null);

  const handleSave = async () => {
    const plainContent = stripHtml(content).trim();
    const noteLabels = normalizeLabels([
      ...labels,
      ...extractHashtags(title),
      ...extractHashtags(plainContent),
    ]);

    if (title.trim() || plainContent || noteLabels.length > 0) {
      try {
        await addNote({
          title,
          content,
          color,
          labels: noteLabels,
          reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null,
        });
      } catch (error) {
        console.error('Failed to add note', error);
      }
    }
    
    // Reset state
    setIsExpanded(false);
    setTitle('');
    setContent('');
    setColor('bg-white');
    setShowPalette(false);
    setShowLabelInput(false);
    setShowReminderInput(false);
    setNewLabel('');
    setLabels([]);
    setReminderAt('');
  };

  // Close editor when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        handleSave();
      }
    }
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, color]);

  const handleAddLabel = (event) => {
    event.preventDefault();
    const nextLabel = newLabel.replace(/^#/, '').trim();
    if (!nextLabel) return;

    setLabels(normalizeLabels([...labels, nextLabel]));
    setNewLabel('');
  };

  return (
    <div className="w-full flex justify-center mb-10">
      <div 
        ref={editorRef}
        className={clsx(
          'w-full max-w-2xl rounded-xl shadow-md border border-gray-200 transition-all duration-300 relative',
          color,
          isExpanded ? 'p-4 shadow-lg' : 'p-3 cursor-text'
        )}
      >
        {!isExpanded ? (
          <div 
            className="text-gray-500 font-medium px-2 py-1"
            onClick={() => setIsExpanded(true)}
          >
            Añade una nota...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-lg font-bold outline-none placeholder-gray-500 text-gray-800"
              autoFocus
            />
            
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              placeholder="Añade una nota..." 
            />

            {(labels.length > 0 || reminderAt) && (
              <div className="flex flex-wrap items-center gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                  >
                    #{label}
                    <button
                      type="button"
                      onClick={() => setLabels(labels.filter((item) => item !== label))}
                      className="text-gray-400 hover:text-red-500"
                      title="Quitar etiqueta"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {reminderAt && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                    <Bell size={12} />
                    {new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(reminderAt))}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 border-opacity-50">
              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPalette(!showPalette);
                    setShowLabelInput(false);
                    setShowReminderInput(false);
                  }}
                  className="p-2 rounded-full hover:bg-black/5 text-gray-600 transition-colors"
                  title="Cambiar color"
                >
                  <Palette size={18} />
                </button>
                
                {showPalette && (
                  <div className="absolute top-10 left-0 bg-gray-800 shadow-2xl border border-gray-700 rounded-xl p-3 flex flex-wrap gap-2 w-64 z-20">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        title={c.label}
                        onClick={() => {
                          setColor(c.value);
                          setShowPalette(false);
                        }}
                        className={clsx(
                          'w-6 h-6 rounded-full border border-gray-600 hover:scale-110 transition-transform hover:border-white shadow-sm',
                          c.value,
                          color === c.value && 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white'
                        )}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowLabelInput(!showLabelInput);
                    setShowPalette(false);
                    setShowReminderInput(false);
                  }}
                  className="p-2 rounded-full hover:bg-black/5 text-gray-600 transition-colors"
                  title="Añadir etiqueta"
                >
                  <Tag size={18} />
                </button>

                {showLabelInput && (
                  <form
                    onSubmit={handleAddLabel}
                    className="absolute top-10 left-0 z-20 flex w-64 gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl"
                  >
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
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowReminderInput(!showReminderInput);
                    setShowPalette(false);
                    setShowLabelInput(false);
                  }}
                  className={clsx(
                    'p-2 rounded-full hover:bg-black/5 transition-colors',
                    reminderAt ? 'text-yellow-700' : 'text-gray-600'
                  )}
                  title="Añadir recordatorio"
                >
                  <Bell size={18} />
                </button>

                {showReminderInput && (
                  <div className="absolute top-10 left-0 z-20 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl">
                    <input
                      type="datetime-local"
                      value={reminderAt}
                      onChange={(e) => setReminderAt(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    {reminderAt && (
                      <button
                        type="button"
                        onClick={() => setReminderAt('')}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        <X size={12} />
                        Quitar recordatorio
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
