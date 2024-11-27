import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const DishCard = React.memo(({ dish }) => {
  const imageName = dish.image?.split('/').pop();
  const imageUrl = imageName ? `/src/assets/images/${imageName}` : null;

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
            e.target.src = '/api/placeholder/400/300';
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
      </div>
    </div>
  );
});

const MenuGrid = ({ category }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        console.log('Intentando obtener datos de la categoría:', category);

        // Obtener el documento de la categoría
        const categoryDoc = doc(db, 'menu', category);
        const docSnapshot = await getDoc(categoryDoc);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // Convertir los campos del documento (mapas) en un array de objetos
          const dishesArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value, // Incluye los campos del mapa como propiedades del objeto
          }));

          setDishes(dishesArray);
          setError(null);
        } else {
          throw new Error(`La categoría "${category}" no existe en la base de datos.`);
        }
      } catch (err) {
        console.error('Error detallado:', err);
        setError(err.message);
        setDishes([]);
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
          Categoría actual: {category}
        </div>
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
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;