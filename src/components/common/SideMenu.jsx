import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';

// SideMenu Component
const SideMenu = () => {
    const RoleDisplayName = useSelector((state) => state.userappdetails.profileData.RoleDisplayName)
      const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    return (
        <div className="sidebar">
            <NavLink to="/samsdashboard" className="active">
                 
                 <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/menu_home.png" alt="" style={{width:'22px',height:'22px'}}/>
                <span style={{fontSize:'12px'}}>Home</span>
            </div>
            </NavLink>
            {/* <NavLink to="/mail_box">
                <img src="img/email_icon.png" alt="" />
            </NavLink> */}
            <NavLink to="/tickets">
            <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/data_icon.png" alt="" style={{width:'28px',height:'28px'}}/>
                <span style={{fontSize:'12px'}}>Tickets</span>
            </div>
            </NavLink>
            {RoleDisplayName === 'Zonal Officer' ? (  <NavLink to="/indents">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/health_records_icon.png" alt="" style={{width:'27px',height:'27px'}}/>
                <span style={{fontSize:'12px'}}>Indents</span>
            </div>
            </NavLink> ) : (<span></span>)}

             <NavLink to="/tsmess">
            <div className="d-flex flex-column justify-content-between align-items-center">
                 <img src="img/food.png" alt="" style={{width:'28px',height:'28px'}}/> 
                <span style={{fontSize:'12px'}}>TG Diet</span>
            </div>
            </NavLink>
             
            <NavLink to="/health_records">
              
                 <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/report_icons.png" alt="" style={{width:'28px',height:'28px'}}/>
                <span style={{fontSize:'12px'}}>Health</span>
            </div>
            </NavLink>

             {UserType === 'SuperAdmin' ? (  <NavLink to="/staffrecords">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/data_icon.png" alt="" style={{width:'28px',height:'28px'}}/>
                <span style={{fontSize:'12px'}}>Staff Records</span>
            </div>
            </NavLink> ) : (null)}

            
             {UserType === 'SuperAdmin' ? (  <NavLink to="/editattendanceentries">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/data_icon.png" alt="" style={{width:'28px',height:'28px'}}/>
                <span style={{fontSize:'12px'}}>Edit Attd</span>
            </div>
            </NavLink> ) : (null)}
        </div>
    );
};

export default SideMenu;