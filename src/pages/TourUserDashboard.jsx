import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const TourUserDashboard = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const UserId = useSelector((state) => state.userappdetails.profileData.Id);
  const [completed,setCompleted] = useState(null);
  const [NotVisited,setNotVisited] = useState(null);
  const [complianceRate,setComplianceRate] = useState(null);
  const [upcomingTours,setUpcomingTours] = useState([]);
  const navigate = useNavigate();


const fetchCountTotals = async () => {
  try{

    const payload = {UserId}

    _fetch('countusertotals',payload,false,token).then(res => {
    if(res.status === 'success'){
      setCompleted(res.data[0].TotalCompleted);
      setNotVisited(res.data[0].TotalNotVisited);
      setComplianceRate(res.data[0].ComplianceRate)
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    })

  } catch(error){
    console.error('Error fetching count totals',error)
  }
}


const fetchUpcomingWeek = async() => {
  try{

    const payload = {UserId}

    _fetch('upcomingweekuser',payload,false,token).then(res => {
      if(res.status === 'success'){
        setUpcomingTours(res.data);
        toast.success(res.message);
      }else {
        toast.error(res.message);
      }
    })

  } catch(error){
    console.error('Error fetching Upcoming Weeek',error)
  }
}

useEffect(() => {
fetchCountTotals();
fetchUpcomingWeek();
},[])

  return (
    <>
    
    <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Tour Diary Dashboard</h6>

      <div className="row g-3 mb-3 pt-3">

        <div className="col-sm-12">
            <div className="row g-3 mb-3">
        <div className="col-md-3">
          <a href="">
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold maroon">18</h3>
              <h6 className="fw-bold">Required This Month</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-journal-text maroon" style={{fontSize:'28px'}}></i>
           
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="">
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-success">{completed}</h3>
               <h6 className="fw-bold">Completed</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-check-circle-fill text-success" style={{fontSize:'28px'}}></i>
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-3">
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-danger">{NotVisited}</h3>
                <h6 className="fw-bold">Not Visited</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{fontSize:'28px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-primary">{complianceRate}</h3>
              <h6 className="fw-bold">Compliance Rate</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-hourglass-split text-primary" style={{fontSize:'28px'}}></i>
            </div>
          </div>
        </div>
      </div>
        </div>

    </div>

    <div className="row g-3 mb-3">

        <div className="col-sm-12">
            <div className="row gy-3">
                

        {/* <div className="col-sm-4">
            <div className="white-box shadow-sm">
                 <h5 className="chart-title">Daily Trends</h5>
                    <div className="chart-container" style={{width:'300px'}}>
                        <canvas id="dailyTrendsChart"></canvas>
                    </div>
            </div>
        </div> */}

       <div className='col-sm-6'>
        <div className='white-box shadow-sm'>
          <h5 className=''>Upcoming Visits</h5>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>S.No</th>
              <th>Date Of Visit</th>
              <th>School Name</th>
              <th>School Code</th>
              <th>Status</th>
              </tr>
             
            </thead>
            <tbody>
            {upcomingTours.map((item,index) => (
              <tr key={item.index}>
                <td>{index+1}</td>
                <td>{item.DateOfVisit.split('T')[0]}</td>
                <td>{item.PartnerName}</td>
                <td>{item.SchoolCode}</td>
                <td><span className='badge bg-primary'>PLANNED</span></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
       </div>

       <div className="col-sm-4">
        <div className="white-box shadow-sm">
                 <h5 className="">Quick Actions</h5>
                  <div className="row">
                    <div className="col-sm-12">
                        <button className="btn btn-primary" onClick={() => navigate('/touruservisits')}>View My Visits</button>
                        {/* <button className="btn btn-primary">Upload Report</button>
                        <button className="btn btn-primary">Add Remarks</button> */}
                    </div>
                  </div>
            </div>
       </div>
            </div>
        </div>
       

       
      </div>
    </>
  )
}

export default TourUserDashboard