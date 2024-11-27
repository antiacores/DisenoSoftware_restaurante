import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import { Clock, DollarSign, CreditCard, Check, X, Clock3 } from 'lucide-react';

// Componente para mostrar cada orden individual
const OrderCard = ({ order, isAdmin, onStatusChange }) => {
  // Función para formatear las fechas en español
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Opciones de estado para las órdenes
  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
    { value: 'entregado', label: 'Entregado', color: 'green' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' }
  ];

  // Función para obtener el ícono correspondiente al estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'entregado': return <Check size={16} className="text-green-600" />;
      case 'cancelado': return <X size={16} className="text-red-600" />;
      default: return <Clock3 size={16} className="text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Encabezado con número de orden y estado */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Orden #{order.id.slice(-6)}
          </h3>
          {isAdmin ? (
            // Selector de estado para administradores
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer
                ${order.status === 'entregado' ? 'border-green-500 text-green-800 bg-green-50' :
                order.status === 'cancelado' ? 'border-red-500 text-red-800 bg-red-50' :
                'border-yellow-500 text-yellow-800 bg-yellow-50'}`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            // Indicador de estado para clientes
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
              ${order.status === 'entregado' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelado' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'}`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          )}
        </div>

        {/* Información del cliente (solo visible para admin) */}
        {isAdmin && (
          <div className="mb-3 text-sm text-gray-600">
            <span className="font-semibold">Cliente: </span>
            {order.customerName}
          </div>
        )}

        {/* Detalles de fecha y método de pago */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            {order.paymentMethod === 'card' ? <CreditCard size={16} /> : <DollarSign size={16} />}
            <span>{order.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}</span>
          </div>
        </div>

        {/* Lista de productos en la orden */}
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-700">Productos:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{item.cantidad}x</span>
                <span className="text-gray-800">{item.nombre}</span>
              </div>
              <span className="text-gray-600">${(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total de la orden */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-800">Total:</span>
          <span className="font-bold text-blue-950">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Componente principal para el historial de órdenes
const OrderHistory = () => {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const auth = getAuth();

  // Efecto para cargar las órdenes al montar el componente
  useEffect(() => {
    const fetchUserRoleAndOrders = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No hay usuario autenticado');
        }

        // Obtener el documento del usuario y su rol
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          throw new Error('Usuario no encontrado');
        }

        const role = userDocSnap.data().role;
        setUserRole(role);

        if (role === 'admin') {
          // Obtener órdenes de todos los usuarios para administradores
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const allOrders = {};

          for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const ordersRef = collection(db, 'users', userDoc.id, 'orders');
            const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
            const ordersSnapshot = await getDocs(ordersQuery);

            if (!ordersSnapshot.empty) {
              allOrders[userDoc.id] = {
                userName: userData.username || userData.email || 'Usuario sin nombre',
                orders: ordersSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
              };
            }
          }
          setOrders(allOrders);
          
        } else {
          // Obtener solo las órdenes del usuario actual
          const userOrdersRef = collection(db, 'users', user.uid, 'orders');
          const q = query(userOrdersRef, orderBy('createdAt', 'desc'));
          const orderSnapshot = await getDocs(q);

          setOrders({
            [user.uid]: {
              userName: userDocSnap.data().username || user.email,
              orders: orderSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
            }
          });
        }

      } catch (err) {
        console.error('Error al obtener las órdenes:', err);
        setError('No se pudo cargar el historial de órdenes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndOrders();
  }, []);

  // Función para actualizar el estado de una orden
  const handleStatusChange = async (orderId, newStatus, userId) => {
    try {
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        lastUpdated: new Date()
      });
      
      // Actualizar el estado local
      setOrders(prevOrders => {
        const updatedOrders = { ...prevOrders };
        if (updatedOrders[userId]?.orders) {
          updatedOrders[userId].orders = updatedOrders[userId].orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          );
        }
        return updatedOrders;
      });

    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      alert('Error al actualizar el estado de la orden. Por favor, intenta de nuevo.');
    }
  };

  // Renderizado del estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Renderizado del estado de error
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">{error}</div>
      </div>
    );
  }

  // Renderizado principal del componente
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {userRole === 'admin' ? 'Gestión de Pedidos' : 'Mi Historial de Pedidos'}
      </h2>
      
      {Object.entries(orders).map(([userId, userData]) => (
        <div key={userId} className="mb-12">
          {/* Mostrar nombre del usuario solo en vista de admin */}
          {userRole === 'admin' && (
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Pedidos de {userData.userName}
            </h3>
          )}
          
          {/* Mostrar mensaje si no hay pedidos */}
          {userData.orders.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay pedidos para mostrar.
            </div>
          ) : (
            // Grid de tarjetas de pedidos
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {userData.orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isAdmin={userRole === 'admin'}
                  onStatusChange={(orderId, newStatus) => 
                    handleStatusChange(orderId, newStatus, userId)
                  }
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;