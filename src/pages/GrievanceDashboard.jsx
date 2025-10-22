import React,{useState} from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';



const GrievanceDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);

const [grievancesList,setGrievancesList] = useState([]);
const [showModal,setShowModal] = useState(false);
const [resolutionReason,setResolutionReason] = useState('');
const [resolvedOn,setResolvedOn] = useState('');
const [selectedGrievanceId,setSelectedGrievanceId] = useState(null);
const [GrievanceStatus,setGrievanceStatus] = useState('');
const [totalCount,setTotalCount] = useState('');
const [PendingCount,setPendingCount] = useState('');
const [ResolvedCount,setResolvedCount] = useState('');
const [NotResolvedCount,setNotResolvedCount] = useState('');


const getStatusClass = (status) => {
  switch(status){
    case 'Pending':
      return 'badge text-bg-danger';
      case 'Not Resolved':
        return 'badge text-bg-warning';
        case 'Resolved':
          return 'badge text-bg-success';
  }
}


const fetchGrievances = async () => {
    try {

        _fetch('getgrievances',null,false,token).then(res => {
            if(res.status === 'success'){
                setGrievancesList(res.data);
                toast.success(res.message)
            }else {
                toast.error(res.message)
            }
        })


    } catch (error){
        console.error('Error fetching Grievances List')
        toast.error('Error fetching Grievances')
    }
}


const fetchGrievancesStats = async () => {
  try {

    _fetch('getgrievancestats',null,false,token).then(res => {
      if(res.status === 'success'){
        setTotalCount(res.data[3].CountByStatus);
        setPendingCount(res.data[0].CountByStatus);
        setResolvedCount(res.data[1].CountByStatus);
        setNotResolvedCount(res.data[2].CountByStatus);
      }else{
        toast.error(res.message)
      }
    })

  } catch (error) {
    console.error('Error fetching Grievance Stats',error)
    toast.error('Error fetching Grievance Stats')
  }
}


const updateGrievanceStatus = async () => {
  try {

    const payload = {GrievanceId: selectedGrievanceId.GrievanceId,GrievanceStatus: GrievanceStatus,ResolutionReason: resolutionReason,ResolvedOn:resolvedOn ? resolvedOn : null}

    _fetch('updategrievancestatus',payload,false,token).then(res => {
      if(res.status === 'success'){
        setShowModal(false);
        toast.success(res.message);
        setSelectedGrievanceId(null);
        setGrievanceStatus('');
        setResolutionReason('');
        setResolvedOn('');
        fetchGrievances();
        fetchGrievancesStats();

      } else {
        toast.error(res.message)
      }
    })
  } catch (error){
    console.error('Error Updating Grievance',error)
    toast.error('Error updating Grievance')
  }
} 



useEffect(() => {

    fetchGrievances();
    fetchGrievancesStats();

},[])


const DailyLogsReport = async (data) => {
const workbook = new ExcelJS.Workbook();

const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
}


const customHeaders = [
  {
    header: 'Grievance ID' , key: 'GrievanceCode',
    header: 'School Code',   key: 'SchoolCode',
    header: 'Complainant Name' , key: 'ComplainantName',
    header: 'Subject', key: 'Subject',
    header: 'Description' , key: 'Description',
    header: 'Status', key: 'Status'
  }
]

const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);
  const todayDate = new Date().toISOString.split('T')[0];
  const titleRow = sheet.addRow([`Daily Grievance Report ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16}
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:E1`);
  sheet.addRow([]);

    const headerNames = headers.map(h => h.header);
  const headerRow = sheet.addRow(headerNames);
  headerRow.font = {bold: true};
  headerRow.alignment = {horizontal: 'center'};

    headerRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' },
    };
  });

  

}

}

