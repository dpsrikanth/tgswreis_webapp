import React,{useState} from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import Select from 'react-select';


const CsrDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST)
    
const [csrActivitiesList,setCsrActivitiesList] = useState([]);
const [ActivityTitle,setActivityTitle] = useState('');
const [Description,setDescription] = useState('');
const [startDate,setStartDate] = useState('');
const [endDate,setEndDate] = useState('');
const [assignedTo,setAssignedTo] = useState([]);
const [attachment,setAttachment] = useState(null);
const [showModal,setShowModal] = useState(false);
const [assignedCount,setAssignedCount] = useState(null);
const [wipCount,setWipCount] = useState(null);
const [completedCount,setCompletedCount] = useState(null);
const [totalCount,setTotalCount] = useState(null);
const [showModalTwo,setShowModalTwo] = useState(false)
const [selectedActivityId,setSelectedActivityId] = useState(null)
const [updatedTitle,setUpdatedTitle] = useState('');
const [updatedDescription,setUpdatedDescription] = useState('');
const [updatedStartDate,setUpdatedStartDate] = useState('');
const [updatedEndDate,setUpdatedEndDate] = useState('');
const [assignedToEdit,setAssignedToEdit] = useState([]);

const fetchCSRActivities = async () => {
    try {

        _fetch('getcsractivities',null,false,token).then(res => {
            if(res.status === 'success'){
                setCsrActivitiesList(res.data);
                toast.success(res.message)
            } else {
                toast.error(res.message);
            }
        })

    } catch (error){
        console.error('Error fetching CSR Activities',error)
        toast.error(res.message)
    }
}

const fetchCSRStats = async () => {
  try {
    _fetch('getcsrstats',null,false,token).then(res => {
      if(res.status === 'success'){
        setAssignedCount(res.data[0].CountByStatus)
        setWipCount(res.data[1].CountByStatus)
        setCompletedCount(res.data[2].CountByStatus)
        setTotalCount(res.data[3].CountByStatus)
      }
    })

  } catch (error){
    console.error('Error fetching CSRStats',error)
    toast.error(res.message);
  }
}



const createCsrActivity = async () => {
    try{


     

      let assignedSchoolCodes;
      if(assignedTo.some((opt) => opt.value === 'all')){
        assignedSchoolCodes = 'all';
      } else {
        assignedSchoolCodes = assignedTo.map((opt) => opt.value).join(',')
      }


       const formData =  new FormData();
      formData.append("ActivityTitle",ActivityTitle);
      formData.append('Description',Description);
      formData.append("StartDate",startDate)
      formData.append("EndDate",endDate)
      formData.append('AssignedTo',assignedSchoolCodes);
      if(attachment){
      formData.append('Attachment',attachment);
      }

        const payload = {ActivityTitle,Description,StartDate:startDate,EndDate:endDate,AssignedTo:assignedSchoolCodes}

        _fetch('createcsractivity',formData,true,token).then(res => {
            if(res.status === 'success'){
                toast.success(res.message)
                setShowModal(false)
                fetchCSRActivities();
                fetchCSRStats();
                setActivityTitle('');
                setDescription('');
                setStartDate('')
                setEndDate('')
                setAssignedTo([])
                setAttachment(null)
            }else{
                toast.error(res.message);
            }
        })

    } catch (error){
        console.error('error creating csr activity',error)
        toast.error(res.message);
    }
}

const updateCsrActivity = async () => {
  try{

    let assignedEditCodes;
    if(assignedToEdit.some((opt) => opt.value === 'all')){
      assignedEditCodes = 'all';
    } else {
      assignedEditCodes = assignedToEdit.map((opt) => opt.value).join(',')
    }

    const payload = {
      ActivityId : selectedActivityId.ActivityId,
      ActivityTitle: updatedTitle,
      Description: updatedDescription,
      EndDate: updatedEndDate,
      StartDate: updatedStartDate,
      AssignedTo: assignedEditCodes,
    }

    _fetch('updatecsractivity',payload,false,token).then(res => {

      if(res.status === 'success'){
        setShowModalTwo(false);
        toast.success(res.message);
        fetchCSRActivities();
      }else {
        toast.error(res.message);
      }

    })

  } catch (error) {
    console.error('Error updating csr activity',error);
    toast.error('Error updating csr activity');
  }
}

