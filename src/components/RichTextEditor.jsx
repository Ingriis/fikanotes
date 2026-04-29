/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function RichTextEditor({ content, onChange, placeholder = "Añade una nota..." }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Set initial content only once when mounting if it's not empty, 
  // to avoid jumping cursor issues in contentEditable
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []); // intentionally empty to run only once or we can handle it carefully

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertImage = (src) => {
    const imgHtml = `
      <div class="image-container" contenteditable="false" style="position: relative; display: inline-block; width: 30%; margin: 8px 4px; vertical-align: top;">
        <img src="${src}" style="width: 100%; height: auto; border-radius: 8px; display: block;" />
        <div data-action="delete-image" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background-color: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: sans-serif; font-weight: bold; font-size: 12px; line-height: 1; z-index: 10; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ✕
        </div>
      </div>&nbsp;
    `;

    if (!editorRef.current) return;

    editorRef.current.insertAdjacentHTML('beforeend', imgHtml);
    editorRef.current.focus();
    handleInput();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.id) {
      alert('Inicia sesión para subir imágenes.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado pesada. Intenta con una imagen menor a 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const path = `${user.id}/${safeName}`;

    try {
      const { error } = await supabase.storage
        .from('note-images')
        .upload(path, file, {
          cacheControl: '31536000',
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage.from('note-images').getPublicUrl(path);
      insertImage(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      const dataUrl = await fileToDataUrl(file);
      insertImage(dataUrl);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditorClick = (e) => {
    // Si se hace clic en el botón X de la imagen nueva
    if (e.target.dataset.action === 'delete-image') {
      const container = e.target.closest('.image-container');
      if (container) {
        container.remove();
        handleInput();
      }
    } 
    // Fallback: Si es una imagen antigua (insertada antes de la actualización)
    else if (e.target.tagName === 'IMG' && !e.target.closest('.image-container')) {
      if (window.confirm('¿Deseas eliminar esta imagen antigua? (Las nuevas tendrán una X en la esquina)')) {
        e.target.remove();
        handleInput();
      }
    }
  };

  return (
    <div className="flex flex-col w-full group/editor">
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2 opacity-50 group-focus-within/editor:opacity-100 transition-opacity pb-2 border-b border-gray-200 border-opacity-30">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Negrita"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Cursiva"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Subrayado"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Tachado"
        >
          <Strikethrough size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Lista de viñetas"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-gray-700 hover:bg-black/10 rounded-md transition-colors"
          title="Subir imagen"
        >
          <ImageIcon size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onClick={handleEditorClick}
        className="w-full bg-transparent outline-none min-h-[80px] max-h-[60vh] overflow-y-auto text-gray-800 prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 break-words cursor-text"
        placeholder={placeholder}
        style={{
          // Custom placeholder styling for contentEditable
          '--placeholder': `"${placeholder}"`,
        }}
      />
      <style>{`
        div[contenteditable]:empty:before {
          content: var(--placeholder);
          color: #6b7280; /* Tailwind text-gray-500 */
          pointer-events: none;
          display: block; /* For Firefox */
        }
        /* Custom styles for lists in the editor */
        div[contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
}
