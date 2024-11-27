import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './services/firebaseConfig';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MenuGrid from './components/MenuGrid';
import OrderHistory from './components/OrderHistory';
import React from 'react';
import './App.css';
import TableManagement from './components/TableManagement';

// Componente PublicRoute: Maneja las rutas públicas y redirecciona si el usuario está autenticado
const PublicRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Nos suscribimos a los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpiamos la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Si hay un usuario autenticado, redirigimos al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no hay usuario, mostramos el contenido de la ruta pública
  return children;
};

// Componente ProtectedLayout: Estructura base para las rutas protegidas
const ProtectedLayout = ({ children, userRole }) => {
  // Modificamos los componentes hijos para incluir información del rol
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && 
       (child.type === MenuGrid || child.type === OrderHistory)) {
      return React.cloneElement(child, { 
        isAdmin: userRole === 'admin',
        userRole: userRole 
      });
    }
    return child;
  });

  return (
    <div className="flex">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-0 lg:ml-64">
        {childrenWithProps}
      </div>
    </div>
  );
};

// Componente ProtectedRoute: Maneja la autenticación y los roles para rutas protegidas
const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          return userDoc.data().role;
        }
        return null;
      } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid);
        setUser(user);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Redirigir al login si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar el rol requerido si se especifica
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Renderizar el contenido protegido con el layout
  return <ProtectedLayout userRole={userRole}>{children}</ProtectedLayout>;
};

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Ruta raíz - Redirecciona al login */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />

          {/* Ruta de login - Pública */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas del menú */}
          <Route
            path="/entradas"
            element={
              <ProtectedRoute>
                <MenuGrid category="Entradas" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/platos-fuertes"
            element={
              <ProtectedRoute>
                <MenuGrid category="Platos fuertes" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/postres"
            element={
              <ProtectedRoute>
                <MenuGrid category="Postres" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bebidas"
            element={
              <ProtectedRoute>
                <MenuGrid category="Bebidas" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mesas"
            element={
              <ProtectedRoute>
                <TableManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;