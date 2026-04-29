import { useState, useRef, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import clsx from 'clsx';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS } from '../lib/constants';
import RichTextEditor from './RichTextEditor';

export default function NoteEditor() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-white');
  const [showPalette, setShowPalette] = useState(false);
  
  const { addNote } = useNotes();
  const editorRef = useRef(null);

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

  const handleSave = async () => {
    if (title.trim() || content.trim()) {
      try {
        await addNote({ title, content, color });
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
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 border-opacity-50">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPalette(!showPalette)}
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
              </div>
              
              <div className="flex gap-2">
                <button
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
