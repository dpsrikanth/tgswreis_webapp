import React,{ useEffect,useRef,useState }  from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import {data, useNavigate} from 'react-router-dom'

const ComplaintEntry = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserName = useSelector((state) => state.userappdetails.profileData.UserName);
const dataFetched = useRef(false);
const [complaintLogs,setComplaintLogs] = useState([]);
const [showAddModal,setShowAddModal] = useState(false);
const [showEditModal,setShowEditModal] = useState(false);
const [selectedRow,setSelectedRow] = useState('');
const [updateRemarks,setUpdateRemarks] = useState('');
const [updateStatus,setUpdateStatus] = useState('');
const [resolvedDate,setResolvedDate] = useState('');
const [updateActionTaken,setUpdateActionTaken] = useState('');
const [instName,setInstName] = useState('');
const [district,setDistrict] = useState('');
const [address,setAddress] = useState('');
const [schoolCode,setSchoolCode] = useState('');
const [GSMNumber,setGSMNumber] = useState('');
const [TypeOfCall,setTypeofCall] = useState('');
const [callNotes,setCallNotes] = useState('');
const [actionTaken,setActionTaken] = useState('');
const [addRemarks,setAddRemarks] = useState('');
const [ReportedBy, setReportedBy] = useState('');
const [complaintId,setComplaintId] = useState('');
const [newActionTaken,setNewActionTaken] = useState('');
const [newRemarks,setNewRemarks] = useState('');
const [studentsList,setStudentsList] = useState([]);
const [houseMaster,setHouseMaster] = useState('');
const [houseMasPhoneNum,setHouseMasterPhoneNum] = useState('');
const [classDetails,setClassDetails] = useState('');
const [section,setSection] = useState('');



