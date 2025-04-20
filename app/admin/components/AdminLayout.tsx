import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

const LayoutAdmin = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <SideBar />
      </div>
      <div className="flex-1 md:ml-64">
        {/* Main Content */}
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
