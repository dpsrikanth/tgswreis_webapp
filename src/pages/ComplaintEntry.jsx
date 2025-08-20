import React,{ useEffect,useRef,useState }  from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import {data, useNavigate} from 'react-router-dom'
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import DataTable from 'react-data-table-component';

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
const [toDate,setToDate] = useState('');
const [fromDate,setFromDate] = useState('');
const [reportedDate,setReportedDate] = useState('');



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
            ActionTaken: actionTaken,
            ReportedOn: reportedDate
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
                setReportedDate('');
            } else {
                toast.error(res.message)
            }
        })

    } catch(error){
        console.error('Error Creating a new complaint:',error)
    }
}


const DailyLogsReport = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

 const customHeaders = [
  {header: 'Complaint ID', key: 'ComplaintId'},
  {header: 'Card/ GSM Number', key: 'GSMNumber'},
  {header: 'School Code', key: 'SchoolId'},
  {header: 'Call Notes', key: 'CallNotes'},
  {header: 'Action Taken', key: 'ActionTaken'},
  {header: 'Type of Call', key: 'TypeOfCall'},
  {header: 'Resolved Date', key: 'ResolvedDate'},
  {header: 'Reported By' , key: 'ReportedBy'},
  {header: 'Remarks', key: 'Remarks'},
  {header: 'Status', key: 'Status'},
 ]


const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);

  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Daily Complaint Logs Report - Project Mitra - ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16};
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

     data.forEach((item) => {
      const rowData = customHeaders.map(h => {
       if (h.key === 'ResolvedDate') {
      return item.ResolvedDate ? new Date(item.ResolvedDate).toLocaleDateString('en-IN') : '-';
    }
    return item[h.key] != null ? item[h.key] : ''
      })

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 5;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
};

if(Array.isArray(data) && data.length > 0){
  const headers = Object.keys(data[0]);
  createSheet("Daily Logs",customHeaders,data);
} else {
  toast.error(`No Logs for today's date`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`DailyLogsReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}


const BetweenExcelReport = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

 const customHeaders = [
  {header: 'Complaint ID', key: 'ComplaintId'},
  {header: 'Card/ GSM Number', key: 'GSMNumber'},
  {header: 'School Code', key: 'SchoolId'},
  {header: 'Call Notes', key: 'CallNotes'},
  {header: 'Action Taken', key: 'ActionTaken'},
  {header: 'Type of Call', key: 'TypeOfCall'},
  {header: 'Resolved Date', key: 'ResolvedDate'},
  {header: 'Reported By' , key: 'ReportedBy'},
  {header: 'Remarks', key: 'Remarks'},
  {header: 'Status', key: 'Status'},
  {header: 'Uploaded Date', key: 'AddedOn'}
 ]


const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);

  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Filtered Complaints Report - Project Mitra - ${fromDate} and ${toDate}`]);
  titleRow.font = {bold: 'true', size: 16};
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

     data.forEach((item) => {
      const rowData = customHeaders.map(h => {
       if (h.key === 'ResolvedDate') {
      return item.ResolvedDate ? new Date(item.ResolvedDate).toLocaleDateString('en-IN') : '-';
    }
    
    if(h.key === 'AddedOn'){
      return item.AddedOn ? new Date(item.AddedOn).toLocaleString('en-IN',{dateStyle: 'short',timeStyle: 'short'}) : '-' ;
    }

    return item[h.key] != null ? item[h.key] : ''
      })

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 5;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
};

if(Array.isArray(data) && data.length > 0){
  const headers = Object.keys(data[0]);
  createSheet("Daily Logs",customHeaders,data);
} else {
  toast.error(`No Logs for today's date`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`ConsolidatedLogsReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}

const fetchDailyLogsReport = async () => {
  try{
   _fetch('dailylogsreport',null,false,token).then(res => {
    if(res.status === 'success'){
       DailyLogsReport(res.data);
    } else {
      toast.error(res.message);
    }
  })
  }
  catch(error){
    console.log('Error fetching Daily Logs report:',error)
    toast.error(res.message);
  }
}

const fetchBetweenLogsReport = async () => {
  const payload = {};
  payload.fromDate = fromDate;
  payload.toDate = toDate;

  _fetch('betweenlogsreport',payload,false,token).then(res => {
    if(res.status === 'success'){
      BetweenExcelReport(res.data);
    } else {
      toast.error(res.message);
    }
  })
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

const customStyles = {
  headCells: {
    style: {
      whiteSpace: 'normal !important', // allow wrapping in header
      wordBreak: 'break-word !important',
    }
  },
  cells: {
    style: {
      whiteSpace: 'pre-line !important',
      wordBreak: 'break-word !important'
    }
  }
  
};

const columns = [
    {
        name: 'Log ID',
        selector: row => row.ComplaintId,
        sortable:true,
        width: '90px',
        wrap: true,   
    },
    {
        name: 'Card / GSM Number',
        selector: row => row.GSMNumber,
        sortable:true
    },
    {
        name: 'School Name',
        selector: row => row.PartnerName,
        cell: row => (
            <div style={{ whiteSpace: 'pre-line',wordBreak: 'break-word' }}>
                {row.PartnerName}
            </div>
        ),
        sortable:true
    },
     {
        name: 'Reported Date',
        selector: row => (row.ReportedOn ? (row.ReportedOn.split('T')[0]) : ('-') ),
        sortable:true
    },
    {
        name: 'Uploaded Date',
        selector: row => (row.AddedOn ? (row.AddedOn.split('T')[0]) : ('-')),
        sortable:true
    },
    {
        name: 'Type of Call',
        selector: row => row.TypeOfCall,
         cell: row => (
            <div style={{ whiteSpace: 'pre-line',wordBreak: 'break-word' }}>
                {row.TypeOfCall}
            </div>
        ),
        sortable:true
    },
    {
        name: 'Call Notes',
        selector: row => row.CallNotes,
         cell: row => (
            <div style={{ whiteSpace: 'pre-line',wordBreak: 'break-word' }}>
                { row.CallNotes}
            </div>
        ),
        sortable:false
    },
    {
        name: 'Action Taken',
        selector: row => row.ActionTaken,
        cell: row => (
        <div style={{ whiteSpace: 'pre-line' }}>
            {row.ActionTaken || ''}
        </div>
    ),
        sortable:false
    },
    {
        name: 'Remarks',
        selector: row => row.Remarks,
         cell: row => (
        <div style={{ whiteSpace: 'pre-line' }}>
            {row.Remarks || ''}
        </div>
    ),
        sortable:false
    },
    {
        name: 'Status',
        selector: row => (<span className={getStatusClass(row.Status)}>{row.Status}</span>),
        sortable:false,
        width: '130px'
    },
    {
        name: 'Action',
        selector: row => ( <div className="icon-container">
                                    <i className="bi bi-pencil-square" style={{cursor:'pointer',color:'var(--primary-purple)'}} onClick={() => {
                                        setShowEditModal(true)
                                        setSelectedRow(row)
                                        }}></i>
                                </div>),
        width: '80px',    
        sortable:false
    }
]



  return (
   <>
      <ToastContainer />
       <div className="bg-white mt-2 py-2">
      <h4 className="text-center">TGSWREIS CALL CENTRE LOG BOOK</h4>
      </div>
      

      <div className="row g-3 mb-3 pt-3">
        
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="col-sm-12">
                    <div className='row align-items-center'>
                              <div className='col-sm-2'><h5 className='mb-0'><span className="pink fw-bold" style={{color:'#cc1178'}}>List of Complaints</span></h5></div>
                    <div className='col-sm-1'> <label className='col-form-label'>From Date:</label></div>
                  <div className='col-sm-2'> 
                    <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
                     <div className='col-sm-1'> <label className='col-form-label'>To Date:</label></div>
                  <div className='col-sm-2'>
                    <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
                  <div className='col-sm-1'><button className='btn btn-success' onClick={() => fetchBetweenLogsReport()}>Filtered</button></div>
                        <div className='col-sm-1'><button className='btn btn-success me-2' onClick={() => fetchDailyLogsReport()}>Today</button></div>
                        <div className='col-sm-2 text-end'><button className="btn btn-primary py-2" onClick={() => setShowAddModal(true)}>New Log</button></div>
                    </div>
                </div>
                <div className="table-header">
                    {/* <h5><span className="pink fw-bold">Logs Entered</span></h5> */}
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
                <div className="table-responsive mt-3">

                  <DataTable 
                  columns={columns}
                  data={complaintLogs}
                  pagination
                  striped
                  persistTableHead
                  noDataComponent={<span>No data available</span>}
                  highlightOnHover
                  dense
                  />


                     {/* <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Log ID</th>
                                <th>Card / GSM Number</th>
                                <th>School Name</th>
                                <th>Reported Date</th>
                                <th>Uploaded Date</th>
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
                                <td>{item.ReportedOn ? (item.ReportedOn.split('T')[0]) : ('-') }</td>
                                <td>{item.AddedOn ? (item.AddedOn.split('T')[0]) : ('-')}</td>
                                <td>{item.TypeOfCall}</td>
                                <td>{item.CallNotes}</td>
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
                    </table>  */}
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
                    <div className='col-sm-6'>
                        <label className='form-label'>Reported On</label>
                        <input type='date' className='form-control' value={reportedDate} onChange={(e) => setReportedDate(e.target.value)} />
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
                        <div className="fw-bold">Reported Date:</div>
                        <div>{selectedRow.ReportedOn ? (selectedRow.ReportedOn.split('T')[0]) : (selectedRow.AddedOn.split('T')[0])}</div>
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