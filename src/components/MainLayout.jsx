import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;