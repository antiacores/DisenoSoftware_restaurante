import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/firebaseAuth'; // Importa las funciones correctamente
import FondoRestaurante from "../assets/images/FondoRestaurante.jpeg";

const LoginForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Añadido para manejar errores
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(''); // Limpiar cualquier mensaje de error anterior
    setLoading(true); // Mostrar indicador de carga

    if (isLoginMode) {
      try {
        // Intentar iniciar sesión
        await loginUser(email, password);
        console.log('Sesión iniciada con éxito');
        // Redirigir a dashboard o pantalla de inicio después de iniciar sesión
        window.location.href = "/dashboard";  // Aquí puedes redirigir a un dashboard
      } catch (error) {
        console.error('Error al iniciar sesión', error);
        setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      try {
        // Intentar crear una nueva cuenta
        await registerUser(email, password);
        console.log('Cuenta registrada con éxito');
        // Redirigir a login después de registrarse
        setIsLoginMode(true);
      } catch (error) {
        console.error('Error al registrarse', error);
        setErrorMessage('Error al registrarse. Verifica los datos.');
      }
    }
    setLoading(false); // Ocultar indicador de carga después de la solicitud
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Limpiar los campos
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(''); // Limpiar el mensaje de error al cambiar el modo
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
              className="w-full bg-blue-950 text-white py-3 rounded-md hover:bg-blue-800 
                         transition duration-300 ease-in-out focus:outline-none focus:ring-2 
                         focus:ring-blue-800 focus:ring-opacity-50"
              disabled={loading} // Deshabilitar el botón mientras se procesa
            >
              {loading ? 'Cargando...' : isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-center mt-4">
              <p>{errorMessage}</p>
            </div>
          )}
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