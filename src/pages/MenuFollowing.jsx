import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
const MenuFollowing = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [compliancefollowing, setComplianceFollowing] = useState([]);
    const fetchComplianceFollowing = async () => {
        _fetch("compliancefollowing", null, false, token).then(res => {
            if (res.status === "success") {               
                //console.log("Compliance Following List fetched successfully:", res.data);
                setComplianceFollowing(res.data);
                toast.success("Compliance Following list fetched successfully.");
            } else {
                toast.error("Failed to fetch compliance following list.");
            }
        }).catch(err => {
            console.error("Error fetching compliance following list:", err);
            toast.error("Failed to fetch compliance following list.");
        });
    };
    useEffect(() => {
        if (!dataFetched.current) {
            dataFetched.current = true;
            fetchComplianceFollowing();
        }

    }, []);
    return (
        <>
            <h6 className="fw-bold mb-3"><a onClick={() => { navigate("/tsmess") }}><i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i></a>Diet Following Schools</h6>

            <div className="row">
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                        <div className="table-header">
                            <h5><span className="pink fw-bold">Diet Following Schools</span></h5>
                            <div className="table-tools">
                                <input type="text" className="form-control" placeholder="Search..." />
                                <img src="img/print_icon.png" />
                                <img src="img/download_icon.png" className="download_img" />
                            </div>
                        </div>
                        <div className="table-responsive pt-2">
                            <table className="table">
                                <thead>
                                </thead><thead>
                                    <tr>
                                        <th>School Code</th>
                                        <th>School Name</th>
                                        <th>ZoneName</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(compliancefollowing) && compliancefollowing.length > 0 ? (
                                        compliancefollowing.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.SchoolCode}</td>
                                                <td>{item.PartnerName}</td>
                                                <td>{item.ZoneName}</td>
                                                <td><span className="badge text-bg-success">{item.Compliance}</span></td>
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

export default MenuFollowing;