useEffect(() => {

  if(!showModal){
    setResolutionReason('');
    setGrievanceStatus('');
    setResolvedOn('');
  }

},[showModal,selectedGrievanceId])

  return (
    <>
    <ToastContainer />
   <div className="row g-3 mb-3">

    <div className='col-sm-12'>
      <h5 className='fw-bold mb-0'>Grievance Dashboard</h5>
    </div>

        <div className="col-sm-12">
            <div className="d-flex text-center">
        <div className="w-20">
          <a href="">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold maroon">{totalCount}</h3>
              <h6 className="fw-bold">Total Grievances</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-journal-text maroon" style={{fontSize:'28px'}}></i>
           
            </div>
          </div>
          </a>
        </div>
        <div className="w-20">
          <a href="">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
             
              <h3 className="fw-bold text-danger">{PendingCount}</h3>
               <h6 className="fw-bold">Pending</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-hourglass-split text-danger" style={{fontSize:'28px'}}></i>
            
            </div>
          </div>
          </a>
        </div>
        <div className="w-20">
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
            
              <h3 className="fw-bold text-success">{ResolvedCount}</h3>
                <h6 className="fw-bold">Resolved</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-check-circle-fill text-success" style={{fontSize: '28px'}}></i>
            </div>
          </div>
        </div>
        <div className="w-20">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-secondary">{NotResolvedCount}</h3>
              <h6 className="fw-bold">Not Resolved</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-exclamation-triangle-fill text-secondary" style={{fontSize: '28px'}}></i>
            </div>
          </div>
        </div>
      </div>
        </div>

    </div>

    <div className='row mb-3'>
        <div className='white-box shadow-sm'>
        <div class="table-header d-flex justify-between"><h5><span class="pink fw-bold">List of Grievances</span></h5><div class="text-end"><button class="btn btn-success">Download Excel</button></div></div>
         <table className='table table-bordered'>
            <thead>
                <tr>
                    <th>Grievance ID</th>
                    <th>School Code</th>
                    <th>Complainant Name</th>
                    <th>Subject</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
             {grievancesList.map((item) => (
                <tr key={item.GrievanceId}>
                    <td>{item.GrievanceCode}</td>
                    <td>{item.SchoolId}</td>
                    <td>{item.ComplainantName}</td>
                    <td>{item.Subject}</td>
                    <td>{item.Description}</td>
                    <td>
                        <span className={getStatusClass(item.GrievanceStatus)}>{item.GrievanceStatus}</span>
                    </td>
                    <td>
            <div className="d-flex justify-content-between">
            {/* <button className="btn btn-sm btn-info me-2"><i className="bi bi-eye"></i></button> */}
            <button className="btn btn-sm btn-warning me-2" onClick={() => {setSelectedGrievanceId(item)
            setGrievanceStatus(item.GrievanceStatus)
              setShowModal(true)
            }}><i className="bi bi-pencil-square"></i></button>
            </div></td>
                </tr>
             ))}
            </tbody>
        </table>
        </div>
        
    </div>


     {showModal && selectedGrievanceId && (
        <div className="modal fade show"  tabIndex="-1" role='dialog' style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        key={selectedGrievanceId}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Action for {selectedGrievanceId.GrievanceCode}</h1>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body row g-3">
        <div className='col-sm-6'>
          <div className='fw-bold'>School Code</div>
          <div>{selectedGrievanceId.SchoolId}</div>
        </div>
        <div className='col-sm-6'>
          <div className='fw-bold'>Complainant Name</div>
          <div>{selectedGrievanceId.ComplainantName}</div>
        </div>
        <div className='col-sm-6'>
          <div className='fw-bold'>Subject</div>
          <div>{selectedGrievanceId.Subject}</div>
        </div>
        <div className='col-sm-6'>
          <div className='fw-bold'>Description</div>
          <div>{selectedGrievanceId.Description}</div>
        </div>
        <div className="col-md-12">
          <label className="form-label">Remarks</label>
          <textarea className="form-control" placeholder="Enter Remarks if Resolved/Not Resolved" value={resolutionReason} onChange={(e) => setResolutionReason(e.target.value)} rows="3" />
        </div>
        <div className='col-sm-6'>
           <label className="form-label">Status</label>
           <select className='form-select' value={GrievanceStatus} onChange={(e)=>setGrievanceStatus(e.target.value)}>
            <option value=''>Please Select</option>
            <option value='Pending'>Pending</option>
            <option value='Resolved'>Resolved</option>
            <option value='Not Resolved'>Not Resolved</option>
           </select>
        </div>

        
        <div className="col-md-6">
          <label className="form-label">If Resolved,Enter Date</label>
          <input type="date" className="form-control" value={resolvedOn} onChange={(e) => setResolvedOn(e.target.value)} />
        </div>
       
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => updateGrievanceStatus()}>Update</button>
      </div>
    </div>
  </div>
      </div>
     )}
    </>
  )
}

export default GrievanceDashboard