import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import SidebarCart from './SidebarCart';
import { ShoppingCart } from 'lucide-react';

// Componente para gestionar el formulario de platillos (crear/editar)
const DishForm = ({ dish = {}, onSubmit, onCancel, category }) => {
  const [formData, setFormData] = useState({
    nombre: dish.nombre || '',
    descripcion: dish.descripcion || '',
    precio: dish.precio || '',
    image: dish.image || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Extraemos solo el nombre del archivo de la ruta completa
    const imageName = formData.image.split('/').pop();
    
    const updatedData = {
      ...formData,
      image: imageName // Guardamos solo el nombre del archivo
    };
    
    onSubmit(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {dish.id ? 'Editar Platillo' : 'Nuevo Platillo'}
          </h3>
          <button onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio*</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del archivo de imagen
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ejemplo.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {dish.id ? 'Guardar Cambios' : 'Crear Platillo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente para mostrar cada platillo individual
const DishCard = React.memo(({ dish, onAdd, onRemove, quantity, isAdmin, onEdit, onDelete }) => {
  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    
    // Remove any file extension if it exists
    const filename = imagePath.split('/').pop().split('.')[0];
    
    // Check if the image exists in common formats
    const formats = ['.jpg', '.jpeg', '.png', '.webp'];
    
    // Try to find the first existing image
    for (const format of formats) {
      const testUrl = `/images/${filename}${format}`;
      // We can't check if the file exists client-side, so we'll try loading it
      return testUrl;
    }
    
    return '/images/placeholder.jpg';
  };

  const imageUrl = getImageUrl(dish.image);
  
  // Add this console.log to debug image paths
  console.log('Loading image:', imageUrl, 'from dish:', dish.image);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={dish.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error('Error loading image:', imageUrl);
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-gray-900">
            ${dish.precio}
          </span>
        </div>
        {isAdmin && (
          <div className="absolute top-4 left-4 flex space-x-2">
            <button
              onClick={() => onEdit(dish)}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
            >
              <Edit2 size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(dish)}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {dish.nombre}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {dish.descripcion}
        </p>
        {!isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRemove(dish)}
              className="px-2 py-1 bg-gray-300 rounded-full"
              disabled={quantity === 0}
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => onAdd(dish)}
              className="px-2 py-1 bg-gray-300 rounded-full"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

// Componente principal MenuGrid
const MenuGrid = ({ category, isAdmin = false }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Función para cargar los platillos de la categoría
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const categoryDoc = doc(db, 'menu', category);
      const docSnapshot = await getDoc(categoryDoc);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const dishesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setDishes(dishesArray);
        setError(null);
      } else {
        throw new Error(`La categoría "${category}" no existe en la base de datos.`);
      }
    } catch (err) {
      console.error('Error al cargar los platillos:', err);
      setError(err.message);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchDishes();
    }
  }, [category]);

// Esta es la función principal que maneja la creación de nuevos platillos
const handleCreateDish = async (dishData) => {
  try {
    const categoryDoc = doc(db, 'menu', category);
    const docSnapshot = await getDoc(categoryDoc);
    const currentData = docSnapshot.exists() ? docSnapshot.data() : {};
    
    // Generamos un ID único usando timestamp para evitar duplicados
    const timestamp = new Date().getTime();
    const newId = `${category.toLowerCase()}_${timestamp}`;
    
    // Creamos el nuevo platillo con metadatos
    const newDish = {
      ...dishData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Actualizamos el documento con el nuevo platillo
    await setDoc(categoryDoc, {
      ...currentData,
      [newId]: newDish
    }, { merge: true });

    setShowForm(false);
    await fetchDishes(); // Actualizamos la lista de platillos
    
    alert('Platillo creado exitosamente');
  } catch (error) {
    console.error('Error al crear platillo:', error);
    alert('Error al crear el platillo: ' + error.message);
  }
};

  const handleUpdateDish = async (dishData) => {
    try {
      const categoryDoc = doc(db, 'menu', category);
      const docSnapshot = await getDoc(categoryDoc);
      const currentData = docSnapshot.exists() ? docSnapshot.data() : {};
      
      await setDoc(categoryDoc, {
        ...currentData,
        [editingDish.id]: dishData
      });

      setEditingDish(null);
      fetchDishes();
    } catch (error) {
      console.error('Error al actualizar platillo:', error);
      alert('Error al actualizar el platillo');
    }
  };

  const handleDeleteDish = async (dish) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este platillo?')) {
      return;
    }

    try {
      const categoryDoc = doc(db, 'menu', category);
      const docSnapshot = await getDoc(categoryDoc);
      const currentData = docSnapshot.exists() ? docSnapshot.data() : {};
      
      const { [dish.id]: deletedDish, ...remainingDishes } = currentData;
      
      await setDoc(categoryDoc, remainingDishes);
      fetchDishes();
    } catch (error) {
      console.error('Error al eliminar platillo:', error);
      alert('Error al eliminar el platillo');
    }
  };

  // Funciones para el carrito
  const handleAddToCart = (dish) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[dish.id]) {
        newCart[dish.id].quantity += 1;
      } else {
        newCart[dish.id] = { ...dish, quantity: 1 };
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (dish) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[dish.id] && newCart[dish.id].quantity > 0) {
        newCart[dish.id].quantity -= 1;
        if (newCart[dish.id].quantity === 0) {
          delete newCart[dish.id];
        }
      }
      return newCart;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">{error}</div>
        <div className="text-gray-600">
          Categoría actual: {category}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 capitalize">
        {category}
      </h2>
      {isAdmin && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Agregar
        </button>
      )}
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
            quantity={cart[dish.id] ? cart[dish.id].quantity : 0}
            isAdmin={isAdmin}
            onEdit={setEditingDish}
            onDelete={handleDeleteDish}
          />
        ))}
      </div>

      {/* Modal del formulario */}
{(showForm || editingDish) && (
  <DishForm
    dish={editingDish}
    onSubmit={editingDish ? handleUpdateDish : handleCreateDish}
    onCancel={() => {
      setShowForm(false);
      setEditingDish(null);
    }}
    category={category}
  />
)}

      {/* Carrito lateral (solo visible para clientes) */}
      {!isAdmin && (
        <>
          <SidebarCart
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            cart={cart}
          />
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg">
          <ShoppingCart />
          </button>
        </>
      )}
    </div>
  );
};

export default MenuGrid;