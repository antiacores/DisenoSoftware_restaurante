import React, { useState, useEffect } from "react";
import { Menu, X, Salad, Beef, CakeSlice, Martini, LogOut, ShoppingCart, History, BookMarked } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; // Add signOut import
import SidebarCart from './SidebarCart';
import { Table } from "lucide-react";

const Sidebar = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || user.email);
    }
  }, []);

  // New function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // This properly signs out the user from Firebase
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error al cerrar sesión. Por favor intenta de nuevo.');
    }
  };

  // Sidebar menu groups
  const menuGroups = [
    {
      title: "Menu",
      items: [
        { name: "Entradas", icon: <Salad size={20} />, href: "/entradas" },
        { name: "Platos fuertes", icon: <Beef size={20} />, href: "/platos-fuertes" },
        { name: "Postres", icon: <CakeSlice size={20} />, href: "/postres" },
        { name: "Bebidas", icon: <Martini size={20} />, href: "/bebidas" },
      ]
    },
    {
      title: "Pedidos",
      items: [
        { name: "Historial", icon: <History size={20} />, href: "/historial" },
        { name: "Mesas", icon: <BookMarked size={20} />, href: "/mesas" }
      ]
    }
  ];

  const handleItemClick = (item) => {
    if (item.category === 'Carrito') {
        navigate('/menu'); // Navegar al menú
    }
    else {
      navigate(item.href); // Navegar a la ruta del ítem
    }
    setIsOpen(false); // Cierra la sidebar
  };

  return (
    <div className="flex">
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-950 p-2 rounded-md"
      >
        {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </button>

      {/* Sidebar content */}
      <div className={`fixed top-0 left-0 h-screen bg-blue-950 text-white w-64 transform transition-transform duration-200 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 mb-4">
            <h1 className="text-2xl font-bold">Mar y Olivo</h1>
          </div>

          <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {group.title}
                </h2>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-900 transition-colors duration-200 w-full
                          ${(item.href && location.pathname === item.href) || 
                          (item.category && location.pathname === '/menu') 
                            ? 'bg-blue-900' : ''}`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-blue-900">
            {/* Texto para el username */}
            {username && (
              <div className="text-sm text-gray-300 mb-4 text-center">
                Bienvenido, <span className="font-semibold">{username}</span>
              </div>
            )}

            {/* Botón para cerrar sesión */}
            <button
              onClick={(handleLogout)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-900 transition-colors duration-200 w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 ml-0 lg:ml-32 p-4">
        <div className="container mx-auto">
          {/* Main content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;