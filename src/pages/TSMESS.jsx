import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const TSMESS = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const navigate = useNavigate();
    const dataFetched = React.useRef(false);
    const [todayDefaults, setTodayDefaults] = React.useState({});
    const [monthDefaults, setMonthDefaults] = React.useState({});
    const [menuCompliance, setMenuCompliance] = React.useState({
        following: 0,
        notFollowing: 0
    });

    const tsmessdefaults = () => {
        _fetch("tsmessdefaults", null, false, token).then(res => {
            if (res.status === "success") {
                //console.log("TS Mess Defaults Data", res.data);
                setTodayDefaults(res.data.today);
                setMonthDefaults(res.data.month);
                toast.success(res.message || "TS Mess defaults data fetched successfully.");
            } else {
                toast.info(res.message || "Failed to fetch TS Mess defaults data.");
            }
        }).catch(err => {
            console.error("Error fetching TS Mess defaults data:", err);
            toast.error("An error occurred while fetching TS Mess defaults data.");
        });
    }
    const monthlyConsumedAmount = () => {
        _fetch("monthlyconsumedamount", null, false, token).then(res => {
            if (res.status === "success") {
                const amt = res.data.map(item => item.TotalConsumedAmount);
                const months = res.data.map(item => item.Month);

                if (document.getElementById("monthlyLineChart")) {
                    const monthlyLine = document
                        .getElementById("monthlyLineChart")
                        .getContext("2d");
                    new Chart(monthlyLine, {
                        type: "line",
                        data: {
                            labels: months,
                            datasets: [
                                {
                                    label: "Consumed",
                                    data: amt,
                                    borderColor: "#a659f3",
                                    backgroundColor: "#e4c3ff",
                                    tension: 0.4,
                                    fill: true,
                                    pointBackgroundColor: "#a659f3",
                                },
                            ],
                        },
                        options: {
                            plugins: { legend: { display: false } },
                        },
                    });
                }

            }
        });
    }
    const displayChart = (following, notFollowing) => {
        const complianceData = {
            following: following || 0,
            notFollowing: notFollowing || 0
        };
        const ctx1 = document.getElementById('menuComplianceChart').getContext('2d');
        const menuComplianceChart = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: ['Following Diet', 'Not Following Diet'],
                datasets: [{
                    data: [complianceData.following, complianceData.notFollowing],
                    backgroundColor: ['#198754', '#dc3545'],
                    borderColor: ['#ffffff', '#ffffff'],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw} Schools`;
                            }
                        }
                    }
                }
            }
        });
    }

    const fetchMenuCompliance = async () => {
        _fetch("complianceoverview", null, false, token).then(res => {
            if (res.status === "success") {
                //console.log("Menu Compliance Data", res.data);
                setMenuCompliance({
                    following: res.data.FollowingCompliance,
                    notFollowing: res.data.NotFollowingCompliance
                });
                displayChart(res.data.FollowingCompliance, res.data.NotFollowingCompliance);
                //toast.success("Menu compliance data fetched successfully.");
            } else {
                //toast.error("Failed to fetch menu compliance data.");
            }
        }).catch(err => {
            console.error("Error fetching menu compliance data:", err);
            //toast.error("An error occurred while fetching menu compliance data.");
        });
    }
    useEffect(() => {
        if (!dataFetched.current) {
            dataFetched.current = true;
            fetchMenuCompliance();
            tsmessdefaults();
            monthlyConsumedAmount();
        }
    }, []);
    return (
        <>
            <ToastContainer />
            <h5 className="fw-bold mb-3 maroon">TS Mess</h5>
            <div className="row">
                <div className="col-sm-9">
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <a href="page2.html">
                                <div className="card-box blue-bg_ts shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6>Today Attendance</h6>
                                            <h4 className="fw-bold">{todayDefaults?.TodayTotalPresent || 0}  / {todayDefaults?.TodayTotalStrength || 0}</h4>
                                        </div>
                                        <img src="img/today_attendance_icon.png" height="40px" alt="Today Attendance Icon" />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-md-4">
                            <a href="page3.html">
                                <div className="card-box purple-bg_ts shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6>Today Consumed Amount</h6>
                                            <h4 className="fw-bold"><span className="pe-1">₹</span>{todayDefaults?.TodayTotalConsumedAmount || 0}</h4>
                                        </div>
                                        <img src="img/today_consumed_icon.png" height="40px" alt="Today Consumed Icon" />

                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-md-4">
                            <div className="card-box pink-bg_ts shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6>Today Balance Amount</h6>
                                        <h4 className="fw-bold"><span className="pe-1">₹</span>{todayDefaults?.TodayTotalBalanceAmount || 0}</h4>
                                    </div>
                                    <img src="img/today_balance_icon.png" height="40px" alt="Today Balance Icon" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <a href="page2.html">
                                <div className="white-box d-flex justify-content-between align-items-center shadow-sm">
                                    <div>
                                        <h6 className="fw-bold">Month Attendance</h6>
                                        <h4 className="fw-bold maroon">{monthDefaults?.MonthMonthTotalPresent || 0} / {monthDefaults?.TotalStregth || 0}</h4>
                                    </div>
                                    <img src="img/month_attendance_icon.png" height="40px" alt="Month Attendance Icon" />
                                </div>
                            </a>
                        </div>
                        <div className="col-md-4">
                            <a href="page3.html">
                                <div className="white-box d-flex justify-content-between align-items-center shadow-sm">
                                    <div>
                                        <h6 className="fw-bold">Month Consumed Amount</h6>
                                        <h4 className="fw-bold maroon"><span className="text-black pe-1">₹</span>{monthDefaults?.MonthConsumedAmount || 0}</h4>
                                    </div>
                                    <img src="img/month_consumed_icon.png" height="40px" alt="Month Consumed Icon" />
                                </div>
                            </a>
                        </div>
                        <div className="col-md-4">
                            <div className="white-box d-flex justify-content-between align-items-center shadow-sm">
                                <div>
                                    <h6 className="fw-bold">Month Balance Amount</h6>
                                    <h4 className="fw-bold maroon"><span className="text-black pe-1">₹</span>{monthDefaults?.MonthBalanceAmount || 0}</h4>
                                </div>
                                <img src="img/month_balance_icon.png" height="40px" alt="Month Balance Icon" />
                            </div>
                        </div>
                    </div>


                    <h5 className="text-purple fw-bold mb-3 maroon">Operations Assistant</h5>
                    <div className="row g-2 operations mb-4">
                        <div className="col-md-3">
                            <a onClick={() => { navigate("/dpcrates") }} className="shadow-sm"><span className="dot"></span>DPC Rates</a>
                        </div>
                        <div className="col-md-3">
                            <a onClick={() => { navigate("/vendors") }} className="shadow-sm"><span className="dot"></span>Vendors</a>
                        </div>
                        <div className="col-md-3">
                            <a onClick={() => { navigate("/menus") }} className="shadow-sm"><span className="dot"></span>Daily Menu</a>
                        </div>
                        <div className="col-md-3">
                            <a onClick={() => { navigate("/stock") }} className="shadow-sm"><span className="dot"></span>Stock</a>
                        </div>
                        <div className="col-md-3">
                            <a onClick={() => { navigate("/items") }} style={{ cursor: 'pointer' }} className="shadow-sm"><span className="dot"></span>Items</a>
                        </div>
                        {UserType === 'SuperAdmin' ? (<div className="col-md-3">
                            <a onClick={() => { navigate("/reportsdashboard") }} style={{ cursor: 'pointer' }} className="shadow-sm"><span className="dot"></span>Reports</a>
                        </div>) : null}

                        <div className="col-md-3">
                            <a onClick={() => { navigate("/itemingredientmapping") }} style={{ cursor: 'pointer' }} className="shadow-sm"><span className="dot"></span>Menu Mapping</a>
                        </div>
                        <div className="col-md-3">
                            <a href="" className="shadow-sm"><span className="dot"></span>Total Bills</a>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="white-box shadow-sm">
                                <h6 className="text-start text-purple fw-bold maroon">Monthly Consumed Amount</h6>
                                <canvas id="monthlyLineChart" height="362" width="1088" style={{ display: "block", boxSizing: "border-box", height: "290px", width: "870px" }}></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="white-box shadow-sm">
                                <h6 className="text-start text-purple fw-bold maroon">Diet Compliance</h6>
                                <div style={{ height: "250px" }}>
                                    <canvas id="menuComplianceChart" width="1088" height="312" style={{ display: "block", boxSizing: "border-box", height: "250px", width: "870px" }}></canvas>
                                </div>
                                <div className="row pt-2">
                                    <div className="col-md-6">

                                        <div className="card mb-3 card-clickable menu-following" id="followingCard" style={{ cursor: "pointer" }} onClick={() => { navigate("/menufollowing") }}>
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <i className="bi bi-check-circle-fill text-success fs-2"></i>
                                                    </div>
                                                    <div >
                                                        <h6 className="mb-0">Following Diet</h6>
                                                        <small className="text-muted">All requirements met</small>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center" >
                                                    <span className="fs-3 fw-bold text-success me-2" id="followingCount">{menuCompliance.following}</span>
                                                    <i className="bi bi-arrow-right text-muted"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="card card-clickable menu-not-following" onClick={() => { navigate("/menuotfollowing") }} id="notFollowingCard" style={{ cursor: "pointer" }}>
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <i className="bi bi-x-circle-fill text-danger fs-2"></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0">Not Following Diet</h6>
                                                        <small className="text-muted">Needs attention</small>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="fs-3 fw-bold text-danger me-2" id="notFollowingCount">{menuCompliance.notFollowing}</span>
                                                    <i className="bi bi-arrow-right text-muted"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-sm-3">
                    <div className="row gy-3">
                        <div className="col-md-12">
                            <div className="white-box shadow-sm">
                                <h6 className="text-purple fw-bold maroon">Month Budget</h6>
                                <div className="chart-container">
                                    <canvas id="budgetChart" width="250" height="250" style={{ display: "block", boxSizing: "border-box", height: "200px", width: "200px" }}></canvas>
                                    <div className="chart-center-text">65%</div>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="white-box h-100 shadow-sm">
                                <h6 className="text-purple fw-bold maroon">Students Attendance</h6>
                                <canvas id="studentsBarChart" height="412" width="309" style={{ display: "block", boxSizing: "border-box", height: "330px", width: "247px" }}></canvas>
                            </div>
                        </div>


                    </div>
                </div>


            </div>
        </>
    );
}

export default TSMESS;