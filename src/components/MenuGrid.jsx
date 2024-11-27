import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Importar y mapear imágenes
const images = {
  baklava: (await import("../assets/images/baklava.jpg")).default,
  falafel: (await import("../assets/images/falafel.jpg")).default,
  berenjena: (await import("../assets/images/berenjena.jpg")).default,
  ceviche: (await import("../assets/images/ceviche.jpg")).default,
  coctel: (await import("../assets/images/coctel.jpg")).default,
  ensalada_griega: (await import("../assets/images/ensalada_griega.jpg")).default,
  hummus: (await import("../assets/images/hummus.jpg")).default,
  limonada: (await import("../assets/images/limonada.jpg")).default,
  mojito: (await import("../assets/images/mojito.jpg")).default,
  paella: (await import("../assets/images/paella.jpg")).default,
  pastel_limon: (await import("../assets/images/pastel_limon.jpg")).default,
  pescado: (await import("../assets/images/pescado.jpg")).default,
  pesto: (await import("../assets/images/pesto.jpg")).default,
  ratatouille: (await import("../assets/images/ratatouille.jpg")).default,
  sangria: (await import("../assets/images/sangria.jpg")).default,
  souvlaki: (await import("../assets/images/souvlaki.jpg")).default,
  tabule: (await import("../assets/images/tabule.jpg")).default
};

const MenuGrid = ({ category }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        // Obtener colección específica basada en la categoría
        const menuRef = collection(db, 'menu', category, 'items');
        const snapshot = await getDocs(menuRef);
        
        const dishesArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDishes(dishesArray);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el menú: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchDishes();
    }
  }, [category]);

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
          Categoría actual: {category || 'no definida'}
        </div>
      </div>
    );
  }

  if (!dishes.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        No hay platillos disponibles en esta categoría
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
        {category}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div 
            key={dish.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <img
                src={dish.image}
                alt={dish.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300'; // Imagen por defecto si falla la carga
                  console.log('Error al cargar imagen:', dish.image);
                }}
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-gray-900">
                  ${dish.precio}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {dish.nombre}
              </h3>
              <p className="text-gray-600 text-sm">
                {dish.descripcion}
              </p>
              <button 
                onClick={() => addToCart(dish)}
                className="mt-4 w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-800"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;