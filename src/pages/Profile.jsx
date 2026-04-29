import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, LogOut, Save, Coffee, Heart } from 'lucide-react';

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateProfile({ full_name: fullName });
      setMessage('✨ Perfil actualizado con éxito');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full shadow-lg mb-4">
          <span className="text-4xl">📓</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
          Tu rincón personal
        </h1>
        <p className="text-gray-500 mt-2">Aquí viven tus recuerdos y pensamientos</p>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-100">
          <div className="flex items-center gap-2">
            <Coffee size={20} className="text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-700">Mi perfil</h2>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
          {message && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center text-gray-600">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <User size={16} className="inline mr-1" /> Nombre
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none bg-gray-50"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <Mail size={16} className="inline mr-1" /> Correo electrónico
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">El correo no se puede cambiar</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-white font-medium py-2 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </form>
      </div>

      {}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
          <Heart size={14} />
          <span>Hecho con nostalgia para ti</span>
          <Heart size={14} />
        </div>
      </div>
    </div>
  );
}
