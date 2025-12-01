import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const TourUserVisits = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserId = useSelector((state) => state.userappdetails.profileData.Id)
const [tourschedule,setTourSchedule] = useState([]);
const [planned,setPlanned] = useState([]);
const [completed,setCompleted] = useState([]);
const [notvisited,setNotVisited] = useState([]);
const [visited,setVisited] = useState([]);
const [cannotVisit,setCannotVisit] = useState([]);
const [selectedTourDiaryId,setSelectedTourDiaryId] = useState(null);
const [visitedId,setVisitedId] = useState(null);
const [cannotVisitId,setCannotVisitId] = useState(null);
const [showMarkVisitModal, setShowMarkVisitModal] = useState(false);
const [showCannotVisitModal, setCannotVisitModal] = useState(false);
const [rejectedReason,setRejectedReason] = useState('');
const [rejectedRemarks,setRejectedRemarks] = useState('');
const navigate = useNavigate();


const fetchTourScheduleInd = async () => {
    try{
         const payload = {UserId}

        _fetch('tourscheduleindv',payload,false,token).then(res => {
            if(res.status === 'success'){
              setPlanned(res.data.filter(d => d.Status === 1));
              setVisited(res.data.filter(d => d.Status === 2));
              setCompleted(res.data.filter(d => d.Status === 3));
              setNotVisited(res.data.filter(d => d.Status === 4));
              setCannotVisit(res.data.filter(d => d.Status === 5));
            }else{
                toast.error(res.message)
            }
        })

    } catch (error){
        console.error('Error fetching Tour Schedule',error)
    }
}


const MarkCannotVisit = async () => {
    try {

        const payload = {TourDiaryId:cannotVisitId,RejectedReason:rejectedReason,RejectedRemarks:rejectedRemarks}

        _fetch('cannotvisit',payload,false,token).then(res => {
            if(res.status === 'success'){
                 setCannotVisitModal(false);
                fetchTourScheduleInd();
                toast.success(res.message);
            }
        })

    } catch (error){
        console.error('Error updating status to not visted')
    }
}


const MarkVisited = async () => {
    try {

        const payload = {TourDiaryId:visitedId}

        _fetch('markvisited',payload,false,token).then(res =>{
            if(res.status === 'success'){
                setShowMarkVisitModal(false);
                fetchTourScheduleInd();
                setVisitedId(null);
               toast.success(res.message);
               navigate(`/uploadtourreports/${visitedId}`)
            } else {
                toast.error(res.message);
            }
        })

    } catch(error){
        console.error('Error updating status to visited',error)
    }
}


useEffect(() => {
fetchTourScheduleInd();    

},[])

  return (
    <>
    <ToastContainer />
      <h6 className="fw-bold mb-3"><a href="#"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>My Scheduled Visits</h6>
     
      <div className="row gy-3">
        <div className="col-sm-6">
            <div className="white-box shadow-sm">
                <h5>Upcoming Visits</h5>
                <div className="row gy-3">
                   
                    <div className="col-sm-12">
                        <table className="table tablee-responsive">
                         <thead>
                            <tr>
                                <th>Date</th>
                                <th>School/Location</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>
                                    Action
                                </th>
                            </tr>
                         </thead>
                         <tbody>
                            {Array.isArray(planned) && planned.length > 0 ? (
                                planned.map((item) => (
                                    <tr key={item.TourDiaryId}>
                                        <td>{item.DateOfVisit.split('T')[0]}</td>
                                        <td>{item.PartnerName.replace('TGSWREIS','')}</td>
                                        <td>{item.Purpose}</td>
                                        {item.Status === 1 ? (<td><span className='badge bg-primary'>PLANNED</span></td>) : null}
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-success btn-sm" onClick={() => {
                                                    setVisitedId(item.TourDiaryId)
                                                    setShowMarkVisitModal(true)
                                                }}>
                                                    <i className="fas fa-check"></i> Mark Visited
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => {
                                                    setCannotVisitId(item.TourDiaryId)
                                                    setCannotVisitModal(true)
                                                }}>
                                                    <i className="fas fa-times"></i> Cannot Visit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>No Data available</td>
                                </tr>
                            )}
                            
                         </tbody>
                        </table>
                    </div>
                </div>
                </div>
        </div>


          <div className="col-sm-6">
            <div className="white-box shadow-sm">
                <h5>Completed Visits</h5>
                <div className="row gy-3">
                     <table className="table tablee-responsive">
                         <thead>
                            <tr>
                                <th>Date</th>
                                <th>School/Location</th>
                                <th>Purpose</th>
                                <th>Status</th>
                               
                            </tr>
                         </thead>
                         <tbody>
                            {Array.isArray(completed) && completed.length > 0 ? (completed.map((item,index) => (
                                <tr>
                                    <td>{item.DateOfVisit.split('T')[0]}</td>
                                    <td>{item.PartnerName}</td>
                                    <td>{item.Purpose}</td>
                                    <td><span className='badge bg-success'>{item.Status === 3 ? 'COMPLETED' : ''}</span></td>
                                    
                                </tr>
                            ))) : (<div>No Data available</div>)}
                            {/* <tr>
                                <td>2025-11-19</td>
                                <td>51902 - Adilabad</td>
                                <td>Routine Inspection</td>
                                <td><span className="badge bg-success">Completed</span></td>
                                <td>
                                    <div className="alert alert-warning mb-3">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Report upload pending. Deadline: Nov 18, 2025
                        </div>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                            <button className="btn btn-primary btn-sm w-100">
                            <i className="fas fa-upload"></i> Upload Report Now
                        </button>
                           
                        </div>
                                </td>
                            </tr> */}
                         </tbody>
                        </table>
                     
                </div>
                </div>
        </div>

        <div className="col-sm-6">
            <div className="white-box shadow-sm">
                <h5>Cannot Visit</h5>
                <div className="row gy-3">
                   
                    <div className="col-sm-12">
                        <table className="table tablee-responsive">
                         <thead>
                            <tr>
                                <th>Date</th>
                                <th>School/Location</th>
                                <th>Purpose</th>
                                <th>Status</th>
                               
                            </tr>
                         </thead>
                         <tbody>
                            {Array.isArray(cannotVisit) && cannotVisit.length > 0 ? (
                                cannotVisit.map((item) => (
                                    <tr key={item.TourDiaryId}>
                                        <td>{item.DateOfVisit.split('T')[0]}</td>
                                        <td>{item.PartnerName.replace('TGSWREIS','')}</td>
                                        <td>{item.Purpose}</td>
                                        {item.Status === 5 ? (<td><span className='badge bg-warning'>CANNOT VISIT</span></td>) : null}
                                      
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No Data available</td>
                                </tr>
                            )}
                            
                         </tbody>
                        </table>
                    </div>
                </div>
                </div>
        </div>

        <div className="col-sm-6">
            <div className="white-box shadow-sm">
                <h5>Visited</h5>
                <div className="row gy-3">
                   
                    <div className="col-sm-12">
                        <table className="table tablee-responsive">
                         <thead>
                            <tr>
                                <th>Date</th>
                                <th>School/Location</th>
                                <th>Purpose</th>
                                <th>Status</th>
                               
                            </tr>
                         </thead>
                         <tbody>
                            {Array.isArray(visited) && visited.length > 0 ? (
                                visited.map((item) => (
                                    <tr key={item.TourDiaryId}>
                                        <td>{item.DateOfVisit.split('T')[0]}</td>
                                        <td>{item.PartnerName.replace('TGSWREIS','')}</td>
                                        <td>{item.Purpose}</td>
                                        {item.Status === 2 ? (<td><span className='badge text-bg-info'>VISITED</span></td>) : null}
                                      
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No Data available</td>
                                </tr>
                            )}
                            
                         </tbody>
                        </table>
                    </div>
                </div>
                </div>
        </div>


                {/* <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Uploaded Reports</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Officer</th>
                                <th>Location</th>
                                <th>Report</th>
                                <th>Photos</th>
                                <th>Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-11-15</td>
                                <td>John Doe</td>
                                <td>51902 - Adilabad</td>
                                <td><button className="btn btn-sm">Report</button></td>
                                <td><span className="badge bg-primary">5 Photos</span></td>
                                <td>2025-11-15 18:30</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div> */}
        
      </div>

       {/* Cannot Visit Modal */}
       {showCannotVisitModal && cannotVisitId && ( <div class="modal show fade" id="missedModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Add Remark for Missed Visit</h1>
              <button type="button" class="btn-close" onClick={() => setCannotVisitModal(false)} aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row gy-3">
                    <div class="col-sm-12">
                        <label class="form-label">Reason for Not Visiting</label>
                        <select class="form-select" value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)}>
                          <option value=''>--Select--</option>
                          <option value='Medical Emergency'>Medical Emergency</option>
                          <option value='Weather Conditions'>Weather Conditions</option>
                          <option value='Transportation Issues'>Transportation Issues</option>
                          <option value='Emergency Assignment'>Emergency Assignment</option>
                          <option value='Other'>Other</option>
                        </select>
                    </div>
                  
                    <div class="col-sm-12">
                        <label class="form-label">Detailed Explanation</label>
                        <textarea class="form-control" placeholder="Provide detailed explanation" value={rejectedRemarks} onChange={(e) => setRejectedRemarks(e.target.value)}></textarea>
                    </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setCannotVisitModal(false)}>Cancel</button>
                <button type="button" class="btn btn-primary" onClick={() => MarkCannotVisit()}>Save</button>
            </div>
          </div>
        </div>
      </div>)}
      
 
       {/* Mark Vist Modal */}

       {showMarkVisitModal && visitedId && (<div class="modal show fade" id="completeModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Mark Visit Visited</h1>
              <button type="button" class="btn-close" aria-label="Close" onClick={() => setShowMarkVisitModal(false)}></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row gy-3">
                    
                     <p>Have you visited today's scheduled location?</p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        You'll be redirected to upload the report after marking complete.
                    </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setShowMarkVisitModal(false)}>Cancel</button>
                <button type="button" class="btn btn-primary" onClick={() => MarkVisited()}>Yes, Mark Visited</button>
            </div>
          </div>
        </div>
      </div>)}
      
    </>
  )
}

export default TourUserVisits