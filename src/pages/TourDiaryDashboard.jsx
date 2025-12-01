import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const TourDiaryDashboard = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const UserId = useSelector((state) => state.userappdetails.profileData.Id);
  const [todaySchedule,setTodaySchedule] = useState([]);
  const [topCompliance,setTopCompliance] = useState([]);
  const [lowCompliance,setLowCompliance] = useState([]);
  const [todayPlanned,setTodayPlanned] = useState(null);
  const [todayVisited,setTodayVisited] = useState(null);
  const [todayNotVisited,setTodayNotVisited] = useState(null);
  const [TotalPlanned,setTotalPlanned] = useState(null);
  const [TotalVisited,setTotalVisited] = useState(null);
  const [TotalNotVisited,setTotalNotVisited] = useState(null);
  const [TotalCompleted,setTotalCompleted] = useState(null);
  const navigate = useNavigate();
  

  const fetchTodaySchedule = async () => {
    try{

        _fetch('todaytourschedule',null,false,token).then(res => {
            if(res.status === 'success'){
                setTodaySchedule(res.data);
                toast.success(res.message);
            }else {
                toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching Todays Schedule',error)
    }
  }


  const getStatus = (status) => {
    switch(status){
        case 1: 
        return {label: "Planned", badge: 'badge bg-primary'};
        
        case 2:
            return {label: 'Visited (Pending Proof)', badge: 'badge bg-warning text-dark'}

        case 3:
            return { label: "Completed (Proof Uploaded)", badge: "badge bg-success" };

        case 4:
            return { label: "Not Visited", badge: "badge bg-danger" };

        case 5:
            return { label: "Cannot Visit", badge: "badge bg-secondary" };

        default:
      return { label: "Unknown", badge: "badge bg-dark" };
    }
    
}

const fetchTopCompliance = async () => {
    try{

        _fetch('topcompliant',null,false,token).then(res => {
            if(res.status === 'success'){
                setTopCompliance(res.data);
                toast.success(res.message);
            }else {
                toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching Top High Compliance List',error)
    }
  }



const fetchLowCompliance = async () => {
    try{

        _fetch('topnoncompliant',null,false,token).then(res => {
            if(res.status === 'success'){
                setLowCompliance(res.data);
                toast.success(res.message);
            }else {
                toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching Low Compliance List',error)
    }
  }


  const fetchTodayCount = async () => {
   try{

        _fetch('dailycountadmin',null,false,token).then(res => {
            if(res.status === 'success'){
                setTodayPlanned(res.data[0].TotalPlannedToday);
                setTodayVisited(res.data[0].TotalVisitedToday);
                setTodayNotVisited(res.data[0].TotalNotVisitedToday);
                toast.success(res.message);
            }else {
                toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching today count',error)
    }
  }

  
 const fetchTotalsCount = async () => {
   try{

        _fetch('countuseradmin',null,false,token).then(res => {
            if(res.status === 'success'){
                setTotalPlanned(res.data[0].TotalPlanned);
                setTotalVisited(res.data[0].TotalVisited);
                setTotalNotVisited(res.data[0].TotalNotVisited);
                setTotalCompleted(res.data[0].TotalCompleted);
                toast.success(res.message);
            }else {
                toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching today count',error)
    }
  }


useEffect(() => {
   fetchTodaySchedule(); 
   fetchTodayCount();
   fetchTopCompliance();
   fetchLowCompliance();
   fetchTotalsCount();
},[])


  return (
    <>
    <h6 className="fw-bold mb-2"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Tour Monitor Dashboard</h6>
      

      <div className="row g-3 mb-3 pt-2">

        <div className="col-sm-12">
            <div className="row g-3 mb-3">
        <div className="col-md-3">
          <a href="">
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold maroon">{TotalPlanned}</h3>
              <h6 className="fw-bold">Total Planned Visits</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-journal-text maroon" style={{fontSize:'28px'}}></i>
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="">
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
             
              <h3 className="fw-bold text-warning">{TotalVisited}</h3>
               <h6 className="fw-bold">Total Visited Visits</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-hourglass-split text-warning" style={{fontSize:'28px'}}></i>
             
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
            
              <h3 className="fw-bold text-success">{TotalCompleted}</h3>
                <h6 className="fw-bold">Total Completed Visits</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-check-circle-fill text-success" style={{fontSize:'28px'}}></i>
      
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-danger">{TotalNotVisited}</h3>
              <h6 className="fw-bold">Total Not Visited Visits</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-exclamation-triangle-fill text-danger" style={{fontSize:'28px'}}></i>
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

        {/* <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Visit Compliance By Designation</h5>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Designation</th>
                                    <th>Required</th>
                                    <th>Completed</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>DCOs</td>
                                    <td>18/month</td>
                                    <td>324/360</td>
                                    <td><span className="badge bg-primary">90%</span></td>
                                </tr>
                                <tr>
                                    <td>Zonal Officers</td>
                                    <td>18/month</td>
                                    <td>324/360</td>
                                    <td><span className="badge bg-warning text-dark">70%</span></td>
                                </tr>
                                <tr>
                                    <td>DCOs</td>
                                    <td>18/month</td>
                                    <td>324/360</td>
                                    <td><span className="badge bg-danger">50%</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div> */}

        <div className = "col-sm-4">
            <div className="white-box shadow-sm">
                <h5>Todays Totals</h5>
                <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded">
                 <div>Planned</div>
                <div className="fw-bold maroon h3">{todayPlanned}</div>
                 <div class="traffic-light maroon"></div>
                </div>
                <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded mt-2">
                  <div>Visited</div>
                <div className="fw-bold text-success h3">{todayVisited}</div>
                <div class="traffic-light green"></div>
                </div>
                 <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded mt-2">
                   <div>Not Visited</div>
                <div className="fw-bold text-danger h3">{todayNotVisited}</div>
                <div class="traffic-light red"></div>
                 </div>

                 
                
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Top 10 Officers with Low Complaince</h5>
               {Array.isArray(lowCompliance) && lowCompliance.length > 0 ? (
                       lowCompliance.map((item,index) => (
                         <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.UserName}</div>
                            <div className="school-district">{item.RoleDisplayName}</div>
                        </div>
                        <div className="complaint-count">{item.TotalNonCompliant}</div>
                    </div>
                       ))

                     
                    ) : (<div>No Data available</div>)}
                    
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Top 10 Officers with High Complaince</h5>
                <div className="top-schools-list">
                    {Array.isArray(topCompliance) && topCompliance.length > 0 ? (
                       topCompliance.map((item,index) => (
                         <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.UserName}</div>
                            <div className="school-district">{item.RoleDisplayName}</div>
                        </div>
                        <div className="complaint-count">{item.TotalCompleted}</div>
                    </div>
                       ))

                     
                    ) : (<div>No Data available</div>)}
                    
                </div>
            </div>
        </div>

       

         <div className='col-sm-8'>
             <div className="white-box shadow-sm">
                <h5 className="chart-title">Today's Scheduled Visits</h5>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>DateOfVisit</th>
                                    <th>Officer Name</th>
                                    <th>School Name</th>
                                    <th>School Code</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(todaySchedule) && todaySchedule.length > 0 ? (
                                todaySchedule.map((item,index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.DateOfVisit.split('T')[0]}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.PartnerName}</td>
                                        <td>{item.SchoolCode}</td>
                                        <td><span className={getStatus(item.Status).badge}>{getStatus(item.Status).label}</span></td>
                                    </tr>
                                ))
                              ) : (
                                <div>No Data available</div>
                              )}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    </div>
                   </div>

                    <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Quick Links</h5>
                <div className="row">
                    <div className="col-sm-12">
                       <button className = 'btn btn-primary' onClick={() => navigate('/tourdiaryschedule')}>Create Schedule</button>
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

export default TourDiaryDashboard