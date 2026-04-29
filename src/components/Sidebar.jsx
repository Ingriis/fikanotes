import { Lightbulb, Bell, Tag, Archive, Trash2, Sparkles, Coffee } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useState } from 'react';

const navItems = [
  { icon: Lightbulb, label: 'Notas', path: '/', emoji: '📝' },
  { icon: Bell, label: 'Recordatorios', path: '/reminders', emoji: '🔔' },
  { icon: Tag, label: 'Etiquetas', path: '/labels', emoji: '🏷️' },
  { icon: Archive, label: 'Archivo', path: '/archive', emoji: '📦' },
  { icon: Trash2, label: 'Papelera', path: '/trash', emoji: '🗑️' },
];

export default function Sidebar({ isOpen }) {
  const [coffees] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 20 + 15
    }))
  );

  return (
    <aside
      className={clsx(
        'transition-all duration-300 ease-in-out py-4 flex flex-col bg-white/80 backdrop-blur-sm border-r border-gray-100 relative overflow-hidden',
        isOpen ? 'w-64' : 'w-20 items-center'
      )}
    >
      {coffees.map((coffee) => (
        <div
          key={coffee.id}
          className="absolute pointer-events-none animate-float-delayed opacity-15"
          style={{
            left: `${coffee.left}%`,
            top: `${coffee.top}%`,
            animationDelay: `${coffee.delay}s`,
          }}
        >
          <Coffee size={coffee.size} className="text-yellow-500" />
        </div>
      ))}

      <nav className="flex-1 w-full space-y-2 relative z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center h-12 rounded-r-full transition-all duration-200 overflow-hidden whitespace-nowrap group',
                isOpen ? 'pl-6' : 'justify-center rounded-full w-12 mx-auto',
                isActive
                  ? 'bg-yellow-100 text-yellow-800 shadow-md'
                  : 'text-gray-600 hover:bg-yellow-50 hover:scale-105'
              )
            }
            title={!isOpen ? item.label : undefined}
          >
            <div className="relative">
              <item.icon size={22} className={clsx('transition-all group-hover:scale-110 group-hover:rotate-6', !isOpen && 'mx-auto')} />
              {!isOpen && (
                <span className="absolute -top-2 -right-3 text-xs animate-bounce-soft">
                  {item.emoji}
                </span>
              )}
            </div>
            {isOpen && (
              <>
                <span className="ml-4 font-medium group-hover:animate-pulse-soft flex items-center gap-2">
                  {item.label}
                  <span className="text-xs opacity-60 animate-pulse">{item.emoji}</span>
                </span>
                {item.label === 'Notas' && <Sparkles size={12} className="ml-1 text-yellow-400 animate-twinkle" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      {isOpen && (
        <div className="mt-auto p-4 text-center border-t border-gray-100 pt-4 relative z-10">
          <div className="text-xs text-gray-400 flex items-center justify-center gap-2 animate-pulse-soft">
            <Coffee size={12} className="text-yellow-500" />
            Fika · 2026
            <Coffee size={12} className="text-yellow-500" />
          </div>
        </div>
      )}
    </aside>
  );
}
