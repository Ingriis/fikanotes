import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, Coffee, Sparkles, Heart, Star } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 1
    }));
    setStars(generatedStars);

    const generatedCoffees = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      size: Math.random() * 25 + 20
    }));
    setCoffees(generatedCoffees);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Esperamos un segundo para asegurar que onAuthStateChange haya actualizado el contexto global
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none animate-twinkle"
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

      {coffees.map((coffee) => (
        <div
          key={coffee.id}
          className="absolute pointer-events-none animate-float-delayed opacity-10"
          style={{
            left: `${coffee.left}%`,
            top: `${coffee.top}%`,
            animationDelay: `${coffee.delay}s`,
          }}
        >
          <Coffee size={coffee.size} className="text-yellow-500" />
        </div>
      ))}

      <div className="absolute top-10 left-5 animate-spin-slow opacity-10">
        <Star size={45} className="text-yellow-400" />
      </div>
      <div className="absolute bottom-10 right-8 animate-float opacity-10">
        <Heart size={40} className="text-yellow-400" />
      </div>

      <div className="max-w-md w-full animate-zoomIn relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-3xl shadow-xl mb-4 animate-bounce-soft hover-scale">
            <Coffee size={48} className="text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-700 animate-slideInLeft flex items-center justify-center gap-2">
            FikaNotes
            <Sparkles size={20} className="text-yellow-400 animate-twinkle-fast" />
          </h1>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-2 animate-fadeInUp">
            <Coffee size={14} className="text-yellow-500" />
            Tu rincón de notas con café ☕
            <Coffee size={14} className="text-yellow-500" />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover-glow transition-all duration-300 animate-slideInRight">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={20} className="text-yellow-400 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700 animate-pulse-soft">¡Bienvenida/o!</h2>
            <Sparkles size={20} className="text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <Mail size={16} className="inline mr-1 animate-blink" /> Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:shadow-md hover-scale"
                placeholder="hola@fikanotes.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <Lock size={16} className="inline mr-1 animate-blink" /> Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:shadow-md hover-scale"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 transition-colors hover:underline hover-wiggle inline-block">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-fast"></div>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="group-hover:animate-wiggle" /> Iniciar sesión
                    <Coffee size={14} className="inline-block group-hover:animate-heartBeat" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              ¿Eres nueva/o?{' '}
              <Link to="/register" className="text-yellow-500 hover:text-yellow-600 font-medium hover:underline transition-all hover-rotate inline-block">
                Crear una cuenta 💛
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2 animate-blink">
            <Coffee size={10} className="text-yellow-500" />
            ✨ Cada nota es un pequeño recuerdo ✨
            <Coffee size={10} className="text-yellow-500" />
          </p>
        </div>
        {/* Debug info - Remove later */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Conectado a: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 30)}...
        </div>
      </div>
    </div>
  );
}