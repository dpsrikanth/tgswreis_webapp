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
import DrilldownReport from '../components/DrilldownReport';

const SickEntryDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
// const [zonewiseData,setZonewiseData] = useState([])
const [generalCases,setGeneralCases] = useState(0);
const [feverCases,setFeverCases] = useState(0);
const [referralCases,setReferralCases] = useState(0);
const [admittedCases,setAdmittedCases] = useState(0);
const [topschoolsfever,setTopschoolsfever] = useState([]);
const [topschoolsgeneral,setTopschoolsgeneral] = useState([]);
const [fromDateConsolidated,setFromDateConsolidated] = useState('');
const [toDateConsolidated,setToDateConsolidated] = useState('');
const [consolidatedData,setConsolidatedData] = useState([])
const [sickDate,setSickDate] = useState('')
const [utmostEmergencyCount, setUtmostEmergencyCount] = useState(0)
const [notEnteredCount, setNotEnteredCount] = useState(0)
const [chronicStudentsCount,setChronicStudentsCount] = useState(0);
const [healthSupervisorsCount,setHealthSupervisorsCount] = useState(0);
const navigate = useNavigate();

// const [fromDate,setFromDate] = useState('');
// const [toDate,setToDate] = useState('');




const fetchSickStats = async () => {
    try {
      let payload = {}
        if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

        _fetch('sickstats',payload,false,token).then(res => {
            if(res.status === 'success'){
                setGeneralCases(res.data[0].General);
                setFeverCases(res.data[0].Fever);
                setReferralCases(res.data[0].ReferralCases);
                setAdmittedCases(res.data[0].AdmittedCases);
            } else {
                console.error('Error fetching sick stats')
            }
        })

    } catch (error){
        console.error('Error fetching sick stats',error);
    }
}

const fetchNotEnteredSick = async () => {
  try{
    const payload = {sickDate}
  const res = await _fetch('notenteredsick',payload,false,token)
  if(res.status === 'success' && Array.isArray(res.data) && res.data.length > 0){
    await NotEnteredSickExcelReport(res.data)
  }else{
    toast.error(res.message)
  }

  }catch(error){
    console.error('Error fetching Not Entered Sick Schools',error)
  }
}


const fetchTopSchoolsFever = async () => {
    try {
         
      let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }
    // else admin → no filter (all zones)

        _fetch('topfeverschools',payload,false,token).then(res => {
            if(res.status === 'success'){
                setTopschoolsfever(res.data);
            } else {
                console.error('Error fetching top 10 schools fever')
            }
        })

    } catch(error){
        console.error('Error fetching Top Schools Fever',error)
    }
}


const fetchTopSchoolsGeneral = async () => {
    try {
           let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }
        _fetch('topfoorneschools',payload,false,token).then(res => {
            if(res.status === 'success'){
                setTopschoolsgeneral(res.data);
            } else {
                console.error('Error fetching top 10 schools general')
            }
        })

    } catch(error){
        console.error('Error fetching Top Schools general',error)
    }
}


const fetchConsolidatedSickReport = async () => {
  try {
    const payload = {fromDate:fromDateConsolidated,toDate:toDateConsolidated,ZoneId}

   const res = await _fetch('consolidatedsickreport',payload,false,token);
      if(res.status === 'success' && Array.isArray(res.data) && res.data.length > 0){
        setConsolidatedData(res.data)
        toast.success(res.message);
        await ConsolidatedSickExcelReport(res.data);
      } else {
        console.error('Unable to fetch consolidated sick report');
      }
    
    
  } catch(error){
    console.error('Error fetching Consolidated Sick Report');
  }
}

