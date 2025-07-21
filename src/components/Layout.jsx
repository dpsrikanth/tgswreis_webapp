
import Header from './common/Header';
import SideMenu from './common/SideMenu';
import { useSidebar } from './common/SidebarProvider';
import { Outlet } from "react-router-dom";
const Layout = ({ children }) => {
  const { isOpen, setSidebarState } = useSidebar();
  return (
    <>
    
      <SideMenu isOpen={isOpen} />
      <div className='main'>
        <Header />
        <hr />
        <Outlet /> {/* This is where nested routes render */}
        {children}
      </div>
    </>
  );
};

export default Layout;
