import { Tag } from 'lucide-react';

export default function Labels() {
  return (
    <div className="flex flex-col mt-4 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      <div className="text-gray-400 mt-20 flex flex-col items-center">
        <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
          <Tag size={40} className="text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-500">Aún no hay etiquetas</p>
        <p className="text-sm text-gray-400 mt-2">Las etiquetas que crees aparecerán aquí</p>
      </div>
    </div>
  );
}