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
        <div className="header">
           <div style={{width:'100%'}}>
                <div className="logo">
                    <div className='d-flex align-items-center gap-3'>
                    <img src="img/left_logo.png" alt="" />
                    <h5 className="">
                        Telangana Social Welfare Residential<br />Educational Institutions
                        Society
                    </h5>
                    </div>
                    <div>
                     <img src='img/main_logo.png' />
                    </div>
                    
                     <div className='d-flex align-items-center gap-3'>
                     <img src='img/ministerlogonew1.png' style={{width:'104px',height:'104px'}} alt='' />
                    <img src='img/CM.png' alt=''/>
                     </div>
                    
                </div>
            </div>
            <div className="d-flex align-items-center gap-3">
                <div className="timedatebg"><span id="time">{time}</span> | <span id="date">{date}</span></div>
              
                {/* <label className="position-relative" onClick={toggleMessagesPopup}>
                    <img src="img/message_icon.png" />
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                    >4</span>

                    <div id="messagesPopup" className="messages-popup d-none">
                        <h6 className="px-3 pt-3">Your Messages</h6>
                        <hr />
                        <a href="mail_box.html">
                            <div className="message-item">
                                <div className="avatar">VV</div>
                                <div className="message-content">
                                    <strong>Lorem ipsum dolor sit amet</strong>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                </div>
                            </div>
                        </a>
                        <a href="mail_box.html">
                            <div className="message-item">
                                <div className="avatar pink">VV</div>
                                <div className="message-content">
                                    <strong>Ipsum dolor sit amet</strong>
                                    <p>Consectetur adipiscing elit, sed do eiusmod tempor...</p>
                                </div>
                            </div>
                        </a>
                        <a href="mail_box.html">
                            <div className="message-item">
                                <div className="avatar">VV</div>
                                <div className="message-content">
                                    <strong>Dolor sit ametLorem ipsum</strong>
                                    <p>Dolor sit amet, consectetur adipiscing elit, sed do...</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </label>
                <label className=" position-relative">
                    <img src="img/notification_icon.png" />
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                    >6</span>
                </label>
                <img src="img/hand_burger_Icon.png" /> */}
                <img src="img/profile_icon.png" onClick={toggleProfileMenu} />
            </div>

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
    );
};

export default Header;
