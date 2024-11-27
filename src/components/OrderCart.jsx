import React, { useState } from 'react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

const OrderCart = ({ items, onUpdateQuantity, onRemoveItem, onProceedToPayment }) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-950">Tu Pedido</h2>
          <span className="text-xl font-bold text-blue-950">
            Total: €{calculateTotal().toFixed(2)}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div 
                key={item.id} 
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <div className="flex-grow mr-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">€{item.price.toFixed(2)} c/u</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    className="bg-gray-200 p-1 rounded-full"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    className="bg-gray-200 p-1 rounded-full"
                  >
                    <FiPlus />
                  </button>
                  <button 
                    onClick={() => onRemoveItem(item)}
                    className="bg-red-100 text-red-600 p-1 rounded-full ml-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={onProceedToPayment}
            disabled={items.length === 0}
            className={`
              flex items-center px-6 py-3 rounded-md text-white font-bold transition duration-300
              ${items.length > 0 
                ? 'bg-blue-950 hover:bg-blue-800' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            <FiShoppingCart className="mr-2" />
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCart;