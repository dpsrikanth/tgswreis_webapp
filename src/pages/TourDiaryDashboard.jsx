import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';

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
  const [todayCompleted,setTodayCompleted] = useState(null);
  const [TotalPlanned,setTotalPlanned] = useState(null);
  const [TotalVisited,setTotalVisited] = useState(null);
  const [TotalCannotVisit,setTotalCannotVisit] = useState(null);
  const [TotalNotVisited,setTotalNotVisited] = useState(null);
  const [TotalCompleted,setTotalCompleted] = useState(null);
  const [yesNotVisited,setYesNotVisited] = useState([]);
  const [todayCannotVisit,setTodayCannotVisit] = useState(null);
  const [todayPending,setTodayPending] = useState(null);
  const [todayUnplanned,setTodayUnplanned] = useState(null);
  const navigate = useNavigate();
  

  const fetchTodaySchedule = async () => {
    try{

        _fetch('todaytourschedule',null,false,token).then(res => {
            if(res.status === 'success'){
                setTodaySchedule(res.data);
            }else {
                console.error(res.message);
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
            return { label: "Completed (Report Submitted)", badge: "badge bg-success" };

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
                
            }else {
                console.error(res.message);
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
               
            }else {
                console.error(res.message);
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
                setTodayCompleted(res.data[0].TotalCompletedToday);
                setTodayCannotVisit(res.data[0].TotalCannotVisitToday)
                setTodayPending(res.data[0].PendingToday);
                setTodayUnplanned(res.data[0].TotalAdditionalVisitsToday);
            }else {
                console.error(res.message);
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
                setTotalNotVisited(res.data[0].TotalNotVisited);
                setTotalCompleted(res.data[0].TotalCompleted);
                setTotalCannotVisit(res.data[0].TotalCannotVisit);
                setYesNotVisited(res.data[0].YesterdayNotVisited);
            }else {
                console.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching today count',error)
    }
  }


  const fetchYesterdayNotVisited = async () => {
    try{

      _fetch('yesterdaynotvisited',null,false,token).then(res => {
        if(res.status === 'success'){
          setYesNotVisited(res.data);
        } else {
          console.error(res.message);
        }
      })

    } catch(error){
      console.error('Error fetching Yesterday Not Visited Inspections')
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
    <h6 className="fw-bold mb-2"><a onClick={() => navigate('/samsdashboard')} style={{cursor:'pointer'}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Inspection Module Dashboard</h6>
      

      <div className="row g-3 mb-3 pt-2">

        <div className="col-sm-12">
            <div className="row g-3 mb-3">
        <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/todaytotalinspections')}>
          
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-primary">{todayPlanned}</h3>
              <h6 className="fw-bold">Today Scheduled Inspections</h6>
            </div>
            <div className="text-end">
              <div class="traffic-light primary"></div>
            </div>
          </div>
          
        </div>

        <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/additionalinspections')}>
        
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
             
              <h3 className="fw-bold text-info">{todayUnplanned}</h3>
               <h6 className="fw-bold">Today Unplanned/Additional Inspections</h6>
            </div>
            <div className="text-end">
              <div class="traffic-light info"></div>
             
            </div>
          </div>
      
        </div> 

        <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/todaypendinginspections')}>
         
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
             
              <h3 className="fw-bold text-warning">{todayPending}</h3>
               <h6 className="fw-bold">Today Pending Inspections</h6>
            </div>
            <div className="text-end">
              <div class="traffic-light yellow"></div>
             
            </div>
          </div>
        
        </div> 
        
        <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/todaycompletedinspections')}>
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
            
              <h3 className="fw-bold text-success">{todayCompleted}</h3>
                <h6 className="fw-bold">Today Completed Inspections</h6>
            </div>
            <div className="text-end">
               <div class="traffic-light green"></div>
            </div>
          </div>
        </div>

          <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/cannotvisitinspections')}>
         
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
             
              <h3 className="fw-bold text-secondary">{todayCannotVisit}</h3>
               <h6 className="fw-bold">Today Cannot Visit Inspections</h6>
            </div>
            <div className="text-end">
             <div class="traffic-light secondary"></div>
             
            </div>
          </div>
          
        </div> 

        <div className="col-md-4" style={{cursor:'pointer'}} onClick={() => navigate('/yesnotvisitedinspections')}>
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-danger">{yesNotVisited}</h3>
              <h6 className="fw-bold">Yesterday Not Visited Inspections</h6>
            </div>
            <div className="text-end">
              <div class="traffic-light red"></div>
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

        <div className='row'>
          <div className='col-sm-12'>
            <div className='row gy-3'>
              
               <div className='col-sm-12'>
            <div className='row gy-3'>
             {/* <div className = "col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Todays Totals</h5>
                <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded">
                 <div>Planned</div>
                <div className="fw-bold maroon h3">{todayPlanned}</div>
                 <div class="traffic-light maroon"></div>
                </div>
               
                <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded mt-2">
                  <div>Completed</div>
                <div className="fw-bold text-success h3">{todayCompleted}</div>
                <div class="traffic-light green"></div>
                </div>
                 <div className="d-flex justify-content-between align-items-center shadow-sm border px-2 rounded mt-2">
                   <div>Not Visited</div>
                <div className="fw-bold text-danger h3">{todayNotVisited}</div>
                <div class="traffic-light red"></div>
                 </div>

                 
                
            </div>
        </div> */}

         <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Reports</h5>
                <div className="row gy-2">
                    {/* <div className="col-sm-12">
                       <button className = 'btn btn-primary' onClick={() => navigate('/dailytourreport')}>Daily Compliance Report</button>
                       <button className = 'btn btn-primary mt-2' onClick={() => navigate('/consolidatedtourreport')}>Month Wise Consolidated Report</button>
                       <button className = 'btn btn-primary mt-2' >Designation Wise Report</button>
                       <button className = 'btn btn-primary mt-2' >Officer Wise Report</button>
                    </div> */}
                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/dailytourreport')} style={{cursor:'pointer'}}>
                      <div className="report-icon"><i class="bi bi-suitcase-lg-fill"></i></div>
                     <p className='mb-0'>Daily Inspection Compliance Report</p>
                    </div>
                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/consolidatedtourreport')} style={{cursor:'pointer'}}>
                      <div className="report-icon"><i class="bi bi-suitcase2-fill"></i></div>
                     <p className='mb-0'>Officer Wise Report</p>
                    </div>
                    {/* <div className='col-sm-12 shadow-sm border rounded-3 p-3'  style={{cursor:'pointer'}}>
                     <p className='mb-0'>Designation Wise Report</p>
                    </div> */}
                     <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/officerwisetourreport')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-file-earmark-person-fill"></i></div>
                     <p className='mb-0'>Officer Wise Compliance Report</p>
                    </div>

                    {UserType === 'SuperAdmin' && (
                      <>

                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/schoolwisetourreport')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-building-fill"></i></div>
                     <p className='mb-0'>School Wise Inspection Report</p>
                    </div>


                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/datewiseinspectionreport')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-calendar-date-fill"></i></div>
                     <p className='mb-0'>Date Wise Inspection Report</p>
                    </div>


                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/schoolwisevisitabstract')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-123"></i></div>
                     <p className='mb-0'>School Wise Abstract Report</p>
                    </div>


                     <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/comparativeinspection')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-clipboard-data-fill"></i></div>
                     <p className='mb-0'>Comparative Inspection Analysis</p>
                    </div>

                    <div className='col-sm-4 shadow-sm border rounded-3 p-3 d-flex gap-3 align-items-center' onClick={() => navigate('/schoolscontact')}  style={{cursor:'pointer'}}>
                        <div className="report-icon"><i class="bi bi-geo-fill"></i></div>
                     <p className='mb-0'>Update Latitude and Longitude of School</p>
                    </div>
                      </>
                     
                    )}
                </div>
            </div>
        </div> 
            </div>
          </div>     
            </div>
          </div>
         
        </div>

        

        {/* <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Top 10 Officers with Low Complaince</h5>
                 <div>
                {Array.isArray(lowCompliance) && lowCompliance.length > 0 ? (
                       lowCompliance.map((item,index) => (
                         <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.OfficerName}</div>
                            <div className="school-district">{item.RoleDisplayName} - {item.Region}</div>
                        </div>
                        <div className="complaint-count">{item.TotalNonCompliant}</div>
                    </div>
                       ))

                     
                    ) : (<div>No Data available</div>)}
                </div> 
                
                    
            </div> 
        </div> */}

        {/* <div className="col-sm-4">
            <div className="white-box shadow-sm">
                <h5 className="chart-title">Yesterday's Not Visted Inspections</h5>
                <div className="top-schools-list">
                    {Array.isArray(topCompliance) && topCompliance.length > 0 ? (
                       topCompliance.map((item,index) => (
                         <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.OfficerName}</div>
                            <div className="school-district">{item.RoleDisplayName} - {item.Region}</div>
                        </div>
                        <div className="complaint-count">{item.TotalCompleted}</div>
                    </div>
                       ))

                     
                    ) : (<div>No Data available</div>)}
                    
                </div>
            </div>
        </div> */}

       

        

                   
            </div>

            
        </div>
      </div>
    </>
  )
}

export default TourDiaryDashboard