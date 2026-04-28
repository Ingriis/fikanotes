export default function Notes() {
  return (
    <div className="flex flex-col items-center justify-center mt-12">
      {/* Input de nota estilo Google Keep (solo visual para Parte 1) */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-gray-200 p-3 mb-8 cursor-text">
        <div className="text-gray-500 font-medium px-2 py-1">Añade una nota...</div>
      </div>
      
      <div className="text-gray-400 mt-20 flex flex-col items-center">
        <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <p className="text-lg">Tus notas aparecerán aquí</p>
        <p className="text-sm mt-2 text-gray-500">(Parte 3 - CRUD de Notas)</p>
      </div>
    </div>
  );
}
