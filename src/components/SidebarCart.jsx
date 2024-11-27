import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

const SidebarCart = ({ open, onOpenChange, cart }) => {
  const safeCart = cart || {};
  const total = Object.values(safeCart).reduce((acc, item) => acc + item.quantity * item.precio, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayClick = () => {
    if (Object.keys(safeCart).length === 0) {
      alert('El carrito está vacío');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailChange = (event) => {
    const { name, value } = event.target;
    setCardDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmitPayment = async () => {
    // Validaciones básicas
    if (!paymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert('Por favor completa todos los campos de la tarjeta');
        return;
      }
    }

    try {
      setIsProcessing(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Preparar los detalles del pedido
      const orderDetails = {
        userId: user.uid,
        customerName: user.displayName || user.email,
        items: Object.values(safeCart).map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.quantity,
          subtotal: item.precio * item.quantity
        })),
        total: total,
        paymentMethod: paymentMethod,
        status: 'pendiente',
        createdAt: serverTimestamp(),
        // Información adicional que podría ser útil
        mesa: null, // Para asignar posteriormente
        notas: '', // Para comentarios adicionales
      };

      // Crear una nueva orden en la colección de orders del usuario
      const userOrdersRef = collection(db, 'users', user.uid, 'orders');
      const orderRef = await addDoc(userOrdersRef, orderDetails);

      console.log('Pedido creado exitosamente:', orderRef.id);
      
      // Cerrar el modal y limpiar el estado
      setIsModalOpen(false);
      onOpenChange(false); // Cerrar el carrito
      
      // Aquí podrías emitir un evento para limpiar el carrito en el componente padre
      // Por ejemplo: onOrderComplete();

      alert('¡Pedido realizado con éxito! Tu número de orden es: ' + orderRef.id);

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white border-l shadow-lg transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300`}
      >
        {/* Resto del JSX del carrito permanece igual */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Carrito</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-xl font-semibold text-gray-600"
          >
            X
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <ul>
            {Object.values(safeCart).length > 0 ? (
              Object.values(safeCart).map((item) => (
                item.quantity > 0 && (
                  <li key={item.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800">{item.nombre}</span>
                      <span className="text-gray-600">x {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.quantity * item.precio).toFixed(2)}
                    </span>
                  </li>
                )
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </ul>
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePayClick}
            className="w-full py-2 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </div>

      {/* Modal de pago */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cash"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handlePaymentMethodChange}
                  className="form-radio"
                />
                <label htmlFor="cash">Efectivo</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="card"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                  className="form-radio"
                />
                <label htmlFor="card">Tarjeta</label>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitPayment}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-800 disabled:bg-gray-400"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarCart;