import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useSidebar } from "./SidebarProvider";
import { useRef,useEffect } from "react";

// SideMenu Component
const SideMenu = () => {
    const {isOpen,toggleSidebar} = useSidebar();
    const sidebarRef = useRef(null)
    const RoleDisplayName = useSelector((state) => state.userappdetails.profileData.RoleDisplayName)
      const UserType = useSelector((state) => state.userappdetails.profileData.UserType);

useEffect(() => {
  if (!isOpen) return; // Only when sidebar is open

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      toggleSidebar(); // Close sidebar
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen, toggleSidebar]);



    return (
        <div className={`sidebar d-flex flex-column align-items-center py-3
        ${isOpen ? "show-sidebar" : "hide-sidebar"}`} ref={sidebarRef}>
           {UserType === 'SuperAdmin' || UserType === 'Admin' ? (<NavLink to="/samsdashboard" className="active">
                 
                 <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-house-door text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Home</span>
            </div>
            </NavLink>) : (null)} 
            {/* <NavLink to="/mail_box">
                <img src="img/email_icon.png" alt="" />
            </NavLink> */}

            {UserType === 'SuperAdmin' || UserType === 'Admin' || UserType === 'StateOfficer' ? (<NavLink to="/tickets">
            <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-journal-check text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Tickets</span>
            </div>
            </NavLink>) : (null)}   


            {RoleDisplayName === 'Zonal Officer' ? (  <NavLink to="/indents">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/health_records_icon.png" alt="" style={{width:'27px',height:'27px'}}/>
                <span style={{fontSize:'12px'}}>Indents</span>
            </div>
            </NavLink> ) : (<span></span>)}

           {UserType === 'SuperAdmin' || UserType === 'Admin' || UserType === 'StateOfficer' ? ( <NavLink to="/tsmess">
            <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-egg text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>TG Diet</span>
            </div>
            </NavLink>) : (null)} 
             
          {/* {UserType === 'SuperAdmin' || UserType === 'Admin' ? ( <NavLink to="/health_records">
              
                 <div className="d-flex flex-column justify-content-between align-items-center">
                <img src="img/report_icons.png" alt="" style={{width:'28px',height:'28px'}}/>
                <span style={{fontSize:'12px'}}>Health</span>
            </div>
            </NavLink>) : (null)}  */}

             {UserType === 'SuperAdmin' ? (  <NavLink to="/staffrecords">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-person-vcard text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Staff Records</span>
            </div>
            </NavLink> ) : (null)}

             {UserType === 'SuperAdmin' || UserType === 'Admin' || UserType === 'JointSecretary' || UserType === 'DCO' || UserType === 'HealthAdmin' || UserType === 'StateOfficer' ? ( <NavLink to="/sickdashboard">
            <div className="d-flex flex-column justify-content-between align-items-center text-center">
                <i class="bi bi-heart-pulse text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Sick Report</span>
            </div>
            </NavLink>) : (null)} 

            
             {/* {UserType === 'SuperAdmin' ? (  <NavLink to="/editattendanceentries">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-calendar-week text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Edit Attd</span>
            </div>
            </NavLink> ) : (null)} */}

             {/* {UserType === 'SuperAdmin' ? (  <NavLink to="/schoolscontact">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-person-rolodex text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Edit Contact</span>
            </div>
            </NavLink> ) : (null)} */}


                {UserType === 'SuperAdmin' || UserType === 'StateOfficer' ? (  <NavLink to="/tourdiarydashboard">
                <div className="d-flex flex-column justify-content-between align-items-center text-center">
                <i class="bi bi-geo-alt text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Inspection Admin Module</span>
            </div>
            </NavLink> ) : (null)}


              {UserType === 'Admin' || UserType === 'DCO' || UserType === 'SpecialOfficer' || UserType === 'MultiZone' || UserType === 'StateOfficer' ? (  <NavLink to="/touruserdashboard">
                <div className="d-flex flex-column justify-content-between align-items-center text-center">
                <i class="bi bi-geo-alt text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Inspection Dashboard</span>
            </div>
            </NavLink> ) : (null)}

              {UserType === 'Admin' || UserType === 'DCO' || UserType === 'SpecialOfficer' || UserType === 'MultiZone' || UserType === 'StateOfficer' ? (  <NavLink to="/tourdiaryschedule">
                <div className="d-flex flex-column justify-content-between align-items-center text-center">
                <i class="bi bi-calendar2-week text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Create Schedule</span>
            </div>
            </NavLink> ) : (null)}

              {UserType === 'Admin' || UserType === 'DCO' || UserType === 'SpecialOfficer' || UserType === 'MultiZone' || UserType === 'StateOfficer' ? (  <NavLink to="/touruservisits">
                <div className="d-flex flex-column justify-content-between align-items-center text-center">
                <i class="bi bi-eye text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>View Visits</span>
            </div>
            </NavLink> ) : (null)}

             {UserType === 'SuperAdmin' || UserType === 'StateOfficer' ? (  <NavLink to="/complaintdashboard">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-telephone-inbound text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Phone Mitra</span>
            </div>

            
            </NavLink> ) : (null)}

            {UserType === 'CallCentre'  ? (<NavLink to="/complaintentry">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-telephone-inbound text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Phone Mitra</span>
            </div>

            
            </NavLink> ) : (null)}

            {UserType === 'Accounts' ? (<NavLink to="/staffentryform">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-person text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Staff Entry</span>
            </div>

            
            </NavLink> ) : (null)}


             {UserType === 'SuperAdmin' ? (  <NavLink to="/csrdashboard">
                <div className="d-flex flex-column justify-content-between align-items-center">
               <i class="bi bi-globe-central-south-asia text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>CSR</span>
            </div>

            
            </NavLink> ) : (null)}

             {UserType === 'SuperAdmin' ? (  <NavLink to="/grievancedashboard">
                <div className="d-flex flex-column justify-content-between align-items-center">
                <i class="bi bi-exclamation-triangle text-white" style={{fontSize:'24px'}}></i>
                <span style={{fontSize:'12px'}}>Grievance</span>
            </div>

            
            </NavLink> ) : (null)}


        </div>
    );
};

export default SideMenu;