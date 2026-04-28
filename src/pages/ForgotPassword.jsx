import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, ArrowLeft, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-yellow-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">¡Revisa tu correo!</h2>
            <p className="text-gray-500 mb-4">
              Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
            >
              <ArrowLeft size={16} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl shadow-lg mb-4">
            <KeyRound size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-500 mt-2">No te preocupes, ¡pasa seguido! ✨</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-yellow-100">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-yellow-400" />
            <h2 className="text-xl font-semibold text-gray-700">Recuperar acceso</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <Mail size={16} className="inline mr-1" /> Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-white font-medium py-2 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-yellow-600 hover:text-yellow-700 text-sm inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}