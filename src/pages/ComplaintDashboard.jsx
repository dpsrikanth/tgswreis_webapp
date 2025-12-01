import React,{ useEffect,useRef,useState }  from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import {data, useNavigate} from 'react-router-dom'
import io from 'socket.io-client'
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import DataTable from 'react-data-table-component';


const ComplaintDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const dataFetched = useRef(false);
const [pendingCount,setPendingCount] = useState(0);
const [resolvedCount,setResolvedCount] = useState(0);
const [totalCount,setTotalCount] = useState(0);
const [partiallyResolvedCount,setPartiallyResolvedCount] = useState(0);
const [notResolvedCount,setNotResolvedCount] = useState(0);
const [topSchoolsList,setTopSchoolsList] = useState([]);
const [complaintLogs,setComplaintLogs] = useState([]);
const [showViewModal,setShowViewModal] = useState(false);
const [selectedRow,setSelectedRow] = useState('');
const [notification, setNotification] = useState(null);
const [toDate,setToDate] = useState('');
const [fromDate,setFromDate] = useState('');
const navigate = useNavigate();

const fetchComplaintStats = async () => {
  try {

    _fetch('getcomplaintstats',null,false,token).then(res => {
      if(res.status === 'success'){
        setPendingCount(res.data.ComplaintStats[0].CountByStatus);
        setResolvedCount(res.data.ComplaintStats?.[2]?.CountByStatus);
        setPartiallyResolvedCount(res.data.ComplaintStats?.[1]?.CountByStatus);
        setTotalCount(res.data.ComplaintStats?.[4]?.CountByStatus);
        setNotResolvedCount(res.data.ComplaintStats?.[3]?.CountByStatus); 
      }
    })

  } catch (error) {
   console.error('Error fetching Complaint Stats:',error) 
  }
}


const fetchTopSchoolsByComplaints = async () => {
  try {

    _fetch('gettopschoolsbycomplaints',null,false,token).then(res => {
      if(res.status === 'success'){
        setTopSchoolsList(res.data);
      }else {
        console.log(res.message);
      }
    })

  } catch(error){
    console.error('Error fetching Top Schools By Complaints:',error)
  }
}


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


let complaintChartInstance = null;
let monthlyTrendChartInstance = null;

const fetchComplaintTypes = async () => {
  try{ 

    _fetch('getcomplainttypes',null,false,token).then(res => {
      if(res.status === 'success'){
        const complainTypes = res.data.map(item => item.TypeOfCall);
        const count = res.data.map(item => item.Count);

         if (complaintChartInstance) {
          complaintChartInstance.destroy();
        }
       
        if(document.getElementById('complaintTypesChart')) {
          const ctx = document.getElementById('complaintTypesChart')
                                    .getContext('2d');
           complaintChartInstance = new Chart(ctx,{
                                type: 'doughnut',
                data: {
                    labels: complainTypes,
                    datasets: [{
                        data: count,
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 11 }
                            }
                        }
                    }
                }
                          })
        }
      } else {
        toast.error(res.message);
      }
    }) 


  } catch (error){
    console.error('Error fetching Complaint Types:',error)
  }
}


const fetchMonthlyTrends = async () => {
  try {
          
    _fetch('getmonthlytrends',null,false,token).then(res => {
      if(res.status === 'success'){
        const months = res.data.map(item => item.MonthYear)
        const count = res.data.map(item => item.RecordCount)

        if(monthlyTrendChartInstance){
          monthlyTrendChartInstance.destroy();
        }

       if(document.getElementById('dailyTrendsChart')){
        const ctx2 = document.getElementById('dailyTrendsChart')
                              .getContext('2d');

         monthlyTrendChartInstance = new Chart(ctx2,{
                           type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Complaints',
                        data: count,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
                      })
       }



      }
    }) 

  } catch(error){
    console.log('Error fetching Monthly Trends:',error)
  }
}


useEffect(() => {

 if(!dataFetched.current){
   dataFetched.current = true; 
 fetchComplaintStats();
 fetchTopSchoolsByComplaints();
 fetchComplaintLogs();
 fetchComplaintTypes();
 fetchMonthlyTrends();
 }

// const socket = io('http://localhost:9001/ws/complaints',{
//   transports: ['websocket']
// })

// socket.on('connect',() => {
//   console.log('Connected to complaints namespace')
// });

// socket.on('connect_error', (err) => {
//   console.error('Socket connection error:', err);
// });

// socket.on('complaintUpdated',(data) => {
// console.log(data.message)
// fetchComplaintStats();
// fetchTopSchoolsByComplaints();
// fetchComplaintLogs();
// fetchComplaintTypes();
// fetchMonthlyTrends();

// });

// socket.on('complaintNotification',(data) => {
//   console.log(data.message);
//    toast.info(
//       <>
//         <strong>{data.message}</strong>
//         <br />
//         <small>{new Date(data.timestamp).toLocaleTimeString()}</small>
//       </>,
//       {
//         position: 'top-right',
//         autoClose: 4000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         icon: '📢',
//         theme: 'colored',
//       }
//     );
// })

// return () => {
//   socket.disconnect();
// }


},[])


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
  {header: 'Uploaded Date', key: 'AddedOn'}
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
                                    <i className="bi bi-eye-fill" style={{cursor:'pointer',color:'var(--primary-purple)'}} onClick={() => {
                                        setShowViewModal(true)
                                        setSelectedRow(row)
                                        }}></i>
                                </div> ),
        width: '80px',    
        sortable:false
    }
]

  return (
    <>
      <ToastContainer/>
          <h6 className="fw-bold mb-3"><a onClick={() => navigate('/samsdashboard')} style={{cursor:'pointer'}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Complaint Dashboard</h6>
        
      <div>
        {notification && (
          <div className="alert alert-danger position-fixed top-0 end-0 m-3 shadow" role="alert">
          <strong>{notification.message}</strong>
          <br />
          <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
        </div>
        )}
      </div>
      <div className="row g-3 mb-3">

        <div className="col-sm-12">
            <div className="d-flex text-center">
        <div className="w-20">
          <a href="">
          <div
            className="white-box d-flex justify-content-between shadow-sm"
          >
            <div>
              <h3 className="fw-bold maroon">{totalCount}</h3>
              <h6 className="fw-bold">Total Complaints</h6>
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
             
              <h3 className="fw-bold text-danger">{pendingCount}</h3>
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
            
              <h3 className="fw-bold text-success">{resolvedCount}</h3>
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
              <h3 className="fw-bold text-warning">{partiallyResolvedCount}</h3>
              <h6 className="fw-bold">Partially Resolved</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-circle-half text-warning" style={{fontSize: '28px'}}></i>
            </div>
          </div>
        </div>
        <div className="w-20">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-secondary">{notResolvedCount}</h3>
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

    <div className="row g-3 mb-3">

        <div className="col-sm-12">
            <div className="row gy-3">
                 <div className="col-sm-4">
            <div className="white-box shadow-sm">
                 <h5 className="chart-title">Complaint Types</h5>
                    <div className="chart-container" style={{width:'350px'}}>
                        <canvas id="complaintTypesChart"></canvas>
                    </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm">
                 <h5 className="chart-title">Monthly Complaint Trends</h5>
                    <div className="chart-container" style={{width:'300px'}}>
                        <canvas id="dailyTrendsChart"></canvas>
                    </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Complaints</h5>
                <div className="top-schools-list">
                    {/* <div className="school-item">
                        <div>
                            <div className="school-name">ICHODA BOYS</div>
                            <div className="school-district">RangaReddy</div>
                        </div>
                        <div className="complaint-count">23</div>
                    </div> */}

                    {topSchoolsList.map((item,index) => (
                      <div className='school-item' key={index}>
                        <div>
                         <div className='school-name'>{item.PartnerName}</div>
                         <div className="school-district">{item.DistrictName}</div>
                        </div>
                        <div className='complaint-count'>{item.TotalCount}</div>
                      </div>
                    ))}
                    
                </div>
            </div>
        </div>

        <div className="col-sm-12">
            <div className="white-box shadow-sm">

              <div className='col-sm-12'>
                <div className='row align-items-center'>
                  <div className='col-sm-2'><h5 className='mb-0'><span className="pink fw-bold" style={{color:'#cc1178'}}>List of Complaints</span></h5></div>
                    <div className='col-sm-1'> <label className='col-form-label'>From Date:</label></div>
                  <div className='col-sm-2'> 
                    <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
                     <div className='col-sm-1'> <label className='col-form-label'>To Date:</label></div>
                  <div className='col-sm-2'>
                    <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
                  <div className='col-sm-2'><button className='btn btn-success' onClick={() => fetchBetweenLogsReport()}>Filtered Complaints</button></div>
                  <div className='col-sm-2'><button className='btn btn-success' onClick={() => fetchDailyLogsReport()}>Today's Complaints</button>
              </div></div>
                </div>
                
                
                
                <div className="table-header">
                    {/* <h5><span className="pink fw-bold">List of Complaints</span></h5> */}
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
                                <th>Date & Time</th>
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
                                <td>{item.UploadedOn}</td>
                                <td>{item.TypeOfCall}</td>
                                <td>{item.CallNotes}</td>
                                <td style={{ whiteSpace: 'pre-line' }}>{item.ActionTaken}</td>
                                <td style={{ whiteSpace: 'pre-line' }}>{item.Remarks}</td>
                                <td><span className={getStatusClass(item.Status)}>{item.Status}</span></td>
                                 <td>
                                <div className="icon-container">
                                    <i className="bi bi-eye-fill" style={{cursor:'pointer',color:'var(--primary-purple)'}} onClick={() => {
                                        setShowViewModal(true)
                                        setSelectedRow(item)
                                        }}></i>
                                </div>    
                            </td>
                            </tr>
                         ))}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>

            </div>
        </div>
       

       
      </div>


      {showViewModal && selectedRow && (
<div className="modal fade show" tabIndex="-1"  aria-hidden="true" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">View Details for LogID - {selectedRow.ComplaintId}</h1>
              <button type="button" className="btn-close" onClick={() => setShowViewModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                       <label className="fw-bold">Card / GSM Number</label>
                       <div>{selectedRow.GSMNumber}</div>
                    </div>
                    <div className="col-sm-6">
                       <label className="fw-bold">Reported By</label>
                       <div>{selectedRow.ReportedBy}</div>
                    </div>
                    <div className="col-sm-6">
                        <label className="fw-bold">Institution Name:</label>
                        <div>{selectedRow.PartnerName}</div>
                    </div>
                    <div className="col-sm-6">
                        <label className="fw-bold">District</label>
                        <div>{selectedRow.DistrictName}</div>
                    </div>
                   
                    <div className="col-sm-6">
                      <label className="fw-bold">Reported Date</label>
                      <div>{selectedRow.ReportedOn ? (selectedRow.ReportedOn.split('T')[0]) : (selectedRow.AddedOn.split('T')[0])}</div>
                    </div>
                    <div className="col-sm-6">
                    <label className="fw-bold">Type of Call</label>
                     <div>{selectedRow.TypeOfCall}</div>
                    </div>
                    <div className="col-sm-12">
                        <label className="fw-bold">Discussion Regarding</label>
                        <div>{selectedRow.CallNotes}</div>
                    </div>
                    <div className="col-sm-12">
                        <label className="fw-bold">Action Taken</label>
                        <div style={{ whiteSpace: 'pre-line' }}>{selectedRow.ActionTaken}</div>
                    </div>
                    <div className="col-sm-6">
                        <label className="fw-bold">Status of Issue</label>
                        <div>{selectedRow.Status}</div>
                    </div>
                    <div className="col-sm-6">
                        <label className="fw-bold">If Resolved,Enter Date</label>
                        <div> {selectedRow.ResolvedDate ? new Date(selectedRow.ResolvedDate).toLocaleDateString('en-IN') : ''}</div>
                    </div>
                    <div className="col-sm-12">
                        <label className="fw-bold">Reasons/Remarks</label>
                        <div style={{ whiteSpace: 'pre-line' }}>{selectedRow.Remarks}</div>
                    </div>
                   </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Cancel</button>
                
            </div> 
          </div>
        </div>
      </div>
      )}
      
      </div>
    </>
  )
}

export default ComplaintDashboard