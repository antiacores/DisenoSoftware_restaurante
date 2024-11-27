import React, { useState } from 'react';
import FondoRestaurante from "../assets/FondoRestaurante.jpeg";

const LoginForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      console.log('Intentando iniciar sesión', { email, password });
    } else {
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Intentando hacer el registro', { email, password });
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Limpiar los campos
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url(${FondoRestaurante})` }}>
      <div className="w-full max-w-lg bg-gray-300 bg-opacity-70 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-950 mb-3">Mar y Olivo</h1>
        <h2 className="text-1xl font-bold text-center text-blue-950 mb-6">
          {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-950 mb-2"
            >
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              placeholder="correo@example.com"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-950 mb-2"
            >
              Contraseña
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              placeholder="Introduce tu contraseña"
            />
          </div>
          {!isLoginMode && (
            <div>
              <label 
                htmlFor="confirm-password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <input 
                type="password" 
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
                placeholder="Confirma tu contraseña"
              />
            </div>
          )}
          <div>
            <button 
              type="submit" 
              className="w-full bg-blue-950 text-white py-3 rounded-md hover:bg-blue-600 
                         transition duration-300 ease-in-out focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>
          {isLoginMode && (
            <div className="text-center mt-4">
              <a 
                href="#" 
                className="text-sm text-blue-950 hover:text-blue-800 hover:underline font-bold"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}
          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-950 hover:text-blue-800 hover:underline font-bold"
              >
              {isLoginMode 
                ? '¿No tienes una cuenta? Regístrate' 
                : '¿Ya tienes una cuenta? Inicia sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
