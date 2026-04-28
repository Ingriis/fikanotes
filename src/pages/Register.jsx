import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Sparkles, Heart, Star, Coffee } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    const generatedStars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 1
    }));
    setStars(generatedStars);

    const generatedCoffees = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      size: Math.random() * 25 + 15
    }));
    setCoffees(generatedCoffees);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden 💔');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
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
          className="absolute pointer-events-none animate-float opacity-10"
          style={{
            left: `${coffee.left}%`,
            top: `${coffee.top}%`,
            animationDelay: `${coffee.delay}s`,
          }}
        >
          <Coffee size={coffee.size} className="text-yellow-500" />
        </div>
      ))}

      <div className="absolute bottom-10 left-5 animate-spin-slow opacity-10">
        <Star size={50} className="text-yellow-400" />
      </div>
      <div className="absolute top-20 right-8 animate-float-delayed opacity-10">
        <Heart size={45} className="text-yellow-400" />
      </div>

      <div className="max-w-md w-full animate-zoomIn relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-3xl shadow-xl mb-4 animate-bounce-hard hover-scale">
            <UserPlus size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-700 animate-slideInRight flex items-center justify-center gap-2">
            FikaNotes
            <Coffee size={24} className="text-yellow-500 animate-float" />
          </h1>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-2 animate-fadeInUp">
            <Sparkles size={14} className="text-yellow-400 animate-twinkle-fast" />
            Comienza tu historia
            <Sparkles size={14} className="text-yellow-400 animate-twinkle-fast" style={{ animationDelay: '0.5s' }} />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover-glow transition-all duration-300 animate-slideInLeft">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={20} className="text-yellow-400 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700 animate-pulse-soft">Crear una cuenta</h2>
            <Sparkles size={20} className="text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <User size={16} className="inline mr-1 animate-blink" /> Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:shadow-md hover-scale"
                placeholder="Tu nombre"
              />
            </div>

            <div>
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
                placeholder="•••••••• (mín. 6 caracteres)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <Lock size={16} className="inline mr-1 animate-blink" /> Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:shadow-md hover-scale"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-fast"></div>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="group-hover:animate-wiggle" /> Registrarse
                    <Heart size={14} className="inline-block group-hover:animate-heartBeat" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-medium hover:underline transition-all hover-rotate inline-block">
                Iniciar sesión 💛
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2 animate-blink">
            <Coffee size={10} className="text-yellow-500" />
            💛 Únete a la comunidad de FikaNotes 💛
            <Coffee size={10} className="text-yellow-500" />
          </p>
        </div>
      </div>
    </div>
  );
}