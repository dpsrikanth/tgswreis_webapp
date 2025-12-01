import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
const MenuOTFollowing = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [compliancenotfollowing, setComplianceNotFollowing] = useState([]);
     const fetchComplianceNotFollowing = async () => {
            _fetch("compliancenotfollowing", null, false, token).then(res => {
                if (res.status === "success") {               
                    //console.log("Compliance Not Following List fetched successfully:", res.data);
                    setComplianceNotFollowing(res.data);
                    toast.success("Compliance Not Following list fetched successfully.");
                } else {
                    toast.error("Failed to fetch compliance not following list.");
                }
            }).catch(err => {
                console.error("Error fetching compliance not following list:", err);
                toast.error("Failed to fetch compliance not following list.");
            });
        };
        useEffect(() => {
            if (!dataFetched.current) {
                dataFetched.current = true;
                fetchComplianceNotFollowing();
            }
    
        }, []);
    return (
        <>
            <h6 className="fw-bold mb-3">
                <a onClick={() => { navigate("/tsmess") }}>
                    <i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i>
                </a>
                Diet Not Following Schools
            </h6>

            <div className="row">
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                        <div className="table-header">
                            <h5><span className="pink fw-bold">Diet Not Following Schools</span></h5>
                            <div className="table-tools">
                                <input type="text" className="form-control" placeholder="Search..." />
                                <img src="img/print_icon.png" />
                                <img src="img/download_icon.png" className="download_img" />
                            </div>
                        </div>
                        <div className="table-responsive pt-2">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>School Code</th>
                                        <th>School Name</th>
                                        <th>ZoneName</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example data, replace with actual data */}
                                    {Array.isArray(compliancenotfollowing) && compliancenotfollowing.length > 0 ? (
                                        compliancenotfollowing.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.SchoolCode}</td>
                                                <td>{item.PartnerName}</td>
                                                <td>{item.ZoneName}</td>
                                                <td><span className="badge bg-danger">Not Following</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">No data available</td>
                                        </tr>
                                    )}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default MenuOTFollowing;