import React from "react";
import { FiMenu } from 'react-icons/fi';

const Header = () => {
    const handleLogout = () => {
        console.log("Esperando a cerrar sesión o cambiar perfil")
    };

    return (
        <header className="w-full bg-blue-950 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-10">

            <div className="flex items-center">
                <h1 className="text-1xl font-bold">Mar y Olivo</h1>
            </div>
            <button
                className="bg-blue-950 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleLogout}
            >
                <FiMenu className="mr-2" />
                Perfil
            </button>
        </header>
    );
};

export default Header;
