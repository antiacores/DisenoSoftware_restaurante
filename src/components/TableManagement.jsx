import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

// Componente para mostrar una mesa individual
const TableCard = ({ table, isAdmin, onSelectTable, onUpdateStatus }) => {
  const handleStatusChange = async () => {
    if (isAdmin) {
      await onUpdateStatus(table.id, !table.disponibilidad);
    } else if (table.disponibilidad) {
      await onSelectTable(table);
    }
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-duration-300
      ${!table.disponibilidad && 'opacity-75'}
    `}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {table.nombre}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${table.disponibilidad 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}`}
          >
            {table.disponibilidad ? 'Disponible' : 'Ocupada'}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            Capacidad: {table.capacidad} personas
          </p>
        </div>

        <button
          onClick={handleStatusChange}
          disabled={!isAdmin && !table.disponibilidad}
          className={`
            mt-4 w-full py-2 px-4 rounded-lg text-white font-medium
            ${isAdmin
              ? 'bg-blue-600 hover:bg-blue-700'
              : table.disponibilidad
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isAdmin 
            ? 'Cambiar disponibilidad' 
            : table.disponibilidad
              ? 'Seleccionar mesa'
              : 'Mesa no disponible'
          }
        </button>
      </div>
    </div>
  );
};

// Componente principal para la gestión de mesas
const TableManagement = ({ isAdmin }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las mesas desde Firebase
  const fetchTables = async () => {
    try {
      setLoading(true);
      const tablesRef = collection(db, 'tables');
      const querySnapshot = await getDocs(tablesRef);

      if (!querySnapshot.empty) {
        const tablesArray = querySnapshot.docs.map(doc => ({
          id: doc.id, // ID del documento
          ...doc.data(), // Datos de la mesa
        }));
        setTables(tablesArray);
        setError(null);
      } else {
        throw new Error('No se encontraron mesas en la base de datos.');
      }
    } catch (err) {
      console.error('Error al cargar las mesas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Función para que el administrador actualice el estado de una mesa
  const handleUpdateTableStatus = async (tableId, newStatus) => {
    try {
      const tableDoc = doc(db, 'tables', tableId);
      await updateDoc(tableDoc, {
        disponibilidad: newStatus
      });
      await fetchTables(); // Recargar las mesas
    } catch (error) {
      console.error('Error al actualizar el estado de la mesa:', error);
      alert('Error al actualizar el estado de la mesa');
    }
  };

  // Función para que el cliente seleccione una mesa
  const handleSelectTable = async (table) => {
    if (!table.disponibilidad) {
      alert('Esta mesa ya no está disponible');
      return;
    }

    const confirmSelection = window.confirm(`¿Deseas seleccionar la ${table.nombre}?`);
    if (confirmSelection) {
      try {
        await handleUpdateTableStatus(table.id, false);
        alert(`Has reservado la ${table.nombre} exitosamente`);
      } catch (error) {
        console.error('Error al seleccionar la mesa:', error);
        alert('Error al seleccionar la mesa');
      }
    }
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {isAdmin ? 'Gestión de Mesas' : 'Selección de Mesa'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            isAdmin={isAdmin}
            onSelectTable={handleSelectTable}
            onUpdateStatus={handleUpdateTableStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default TableManagement;