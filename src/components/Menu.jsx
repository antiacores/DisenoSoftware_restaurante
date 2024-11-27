import React, { useState } from 'react';
import { FiSave, FiEdit, FiTrash2 } from 'react-icons/fi';

const MenuManagement = () => {
  const [dish, setDish] = useState({
    name: '',
    category: '',
    image: '',
    price: 0,
    description: '',
    available: true,
  });

  const handleInputChange = (e) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const handleToggleAvailability = () => {
    setDish({ ...dish, available: !dish.available });
  };

  const handleSave = () => {
    // Lógica para guardar el plato en Firebase
    console.log('Guardando plato:', dish);
  };

  const handleUpdate = () => {
    // Lógica para actualizar el plato en Firebase
    console.log('Actualizando plato:', dish);
  };

  const handleDelete = () => {
    // Lógica para eliminar el plato de Firebase
    console.log('Eliminando plato:', dish);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Menú</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nombre del Plato
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={dish.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Resto de los campos del formulario */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={dish.id ? handleUpdate : handleSave}
          >
            {dish.id ? <FiEdit className="mr-2" /> : <FiSave className="mr-2" />}
            {dish.id ? 'Actualizar' : 'Guardar'}
          </button>
          {dish.id && (
            <button
              type="button"
              className="bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleDelete}
            >
              <FiTrash2 className="mr-2" />
              Eliminar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MenuManagement;