const ConsolidatedSickExcelReport = async(data) => {
  const workbook = new ExcelJS.Workbook();
    
    const borderStyle = {
    top: {style:'thin'},
    left:{style:'thin'},
    bottom:{style: 'thin'},
    right: {style: 'thin'}
  }
  
  const customHeaders = [
    {header: 'Date' , key: 'Date'},
    {header: 'Zone Name' , key: 'ZoneName'},
    {header: 'School Code' , key: 'SchoolCode'},
    {header: 'Institution Name' , key: 'PartnerName'},
    {header: 'Total No. of General Sick', key: 'TotalGeneralSick'},
    {header: 'Total No. of Fever Cases' , key: 'TotalFever'},
    {header: 'Total No. of Hospital Referral Cases', key: 'TotalReferralCases'},
    {header: 'Total No. of Admitted Cases', key: 'TotalAdmittedCases'},
    {header: 'Temperature', key: 'Temperature'},
    {header: 'Action Taken', key: 'ActionTaken'},
    {header: 'Taken To The Hospital', key: 'TakenToTheHospital'},
    {header: 'Name of Admitted Persons with Health Supervisor Phone Number', key: 'Remarks'}
  ]
  
  
  const createSheet = (sheetName,headers,data) => {
    const sheet = workbook.addWorksheet(sheetName);
    const todayDate = new Date().toISOString().split('T')[0];
    let titleRow;
    if(fromDateConsolidated && toDateConsolidated){
     titleRow = sheet.addRow([`Filtered Consolidated Sick Report - ${fromDateConsolidated} to ${toDateConsolidated}`]);
    } else {
      titleRow = sheet.addRow([`Daily Consolidated Sick Report - ${todayDate}`]);
    }
  
    titleRow.font = {bold: 'true', size: 16}
    titleRow.alignment = {horizontal: 'center'};
    sheet.mergeCells(`A1:L1`);
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
           if (h.key === 'Date') {
          return item.Date ? new Date(item.Date).toLocaleDateString('en-IN') : '-';
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
          let maxLength = 7;
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
      createSheet("Consolidated Sick Report",customHeaders,data);
    } else {
      toast.error(`No Entries for today's date`);
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer],{
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob,`ConsolidatedSickReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}



const NotEnteredSickExcelReport = async(data) => {
  const workbook = new ExcelJS.Workbook();
    
    const borderStyle = {
    top: {style:'thin'},
    left:{style:'thin'},
    bottom:{style: 'thin'},
    right: {style: 'thin'}
  }
  
  const customHeaders = [
    {header: 'SchoolCode' , key: 'SchoolCode'},
    {header: 'School Name' , key: 'SchoolName'},
   
  ]
  
  
  const createSheet = (sheetName,headers,data) => {
    const sheet = workbook.addWorksheet(sheetName);
    const todayDate = new Date().toISOString().split('T')[0];
    let titleRow;
      titleRow = sheet.addRow([`Schools Not Entered Sick Details Report - ${sickDate}`]);
    
  
    titleRow.font = {bold: 'true', size: 16}
    titleRow.alignment = {horizontal: 'center'};
    sheet.mergeCells(`A1:B1`);
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
           if (h.key === 'Date') {
          return item.Date ? new Date(item.Date).toLocaleDateString('en-IN') : '-';
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
          let maxLength = 7;
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
      createSheet("Schools Not Entered",customHeaders,data);
    } else {
      toast.error(`No Entries for today's date`);
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer],{
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob,`SchoolsNotEnteredSickReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}


let dailyTrendChartInstance = null;

const fetchDailyTrends = async(data) => {
  try{

    let payload = {}
        if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

    _fetch('sickdailytrends',payload,false,token).then(res => {
      if(res.status ==='success'){
        const labels = res.data.map(item => item.DayName.slice(0,3));
        const cases = res.data.map(item => item.TotalGeneralSick);

        if(dailyTrendChartInstance){
      dailyTrendChartInstance.destroy();
    }


     if(document.getElementById('dailyTrendsChart')){
      const ctx2 = document.getElementById('dailyTrendsChart')
                              .getContext('2d');

      dailyTrendChartInstance = new Chart(ctx2,{
         type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'General Cases',
                        data: cases,
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
    console.error('Error fetching daily trends');
    toast.error('Error fetching Daily Trends')
  }
}

const fetchUtmostEmergency = async () => {
  try {
     let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

    const res = await _fetch('sickutmostemergency', payload, false, token)

    if (res.status === 'success') {
      setUtmostEmergencyCount(res.count || 0)
    }
  } catch (err) {
    console.error('Error fetching utmost emergency', err)
  }
}



const fetchChronicStudents = async () => {
  try {
     let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

    const res = await _fetch('chronicstudentslist', payload, false, token)

    if (res.status === 'success') {
      setChronicStudentsCount(res.data.length || 0)
    }
  } catch (err) {
    console.error('Error fetching chronic students', err)
  }
}


const fetchHealthSupervisorsList = async () => {
  try {
     let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

    const res = await _fetch('healthsupervisorslist', payload, false, token)

    if (res.status === 'success') {
      setHealthSupervisorsCount(res.data.length || 0)
    }
  } catch (err) {
    console.error('Error fetching health supervisors count', err)
  }
}

const fetchNotEnteredCount = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
     let payload = {};

    // Priority: District > Zone
    if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
      payload.SickDate = today;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
      payload.SickDate = today;
    } else {
      payload.SickDate = today;
    }

    const res = await _fetch('notenteredsick', payload, false, token)

    if (res.status === 'success') {
      setNotEnteredCount(res.data.length || 0)
    }
  } catch (err) {
    console.error('Error fetching not entered schools', err)
  }
}



useEffect(() => {
    
    fetchSickStats();
    fetchTopSchoolsFever();
    fetchTopSchoolsGeneral();
    fetchDailyTrends();

  fetchUtmostEmergency()
  fetchNotEnteredCount()
  fetchChronicStudents()
  fetchHealthSupervisorsList()
},[])





  return (
    <>
    <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/samsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Health Command Centre Dashboard</h6>

      <div className="row g-3 mb-3 pt-3">

        <div className="row g-3">

  {/* 🔴 Utmost Emergency */}
  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${utmostEmergencyCount > 0 ? 'bg-danger text-white blink' : ''}`}
      style={{ cursor: utmostEmergencyCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (utmostEmergencyCount > 0) {
          navigate('/sick/utmost-emergency') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{utmostEmergencyCount}</h3>
      <h6 className="fw-bold">Utmost Emergency</h6>
      <small>Immediate Attention Required</small>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${chronicStudentsCount > 0 ? 'bg-primary text-white blink' : ''}`}
      style={{ cursor: chronicStudentsCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (chronicStudentsCount > 0) {
          navigate('/sick/chronicstudentslist') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{chronicStudentsCount}</h3>
      <h6 className="fw-bold">Chronic Students</h6>
      <small>List of Students with Chronic Diseases</small>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${healthSupervisorsCount > 0 ? 'bg-success text-white blink' : ''}`}
      style={{ cursor: healthSupervisorsCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (healthSupervisorsCount > 0) {
          navigate('/sick/healthsupervisorslist') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{healthSupervisorsCount}</h3>
      <h6 className="fw-bold">Health Supervisors</h6>
      <small>List of Health Supervisors</small>
    </div>
  </div>

  {/* 🟡 Schools Not Entered */}
  <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sicknotentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{notEnteredCount}</h3>
      <h6 className="fw-bold">Schools Not Entered</h6>
      <small>Today</small>
    </div>
  </div>

</div>


        <div className="col-sm-12 mt-3">
            <div className="row g-3">
        <div className="col-md-3">
          <a href="">
          <div className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold maroon">{generalCases ?? 0}</h3>
              <h6 className="fw-bold">General Sick Cases</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-file-medical maroon" style={{fontSize:'28px'}}></i>
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
             
              <h3 className="fw-bold" style={{color:'#FFA500'}}>{feverCases ?? 0}</h3>
               <h6 className="fw-bold">Fever Cases</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-thermometer-half" style={{fontSize:'28px',color:'#FFA500'}}></i>
             
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-success">{referralCases ?? 0}</h3>
                <h6 className="fw-bold">Referral Cases</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-bandaid-fill text-success" style={{fontSize:'28px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm">
            <div>
              <h3 className="fw-bold text-danger">{admittedCases ?? 0}</h3>
              <h6 className="fw-bold">Admitted Cases</h6>
            </div>
            <div className="text-end">
             <i className="bi bi-hospital-fill text-danger" style={{fontSize:'28px'}}></i>
              
            </div>
          </div>
        </div>
      </div>
        </div>

    </div>

    <div className="row g-3 ">
       {/*Charts Section*/}
        <div className="col-sm-12">
            <div className="row gy-3">
        <div className="col-sm-4">
            <div className="white-box shadow-sm">
                 <h5 className="chart-title">Daily General Sick Cases – Current Week</h5>
                    <div className="chart-container" style={{width:'300px'}}>
                        <canvas id="dailyTrendsChart"></canvas>
                    </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Food Borne Cases</h5>
                <div className="top-schools-list">
                  {Array.isArray(topschoolsgeneral) && topschoolsgeneral.length > 0 ? ( topschoolsgeneral.map((item,index) => (
                    <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.SchoolName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalFoorneCasesToday}</div>
                    </div>
                  ))) : (<div>No Sick Entries Entered</div>) }
                </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Fever Cases</h5>
                <div className="top-schools-list">
                {Array.isArray(topschoolsfever) && topschoolsfever.length > 0 ? (

                   topschoolsfever.map((item,index) => (
                     <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.SchoolName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalFeverCasesToday}</div>
                    </div>

                 ))
                ) : (<div>No Sick Entries Entered</div>) }
                
                </div>
            </div>
        </div>

        {/* <div className="col-sm-12">
            <div className="white-box shadow-sm">
                
                <div className="row align-items-center">
                  <div className='col-sm-2'>
                  <h5><span className="pink fw-bold" style={{color:'#cc1178'}}>Zonal Wise Report</span></h5>
                  </div>
                    
                       <div className='col-sm-1'> <label className='col-form-label'>From Date:</label></div>
                  <div className='col-sm-2'> 
                    <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
                     <div className='col-sm-1'> <label className='col-form-label'>To Date:</label></div>
                  <div className='col-sm-2'>
                    <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                    <div className='col-sm-2'><button className='btn btn-success' onClick={() => fetchBetweenSickReport()}>Filtered Report</button></div>
                     <div className='col-sm-2'><button className='btn btn-success' onClick={() => DailySickReport()}>Daily Report</button></div>
                
                </div>
               
                
                    
                <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Date</th>
                                <th>Zone</th>
                                <th>Zone Name</th>
                                <th>Total No of General Sick</th>
                                <th>Total No. of Fever Cases</th>
                                <th>Total No. of Hospital Referral Cases</th>
                                <th>Total No. of Admitted Cases</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                          {zonewiseData.map((item,index) => (
                            <tr key={index}>
                                <td>{item.Date.split('T')[0]}</td>
                                <td>{item.ZoneId}</td>
                                <td>{item.ZoneName}</td>
                                <td>{item.GeneralSick}</td>
                                <td>{item.Fever}</td>
                                <td>{item.ReferralCases}</td>
                                <td>{item.AdmittedCases}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div> */}

        {/* <div className='col-sm-12'>
          <div className='white-box shadow-sm pt-3'>
            <h5 style={{color:'#cc1178'}} className='fw-bold'>Consolidated Sick Report</h5>
            <div className='row align-items-center'>
              <div className='col-sm-3'>
                <label className='form-label'>
                  From Date
                </label>
                <input type='date' value={fromDateConsolidated} onChange={(e) => setFromDateConsolidated(e.target.value)} className='form-control' />
              </div>
              <div className='col-sm-3'>
                <label className='form-label'>
                  To Date
                </label>
                <input type='date' value={toDateConsolidated} onChange={(e) => setToDateConsolidated(e.target.value)} className='form-control' />
              </div>
              <div className='col-sm-3 pt-4'>
                <button className='btn btn-success' onClick={() => fetchConsolidatedSickReport()}>Filtered Consolidated Report</button>
              </div>
              <div className = 'col-sm-3 pt-4'>
                <button className='btn btn-success' onClick={() => fetchConsolidatedSickReport()}>Today's Consolidated Report</button>
              </div>
            </div>
          </div>
        </div> */}

         {/* <div className='col-sm-12'>
          <div className='white-box shadow-sm pt-3'>
            <h5 style={{color:'#cc1178'}} className='fw-bold'>Schools Not Entered Sick Details Report</h5>
            <div className='row align-items-center'>
              <div className='col-sm-3'>
                <label className='form-label'>Select Date</label>
                <input type='date' className='form-control' value={sickDate} onChange={(e) => setSickDate(e.target.value)} />
              </div>
              <div className='col-sm-3'>
                <button className='btn btn-success mt-4' onClick={() => fetchNotEnteredSick()}>Download Report</button>
              </div>
            </div>
            </div>
            </div> */}

        <div className='col-sm-12 mt-3'>
          <div className='white-box shadow-sm pt-2'>
            <div className='row'>
              <div className='col-sm-12'>
                  <DrilldownReport />
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

export default SickEntryDashboard