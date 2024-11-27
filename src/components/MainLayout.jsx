import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CartSystem from './OrderCart';

const MainLayout = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...item, quantity: 1}];
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 pb-32">
        {React.cloneElement(children, { addToCart })}
        <CartSystem items={cartItems} setCartItems={setCartItems} />
      </div>
    </div>
  );
};

export default MainLayout;