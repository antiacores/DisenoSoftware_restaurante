import React, { useState } from "react";
import { Menu, X, Salad, Beef, CakeSlice, Martini, LogOut, ShoppingCart, History} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onCategorySelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Separamos los items en dos tipos: rutas y categorías del menú
    const menuGroups = [
        {
            title: "Menú",
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
                { name: "Carrito", icon: <ShoppingCart size={20} />, href: "/carrito" },
                { name: "Historial", icon: <History size={20} />, href: "/historial" },
            ]
        }
    ]

    const handleItemClick = (item) => {
        if (item.category) {
            // Si es una categoría del menú
            navigate('/menu'); // Navega a la página del menú
            onCategorySelect(item.category); // Actualiza la categoría seleccionada
        } else {
            // Si es una ruta normal
            navigate(item.href);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-blue-950 p-2 rounded-md"
            >
                {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>

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
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-900 transition-colors duration-200 w-full"
                        >
                            <LogOut size={20} />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 ml-0 lg:ml-64 p-4">
                <div className="container mx-auto">
                    {/* Aquí va el contenido de cada ruta */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;