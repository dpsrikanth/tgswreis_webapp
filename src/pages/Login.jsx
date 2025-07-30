import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { _fetch } from '../libs/utils';
import { useSelector } from "react-redux";

const Login = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const [user, setUser] = React.useState({
        userId: '',
        password: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch(); // <-- Move here
    //set user state and call the same  function
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }
    const fetchClassesList = async (tokenToUse) => {
        _fetch("classes", null, false, tokenToUse).then(res => {
            if (res.status === "success") {
                console.log("Classes List fetched successfully:", res.data);
                dispatch({ type: "CLASSES_LIST", payload: res.data });
            } else {
                console.error("Failed to fetch classes list:", res.message);
                toast.error("Failed to fetch classes list: " + res.message);
            }
        }).catch(error => {
            console.error("Error fetching classes list:", error);
            toast.error("Error fetching classes list: " + error.message);
        });
    }
    const fetchSchoolList = async (tokenToUse,data) => {
        _fetch("schools", null, false, tokenToUse).then(res => {
            if (res.status === "success") {
                //console.log("School List fetched successfully:", res.data);
                if(data?.data?.ZoneId!==0 && data?.data?.RoleId===3)
                {
                    const filteredSchools= res.data.filter(x=>x.ZoneId===data?.data?.ZoneId);
                    console.log("filteredSchools",filteredSchools);
                    dispatch({ type: "SCHOOL_LIST", payload:filteredSchools });
                }
                else
                {                
                    dispatch({ type: "SCHOOL_LIST", payload: res.data });
                }
            }
        })
    }
    const fetchZoneList = async (tokenToUse,data) => {
        _fetch("zones", null, false, tokenToUse).then(res => {
            if (res.status === "success") {
                console.log("RoleID",data?.data?.RoleId)                
                console.log("RoleID",data?.data?.ZoneId)  
              
                if(data?.data?.ZoneId!==0 && data?.data?.RoleId===3)
                {
                    const filteredZones= res.data.filter(x=>x.ZoneId===data?.data?.ZoneId);
                    console.log("filteredZones",filteredZones);
                    dispatch({ type: "ZONES_LIST", payload:filteredZones });
                }
                else
                {
                    dispatch({ type: "ZONES_LIST", payload: res.data });
                }
                
            }
        })
    }
    const fetchDistrictList = async (tokenToUse) => {
        _fetch("districts", null, false, tokenToUse).then(res => {
            if (res.status === "success") {
                dispatch({ type: "DISTRICT_LIST", payload: res.data });
            }
        })
    }
    const fetchDPCList = async (tokenToUse) => {
        _fetch("dpcrates", null, false, tokenToUse).then(res => {
            if (res.status === "success") {
                dispatch({ type: "DPC_LIST", payload: res.data });
            }
        })
    }
    const storeResponse = async (data) => {
        dispatch({ type: "LOGIN_DATA", payload: data.data });
        dispatch({ type: "TOKEN", payload: data.token });
        // After storing response, fetch lists with the fresh token

        await fetchSchoolList(data.token,data);
        await fetchZoneList(data.token,data);
        await fetchDistrictList(data.token);
        await fetchDPCList(data.token);
        await fetchClassesList(data.token);
    }
    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (user.userId === "" || user.password === "") {
            notify("Please enter all fields");
            //focus on first empty field
            if (user.userId === "") {
                document.getElementById("userId").focus();
            } else {
                document.getElementById("password").focus();
            }
            return false;
        } else {
            const payload = {
                username: user.userId,
                password: user.password
            }
            fetch(_gc.urls.login.url, {
                method: _gc.urls.login.method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        toast.error("Login failed: " + response.statusText);
                        throw new Error("Login failed");
                    }
                    return response.json();
                })
                .then(async data => {
                    if (data.status !== "success") {
                        toast.error("Login failed: " + data.message);
                        return false;
                    }
                    await storeResponse(data); // Only after this, lists are fetched

                    if(data.data.UserType === 'CallCentre'){
                        navigate("/complaintentry", { state: { type: "success", message: "Login successful" } });
                    } else {
                       navigate("/samsdashboard", { state: { type: "success", message: "Login successful" } });
                    }
                    
                    
                })
                .catch(error => {
                    toast.error("Login failed: " + error.message);
                });
        }
        //console.log(user);
        return false;
    }

    return (
        <div className="login_bg">
            <ToastContainer />
            <div className="row m-0">
                <div className="offset-md-9 col-md-3">
                    <div className="login_form d-flex align-items-center">
                        <div className="login_form_section w-100">
                            <div className="login_logo text-center">
                                <img src="img/login_logo.png" />
                                <h4 className="mt-3">Telangana Social Welfare Residential<br />Educational Institutions
                                    Society</h4>
                            </div>
                            <div className="form_sec">
                                <form autoComplete="off">
                                    <div className="mb-3 pb-3">
                                        <label htmlFor="userId" className="form-label">Enter your ID</label>
                                        <input type="text" className="form-control" id="userId" name="userId" placeholder="Enter your ID" value={user.userId} onChange={handleChange} />
                                    </div>

                                    <div className="mb-3 pb-3">
                                        <label htmlFor="password" className="form-label">Enter your Password</label>
                                        <input type="password" className="form-control" id="password" name="password" placeholder="Enter your Password" value={user.password} onChange={handleChange} />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-3">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                        </div>
                                        <a href="#" className="text-primary text-decoration-none">Forgot Password?</a>
                                    </div>

                                    <div className="mb-3 pb-3">
                                        <button type="button" className="btn btn-login" onClick={handleLogin}>Login</button>
                                    </div>

                                    {/* <p className="text-center">Don't have an account? <a href="#" className="text-primary">Sign up</a></p> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
