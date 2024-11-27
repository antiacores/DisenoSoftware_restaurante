import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import baklava from "../assets/images/baklava.jpg"
import falafel from "../assets/images/falafel.jpg";
import berenjena from "../assets/images/berenjena.jpg";
import ceviche from "../assets/images/ceviche.jpg";
import coctel from "../assets/images/coctel.jpg";
import ensalada_griega from "../assets/images/ensalada_griega.jpg";
import hummus from "../assets/images/hummus.jpg";
import limonada from "../assets/images/limonada.jpg";
import mojito from "../assets/images/mojito.jpg";
import paella from "../assets/images/paella.jpg";
import pastel_limon from "../assets/images/pastel_limon.jpg";
import pescado from "../assets/images/pescado.jpg";
import pesto from "../assets/images/pesto.jpg";
import ratatouille from "../assets/images/ratatouille.jpg";
import sangria from "../assets/images/sangria.jpg";
import souvlaki from "../assets/images/souvlaki.jpg";
import tabule from "../assets/images/tabule.jpg";

const MenuGrid = ({ category }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!category) {
        setError('No se especificó una categoría');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Intentando obtener documento:', category);
        
        const docRef = doc(db, 'menu', category);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Datos obtenidos:', docSnap.data());
          const dishesArray = Object.entries(docSnap.data()).map(([id, dish]) => ({
            id,
            ...dish
          }));
          setDishes(dishesArray);
          setError(null);
        } else {
          console.log('No se encontró el documento:', category);
          setError(`No se encontraron platillos en la categoría: ${category}`);
          setDishes([]);
        }
      } catch (err) {
        console.error('Error detallado:', err);
        setError(`Error al cargar el menú: ${err.message}`);
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
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