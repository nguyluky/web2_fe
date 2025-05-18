import { Outlet } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import SideBar from './SideBar';

const LayoutAdmin = () => {

    const {isAuthenticated, account} = useAuth();
    
    if (!isAuthenticated || account?.rule != 1) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Access Denied</h1>
            </div>
        );
    }

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
