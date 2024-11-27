import React from 'react';

const Dashboard = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("src/assets/FondoRestaurante.jpeg")' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center text-white p-8">
          <h1 className="text-6xl font-bold">Mar y Olivo</h1>
          <p className="mt-4 text-xl font-light">La tradición de siempre, con un toque especial..</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;