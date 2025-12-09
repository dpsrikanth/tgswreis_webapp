import React from 'react';
import { useSidebar } from './SidebarProvider';
import { _fetch } from '../../libs/utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
// Header Component
const Header = () => {
    const { toggleSidebar } = useSidebar();
    const [time, setTime] = React.useState('');
    const [date, setDate] = React.useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const RoleDisplayName = useSelector((state) => state.userappdetails.profileData.RoleDisplayName)
    //date and time
    const updateDateTime = () => {
        const now = new Date();
        const time = now.toLocaleTimeString("en-IN", { hour12: false });
        const date = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        setTime(time);
        setDate(date);
    };
    React.useEffect(() => {
        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    const toggleMessagesPopup = () => {
        const messagesPopup = document.getElementById("messagesPopup");
        messagesPopup.classList.toggle("d-none");
    };
    //create a function to toggle profile menu
    const toggleProfileMenu = () => {
        const profileMenu = document.getElementById("profileMenu");
        profileMenu.style.display = profileMenu.style.display === "none" ? "block" : "none";
    };
    //handle logout
    const handleLogout = () => {
        //console.log("Logout clicked");
        _fetch("logout", undefined, false, token)
            .then(res => {
                if (res.status === "success") {
                    dispatch({ type: "RESET" });
                    window.location.href = "/login";
                }
            })
            .catch(error => {
                toast.error("Login failed: " + error.message);
            });
        dispatch({ type: "LOGOUT" });
    };
    return (
       <div className="">
           <div className='row align-items-center text-center'>
              {/* Hamburger only on Mobile */}
        <div className="col-2 d-md-none text-start">
          <i className="bi bi-list fs-2" style={{ cursor: "pointer" }} onClick={toggleSidebar}></i>
        </div>
        
            <div className='col-sm-1'>
                 <img src="img/left_logo.png" alt="" />
            </div>
            <div className='col-sm-4'>
                 <h5 className="text-center">
                        Telangana Social Welfare Residential<br />Educational Institutions
                        Society
                    </h5>
            </div>
            <div className='col-sm-1'>
                 <img src='img/main_logo.png' />
            </div>
            <div className='col-sm-3'>
                <img src='img/ministerlogonew1.png' style={{width:'104px',height:'104px'}} alt='' />
                <img src='img/CM.png' className='ms-2' alt=''/>
            </div>
            <div className='col-sm-1 d-none d-md-block'>
                <div className="timedatebg"><span id="time">{time}</span> | <span id="date">{date}</span></div>
            </div>
            <div className='col-sm-2'>
                <img src="img/profile_icon.png" style={{cursor:'pointer'}} onClick={toggleProfileMenu} />
                <div className="profile-menu" id="profileMenu" style={{ display: "none", position: "absolute", right: "10px", top: "60px", background: "white", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px", padding: "10px", width: "200px", zIndex: 9 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0" }}>
                    <img src="img/profile_icon.png" style={{ width: "40px", height: "40px" }} />
                    <span>{RoleDisplayName}</span>
                </div>
                <hr style={{ margin: "0px" }} />
                <div style={{ padding: "10px" }}>
                    <a href="#" style={{ display: "block", padding: "8px 5px" }}>Profile</a>
                    <a onClick={() => navigate("/change-password")} style={{ display: "block", padding: "8px 5px" }}>Change Password</a>
                    <a onClick={handleLogout} style={{ display: "block", padding: "8px 5px" }}>Logout</a>
                </div>

            </div>
            </div>
            
           </div>

        </div>

    );
};

export default Header;
