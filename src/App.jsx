import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import MenuGrid from './components/MenuGrid';
import Dashboard from './components/Dashboard';
import './App.css'

function App() {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath === '/login';

  return (
    <Router>
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <div className={`${!isLoginPage ? 'flex-1 ml-0 lg:ml-64' : 'w-full'}`}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/entradas" element={<MenuGrid category="Entradas" />} />
            <Route path="/platos-fuertes" element={<MenuGrid category="PlatosFuertes" />} />
            <Route path="/postres" element={<MenuGrid category="Postres" />} />
            <Route path="/bebidas" element={<MenuGrid category="Bebidas" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;