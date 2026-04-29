import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, Image as ImageIcon } from 'lucide-react';

export default function RichTextEditor({ content, onChange, placeholder = "Añade una nota..." }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Límite de seguridad: 1MB máximo por imagen para evitar colapsos en la base de datos
    if (file.size > 1024 * 1024) {
      alert('⚠️ La imagen es demasiado pesada (Máximo 1MB). Por favor, intenta con una imagen más ligera o comprimida.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      
      // Creamos una estructura HTML con la imagen y un botón 'X' posicionado
      // Al cambiar el ancho al 30%, las imágenes consecutivas se acomodarán una al lado de la otra automáticamente
      const imgHtml = `
        <div class="image-container" contenteditable="false" style="position: relative; display: inline-block; width: 30%; margin: 8px 4px; vertical-align: top;">
          <img src="${base64String}" style="width: 100%; height: auto; border-radius: 8px; display: block;" />
          <div data-action="delete-image" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background-color: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: sans-serif; font-weight: bold; font-size: 12px; line-height: 1; z-index: 10; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ✕
          </div>
        </div>&nbsp;
      `;
      
      // Insertamos el HTML personalizado
      execCommand('insertHTML', imgHtml);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
