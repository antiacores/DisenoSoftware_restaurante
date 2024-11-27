import React, { useState } from 'react';
import { FiCreditCard, FiSmartphone } from 'react-icons/fi';

const PaymentModal = ({ 
  total, 
  items, 
  onClose, 
  onPaymentComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [splitBill, setSplitBill] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const paymentMethods = [
    { 
      id: 'tarjeta', 
      name: 'Tarjeta de Crédito', 
      icon: <FiCreditCard className="mr-2" /> 
    },
    { 
      id: 'movil', 
      name: 'Pago Móvil', 
      icon: <FiSmartphone className="mr-2" /> 
    }
  ];

  const splitAmount = splitBill ? (total / numberOfPeople).toFixed(2) : total.toFixed(2);

  const handlePayment = () => {
    // Simular procesamiento de pago
    onPaymentComplete({
      total,
      items,
      paymentMethod,
      splitBill,
      numberOfPeople: splitBill ? numberOfPeople : 1
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-950 text-center">
          Finalizar Pago
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center text-blue-950">
            Total: €{total.toFixed(2)}
          </h3>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-blue-950">
            Método de Pago
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`
                  flex items-center justify-center py-3 rounded-md transition duration-300
                  ${paymentMethod === method.id 
                    ? 'bg-blue-950 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {method.icon}
                {method.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bill Splitting Option */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="splitBill"
              checked={splitBill}
              onChange={() => setSplitBill(!splitBill)}
              className="mr-2"
            />
            <label htmlFor="splitBill" className="text-blue-950">
              Dividir cuenta
            </label>
          </div>

          {splitBill && (
            <div className="flex items-center space-x-4">
              <label className="text-blue-950">Número de personas:</label>
              <input
                type="number"
                min="1"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded-md"
              />
              <span className="text-blue-950">
                (€{splitAmount} por persona)
              </span>
            </div>
          )}
        </div>

        {/* Payment Actions */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;