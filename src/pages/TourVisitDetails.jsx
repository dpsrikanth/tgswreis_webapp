import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { _fetch } from "../libs/utils";
import { useSelector } from "react-redux";

const STATUS_MAP = {
  1: { label: "Planned Visits", badge: "primary" },
  3: { label: "Completed Visits", badge: "success" },
  4: { label: "Not Visited Visits", badge: "danger" }
};

const TourVisitDetails = () => {

  const { status } = useParams();
  const statusId = Number(status);
  const token = useSelector(s => s.userappdetails.TOKEN);
  const userId = useSelector(s => s.userappdetails.profileData.Id);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadVisits();
  }, [status]);

  const loadVisits = async () => {
    const res = await _fetch(
      "statuswisevisits",
      { UserId: userId, Status: statusId },
      false,
      token
    );

    if (res.status === "success") {
      setRows(res.data);
    }
  };

  return (
    <>
    <div className="shadow-sm white-box">
      <div className="table-header">
        <h5 className="fw-bold mb-3">
        {STATUS_MAP[statusId]?.label}
      </h5>
       <button className="btn btn-secondary btn-sm" onClick={() => navigate('/touruserdashboard')}>
            Back
          </button>
      </div>
 

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>School</th>
            <th>School Code</th>
            <th>Purpose</th>
          </tr>
        </thead>

        <tbody>
          {rows.length ? (
            rows.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {new Date(r.DateOfVisit).toLocaleDateString("en-IN")}
                </td>
                <td>{r.PartnerName}</td>
                <td>{r.SchoolCode}</td>
                <td>{r.Purpose}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
     
    </>
  );
};

export default TourVisitDetails;
