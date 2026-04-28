import { Lightbulb, Bell, Tag, Archive, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { icon: Lightbulb, label: 'Notas', path: '/' },
  { icon: Bell, label: 'Recordatorios', path: '/reminders' },
  { icon: Tag, label: 'Etiquetas', path: '/labels' },
  { icon: Archive, label: 'Archivo', path: '/archive' },
  { icon: Trash2, label: 'Papelera', path: '/trash' },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={clsx(
        'transition-all duration-300 ease-in-out py-2 flex flex-col',
        isOpen ? 'w-64' : 'w-16 items-center'
      )}
    >
      <nav className="flex-1 w-full space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center h-12 rounded-r-full transition-colors overflow-hidden whitespace-nowrap',
                isOpen ? 'pl-6' : 'justify-center rounded-full w-12 mx-auto',
                isActive
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
            title={!isOpen ? item.label : undefined}
          >
            <item.icon size={24} className={clsx(!isOpen && 'mx-auto')} />
            {isOpen && <span className="ml-4 font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