useEffect(() => {

    fetchCSRActivities();
    fetchCSRStats();

},[])


useEffect(() => {
  if(showModalTwo && selectedActivityId){
    if(selectedActivityId.AssignedTo === 'all'){
      setAssignedToEdit([{value: 'all',label : 'All Schools'}]);
    } else {
      const assignedCodes = selectedActivityId.AssignedTo.split(',');
      const selectedOptions = schoolsList.filter((s) => assignedCodes.includes(s.SchoolCode.toString()))
      .map((s) => ({value: s.SchoolCode, label: s.PartnerName}));
      setAssignedToEdit(selectedOptions);
    }
  }
},[showModalTwo,selectedActivityId,schoolsList])

  return (
    <>
     <div className="row">
        <div className="col-sm-12">
            <div className="row pb-3">
        <div className="col-sm-12 d-flex justify-content-between align-items-center">
           <h5 className='fw-bold mb-0'>Corporate Social Responsibility (CSR) Dashboard</h5>
            <button className="btn btn-primary" onClick={() => {setShowModal(true)
                console.log(schoolsList)
            }}>New Activity</button>
        </div>
      </div>
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="card-box blue-bg shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total</h6>
                    <h4 className="fw-bold">{totalCount}</h4>
                  </div>
                 <i className="bi bi-clipboard text-secondary" style={{fontSize:'24px'}}></i>
                </div>
                <hr/>
                
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-box purple-bg shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Assigned</h6>
                    <h4 className="fw-bold">{assignedCount}</h4>
                  </div>
                  <i className="bi bi-hourglass-split text-warning" style={{fontSize:'24px'}}></i>
                </div>
                <hr/>
               
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-box pink-bg shadow-sm">
                <a href="#">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>In Progress</h6>
                      <h4 className="fw-bold">{wipCount}</h4>
                    </div>
                   <i className="bi bi-check-circle-fill text-success" style={{fontSize:'24px'}}></i>
                  </div>
                  <hr/>
                </a>
              </div>
            </div>
             <div className="col-md-3">
              <div className="card-box pink-bg shadow-sm">
                <a href="#">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Completed</h6>
                      <h4 className="fw-bold">{completedCount}</h4>
                    </div>
                   <i className="bi bi-check-circle-fill text-success" style={{fontSize:'24px'}}></i>
                  </div>
                  <hr/>
                </a>
              </div>
            </div>
           
          </div>

          


          <div className="row g-3 mb-3">
           
           
            <div className="white-box shadow-sm">
             <div className="table-header">
                    <h5><span className="pink fw-bold">List of CSR Activities</span></h5>
                    <div className="table-tools">
                        <input type="text" className="form-control" placeholder="Search..." />
                        <img src="img/print_icon.png" />
                    <img src="img/download_icon.png" className="download_img" />
                      </div>
                </div>
                <table className="table table-bordered mt-2">
                        <thead>
                            <tr>
                                <th>Activity Id</th>
                                <th>Activity Title</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Assigned To</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csrActivitiesList.map((item) => (
                                <tr key={item.ActivityId}>
                                    <td>{item.ActivityId}</td>
                                    <td>{item.ActivityTitle}</td>
                                    <td>{item.Description}</td>
                                    <td>{item.StartDate.split('T')[0]}</td>
                                    <td>{item.EndDate.split('T')[0]}</td>
                                    <td>{item.AssignedTo}</td>
                                    <td><span className={item.Status === 'wip' ? 'badge bg-warning text-black' : 'badge bg-primary'}>{item.Status}</span></td>
                                    <td><div className="d-flex justify-content-between">
            {/* <button className="btn btn-sm btn-info"><i class="bi bi-eye"></i></button> */}
            <button className="btn btn-sm btn-warning" onClick={() => {setSelectedActivityId(item)
              setUpdatedTitle(item.ActivityTitle)
              setUpdatedDescription(item.Description)
              setUpdatedEndDate(item.EndDate.split('T')[0])
              setUpdatedStartDate(item.StartDate.split('T')[0])
              setShowModalTwo(true)}
            }><i class="bi bi-pencil-square"></i></button>
            </div></td>
                                </tr>
                            ))}
                            
                            
                        </tbody>
                    </table>
            </div>
           
           
          </div>
         
         
      </div>
      </div>

     {showModal && (
        <div className="modal fade show"  tabIndex="-1" role='dialog' style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Create New CSR Activity</h1>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body row g-3">
        <div className="col-md-6">
          <label className="form-label">Activity Subject</label>
          <input type="text" placeholder="Enter activity title" className="form-control" value={ActivityTitle} onChange={(e) => setActivityTitle(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Assign To</label>
          <Select
          isClearable={true}
          isMulti={true}
          isSearchable={true}
          options={[
    { value: "all", label: "All Schools" },
    ...schoolsList.map((school) => ({
      value: school.SchoolCode,
      label: school.PartnerName,
    })),
  ]}
          placeholder='Select School'
          value={assignedTo}
          onChange={(selectedOptions) => setAssignedTo(selectedOptions || [])}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Describe the CSR activity, its objectives, and expected outcomes" value={Description} onChange={(e) => setDescription(e.target.value)} rows="3" />
        </div>
        <div className="col-md-6">
          <label className="form-label">From</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">To</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
       
         <div className="col-md-6">
          <label className="form-label">Attachments</label>
          <input type="file" onChange={(e) => setAttachment(e.target.files[0])}  className="form-control" />
          <small className="form-text text-muted">Upload relevant documents, guidelines, or reference materials</small>
        </div> 
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => createCsrActivity()}>Create</button>
      </div>
    </div>
  </div>
      </div>
     )}


     {showModalTwo && selectedActivityId &&  (
        <div className="modal fade show"  tabIndex="-1" role='dialog' style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit CSR Activity for {selectedActivityId.ActivityId}</h1>
        <button type="button" className="btn-close" onClick={() => setShowModalTwo(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body row g-3">
        <div className="col-md-6">
          <label className="form-label">Activity Subject</label>
          <input type="text" placeholder="Enter activity title" className="form-control" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Assign To</label>
          <Select
          isClearable={true}
          isMulti={true}
          isSearchable={true}
          options={[
    { value: "all", label: "All Schools" },
    ...schoolsList.map((school) => ({
      value: school.SchoolCode,
      label: school.PartnerName,
    })),
  ]}
          placeholder='Select School'
          value={assignedToEdit}
          onChange={(selectedOptions) => setAssignedToEdit(selectedOptions || [])}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Describe the CSR activity, its objectives, and expected outcomes" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} rows="3" />
        </div>
        <div className="col-md-6">
          <label className="form-label">From</label>
          <input type="date" className="form-control" value={updatedStartDate} onChange={(e) => setUpdatedStartDate(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">To</label>
          <input type="date" className="form-control" value={updatedEndDate} onChange={(e) => setUpdatedEndDate(e.target.value)} />
        </div>
       
         {/* <div className="col-md-6">
          <label className="form-label">Attachments</label>
          <input type="file" className="form-control" />
          <small className="form-text text-muted">Upload relevant documents, guidelines, or reference materials</small>
        </div>  */}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowModalTwo(false)}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => updateCsrActivity()}>Update</button>
      </div>
    </div>
  </div>
      </div>
     )}
      
    </>
  )
}

export default CsrDashboard