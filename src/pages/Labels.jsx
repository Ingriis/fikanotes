import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Coffee, Sparkles, Heart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Generar estrellitas flotantes
  useEffect(() => {
    const generatedStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1
    }));
    setStars(generatedStars);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Estrellitas flotantes */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute text-yellow-300 pointer-events-none animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            fontSize: `${star.size}px`,
            opacity: 0.6
          }}
        >
          ✨
        </div>
      ))}

      {/* Corazones decorativos */}
      <div className="absolute top-20 left-10 opacity-10 animate-float">
        <Heart size={40} className="text-yellow-400" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 animate-float-delayed">
        <Heart size={30} className="text-yellow-400" />
      </div>

      <div className="max-w-md w-full animate-fadeInUp relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl shadow-lg mb-4 animate-bounce-soft">
            <Coffee size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-700">FikaNotes</h1>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-yellow-400" />
            Tu rincón de notas con café ☕
            <Sparkles size={14} className="text-yellow-400" />
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover-shadow-glow transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={18} className="text-yellow-400 animate-pulse" />
            <h2 className="text-xl font-semibold text-gray-700">¡Bienvenida/o!</h2>
            <Sparkles size={18} className="text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <Mail size={16} className="inline mr-1" /> Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50 group-hover:shadow-md"
                placeholder="hola@fikanotes.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <Lock size={16} className="inline mr-1" /> Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 transition-colors hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-yellow-400 text-white font-medium py-2 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Iniciar sesión
                    <Heart size={14} className="inline-block animate-heartBeat" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              ¿Eres nueva/o?{' '}
              <Link to="/register" className="text-yellow-500 hover:text-yellow-600 font-medium hover:underline">
                Crear una cuenta 💛
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ✨ Cada nota es un pequeño recuerdo ✨
        </p>
      </div>
    </div>
  );
}