const fetchComplaintLogs = async () => {
    try{

        _fetch('getcomplaintlogs',null,false,token).then(res => {
            if(res.status === 'success'){
                setComplaintLogs(res.data);
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        })

    } catch (error){
        console.error('Error fetching complaint log data:',error)
    }
}


useEffect(() => {

    if(!dataFetched.current){
        dataFetched.current = true;
        fetchComplaintLogs();
    }
},[])


useEffect(() => {
    if(selectedRow){
        setUpdateActionTaken(selectedRow.ActionTaken || '')
        setUpdateStatus(selectedRow.Status || '')
       if (selectedRow.ResolvedDate) {
      const date = new Date(selectedRow.ResolvedDate);
      const formatted = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      setResolvedDate(formatted);
    } else {
      setResolvedDate('');
    }
        setUpdateRemarks(selectedRow.Remarks)
        setComplaintId(selectedRow.ComplaintId)
        setNewActionTaken('')
        setNewRemarks('')
    }

},[selectedRow])


const updateComplaintLog = async () => {

    console.log(complaintId)
     const payload = {
        Status: updateStatus,
        LastUpdatedBy: UserName,
        ResolvedDate: resolvedDate ? new Date(resolvedDate) : null,
        ComplaintId: complaintId
     }

     if(newRemarks?.trim()){
        payload.Remarks = newRemarks.trim();
     }

     if(newActionTaken?.trim()){
        payload.ActionTaken = newActionTaken.trim();
     }


    try {
        _fetch('updatecomplaintlog',payload,false,token).then(res => {
            if(res.status === 'success'){
                toast.success(res.message);
                setShowEditModal(false);
                fetchComplaintLogs();
            } else {
                toast.error(res.message);
            }
        })

    } catch (error){
        console.error('Error updating complaint:',error)
        toast.error(res.message)
    }
}

const fetchCardDetails = async () => {
   try{

    const payload = {}

    payload.cardNumber = GSMNumber

    _fetch('getcarddetails',payload,false,token).then(res => {
        if(res.status === 'success'){
           setAddress(res.data.Other.schooladdress);
           setInstName(res.data.Other.PartnerName);
           setSchoolCode(res.data.Other.SchoolCode);
           setHouseMaster(res.data.Other.HouseMaster);
           setHouseMasterPhoneNum(res.data.Other.HouseMasterPhoneNumber);
           setClassDetails(res.data.Other.Class);
           setSection(res.data.Other.Section);
           setDistrict(res.data.Other.DistrictName);
           setStudentsList(res.data.Students);
        }
    })

   } catch(error){
    console.log('Error fetching details related to card number:',error)
    toast.error(res.message)
   }
}


const fetchGSMDetails = async () => {
    try{

        const payload = {}

        payload.GSMNumber = GSMNumber

        _fetch('getgsmdetails',payload,false,token).then(res => {
            if(res.status === 'success'){
               setAddress(res.data[0].SchoolAddress)
               setDistrict(res.data[0].DistrictName)
               setInstName(res.data[0].PartnerName)
               setSchoolCode(res.data[0].SchoolCode)
            } else {
                toast.error(res.message)
            }
        })

    } catch (error){
        console.error('Error fetching Details for this GSM Number:',error)
        toast.error(res.message)
    }
}

const CreateNewComplaint = async () => {
    try {

        const payload = {
            GSMNumber: GSMNumber,
            CallNotes: callNotes,
            TypeofCall: TypeOfCall,
            ReportedBy: ReportedBy, 
            Remarks: addRemarks,
            AddedBy: UserName,
            SchoolId: schoolCode,
            ActionTaken: actionTaken
        }


        console.log("Creating complaint with:", payload);

        _fetch('createnewcomplaint',payload,false,token).then (res => {
            if(res.status === 'success'){
                toast.success(res.message);
                setShowAddModal(false);
                fetchComplaintLogs();
                setGSMNumber('');
                setReportedBy('');
                setTypeofCall('');
                setCallNotes('');
                setActionTaken('');
                setAddRemarks('');
                setInstName('');
                setAddress('');
                setDistrict('');
                setSchoolCode('');
                setHouseMaster('');
                setHouseMasterPhoneNum('');
            } else {
                toast.error(res.message)
            }
        })

    } catch(error){
        console.error('Error Creating a new complaint:',error)
    }
}


useEffect(() => {

    if(GSMNumber.length === 6){
        fetchCardDetails();
    } else if(GSMNumber.length === 10){
       fetchGSMDetails();
    } else {
         
    }

},[GSMNumber])


const getStatusClass = (status) => {
  switch(status){
    case 'Pending':
      return 'badge text-bg-danger';
    case 'Not Resolved':
      return 'badge text-bg-secondary';
    case 'Resolved':
    return 'badge text-bg-success';
    case 'Partially Resolved':
      return 'badge text-bg-warning';
  }
}


  return (
   <>
      <ToastContainer />
       <div className="bg-white mt-2 py-2">
      <h4 className="text-center">TGSWREIS CALL CENTRE LOG BOOK</h4>
      </div>
      

      <div className="row g-3 mb-3 pt-3">
        
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="col-sm-12 text-end">
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>New Log</button>    
        </div>
                <div className="table-header">
                    <h5><span className="pink fw-bold">Logs Entered</span></h5>
                     {/* <div className="table-tools">
                        <input type="text" className="form-control" placeholder="Search..." />
                         <select className="form-select">
                            <option>Zone-1</option>
                            <option>Zone-2</option>
                            <option>Zone-3</option>
                          </select> 
                          <select className="form-select">
                            <option>District-1</option>
                            <option>District-2</option>
                            <option>District-3</option>
                          </select>
                        <select className="form-select">
                          <option>Pending</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select>
                        <img src="img/print_icon.png">
                    <img src="img/download_icon.png" className="download_img">
                      </div> 
                </div> */}
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Log ID</th>
                                <th>Card / GSM Number</th>
                                <th>School Name</th>
                                <th>Type of Call</th>
                                <th>Call Notes</th>
                                <th>Action Taken</th>
                                <th>Remarks</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                          
                         {complaintLogs.map((item,index) => (
                            <tr key={index}>
                                <td>{item.ComplaintId}</td>
                                <td>{item.GSMNumber}</td>
                                <td>{item.PartnerName}</td>
                                <td>{item.CallNotes}</td>
                                <td>{item.TypeOfCall}</td>
                                <td style={{ whiteSpace: 'pre-line' }}>{item.ActionTaken}</td>
                                <td style={{ whiteSpace: 'pre-line' }}>{item.Remarks}</td>
                                <td><span className={getStatusClass(item.Status)}>{item.Status}</span></td>
                                 <td>
                                <div className="icon-container">
                                    <i className="bi bi-pencil-square" style={{cursor:'pointer',color:'var(--primary-purple)'}} onClick={() => {
                                        setShowEditModal(true)
                                        setSelectedRow(item)
                                        }}></i>
                                </div>    
                            </td>
                            </tr>
                         ))}
                        </tbody>
                    </table>
                </div>
            
        </div>
      </div>


     {showAddModal && (
      <div className="modal fade show" tabIndex="-1" aria-hidden="true" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Enter New Log</h1>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="row g-3 mb-3">
                    <div className="col-sm-4">
                       <label className="form-label">Enter Card/GSM Number <span class="man">&#65290;</span></label>
                       <input type="number" value={GSMNumber} onChange={(e) => setGSMNumber(e.target.value)} onPaste={(e) => setGSMNumber(e.target.value)} className="form-control" />
                    </div>
                    <div className='col-sm-2'>
                        {/* <button className='btn btn-sm btn-primary mt-4' onClick={() => fetchGSMDetails()}>Fetch</button> */}
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Reported By <span class="man">&#65290;</span></label>
                      {GSMNumber.length === 6 ? (
                        <select className='form-select' value={ReportedBy} onChange={(e) => setReportedBy(e.target.value)}>
                            <option value=''>Select Student</option>
                            {studentsList.map((item,index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                      ) : ( <input type='text' value={ReportedBy} onChange={(e) => setReportedBy(e.target.value)} className='form-control'/>)}
                     
                  </div>
                    <div className="col-sm-6">
                        <label className="form-label">Institution Name:</label>
                        <input type="text" value={instName} className="form-control" disabled />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">District</label>
                        <input type="text" value={district} className="form-control" disabled />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Institute Address</label>
                        <textarea rows="3" value={address} className="form-control" disabled></textarea>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">House Master Details</label>
                        <textarea className="form-control" rows={2} value={`Name: ${houseMaster} , PhNo: ${houseMasPhoneNum}`} disabled />

                    </div>
                    
                    <div className="col-sm-6">
                    <label className="form-label">Type of Call <span class="man">&#65290;</span></label>
                     <select className="form-select" value={TypeOfCall} onChange={(e) => setTypeofCall(e.target.value)}>
                        <option value="">--Select--</option>
                        <option value="Academic Support Complaint">Academic Support Complaint</option>
                        <option value="Emotional and Well Being Complaint">Emotional and Well Being Complaint</option>
                        <option value="Food and Hygiene Complaint">Food and Hygiene Complaint</option>
                        <option value="Behavioral and Social Complaint">Behavioral and Social Complaint</option>
                        <option value="Facilities and Infrastructure Complaint">Facilities and Infrastructure Complaint</option>
                        <option value="Security Complaint/Emergency">Security Complaint/Emergency</option>
                        <option value="General">General</option>
                        <option value="Test Call">Test Call</option>
                     </select>
                    </div>
                    <div className="col-sm-12">
                        <label className="form-label">Discussion Regarding <span class="man">&#65290;</span></label>
                        <textarea rows="2" value={callNotes} onChange={(e) => setCallNotes(e.target.value)} className="form-control"></textarea>
                    </div>
                    <div className="col-sm-12">
                        <label className="form-label">Action Taken <span class="man">&#65290;</span></label>
                        <textarea rows="2" value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} className="form-control"></textarea>
                    </div>
                     {/* <div className="col-sm-6">
                        <label className="form-label">Status of Issue</label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">--Select--</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Not Resolved">Not Resolved</option>
                            <option value="Partially Resolved">Partially Resolved</option>
                        </select>
                    </div>  */}
                    {/* <div className="col-sm-6">
                        <label className="form-label">If Resolved,Enter Date</label>
                        <input type="date" className="form-control" />
                    </div> */}
                    <div className="col-sm-12">
                        <label className="form-label">Reasons/Remarks <span class="man">&#65290;</span></label>
                        <textarea className="form-control" value={addRemarks} onChange={(e) => setAddRemarks(e.target.value)} rows="3"></textarea>
                    </div>
                   </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => CreateNewComplaint()}>Submit</button>
            </div>
          </div>
        </div>
      </div>
     )}
      

      {showEditModal && selectedRow && (
       <div className="modal fade show"  tabIndex='-1' aria-hidden="true" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Complaint Details</h1>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="row g-3 mb-3">

                    <div className="col-sm-6">
                        <div className="fw-bold">Log ID</div>
                        <div>{selectedRow.ComplaintId}</div>
                    </div>
                    <div className="col-sm-6">
                        <div className="fw-bold">Card Number/ GSM Number</div>
                        <div>{selectedRow.GSMNumber}</div>
                    </div>

                    <div className="col-sm-6">
                        <div className="fw-bold">Reported By</div>
                        <div>{selectedRow.ReportedBy}</div>
                    </div>

                    <div className="col-sm-6">
                        <div className="fw-bold">Institution Name</div>
                        <div>{selectedRow.PartnerName}</div>
                    </div>

                    <div className="col-sm-6">
                        <div className="fw-bold">District</div>
                        <div>{selectedRow.DistrictName}</div>
                    </div>

                    <div className="col-sm-6">
                        <div className="fw-bold">Date & Time:</div>
                        <div>{new Date(selectedRow.AddedOn).toLocaleString('en-IN')}</div>
                    </div>

                    <div className="col-sm-6">
                        <div className="fw-bold">Type of Call:</div>
                        <div>{selectedRow.TypeOfCall}</div>
                    </div>

                    <div className="col-sm-6">
                         <div className="fw-bold">Discussion Regarding:</div>
                         <div>{selectedRow.CallNotes}</div>
                        </div>
                   
                    <div className="col-sm-6">
                        <label className="fw-bold">Action Taken</label>
                         <div>{selectedRow.ActionTaken}</div>
                    </div>

                    <div className="col-sm-6">
                        <label className="fw-bold">Reasons/Remarks</label>
                        <div>{selectedRow.Remarks}</div>
                    </div>

                     <div className="col-sm-12">
                        <label className="form-label fw-bold">Updated Action Taken</label>
                        <textarea rows="2" className="form-control" value={newActionTaken} onChange={(e) => setNewActionTaken(e.target.value)}></textarea>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label fw-bold">Status of Issue <span class="man">&#65290;</span></label>
                        <select className="form-select" value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                            <option value="">--Select--</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Not Resolved">Not Resolved</option>
                            <option value="Partially Resolved">Partially Resolved</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label fw-bold">If Resolved,Enter Date</label>
                        <input type="date" value={resolvedDate || ''} onChange={(e) => setResolvedDate(e.target.value)} className="form-control" />
                    </div>
                    

                    <div className='col-sm-12'>
                      <label className='form-label fw-bold'>Updated Remarks</label>
                      <textarea className='form-control' rows='3' value={newRemarks} onChange={(e) => setNewRemarks(e.target.value)}></textarea>  
                   </div>
                   </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => updateComplaintLog()}>Update</button>
            </div>
          </div>
        </div>
      </div>
      )}
      
      </div>
   </>
  )
}

export default ComplaintEntry