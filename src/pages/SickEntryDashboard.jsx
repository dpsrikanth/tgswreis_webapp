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

const SickEntryDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
const [zonewiseData,setZonewiseData] = useState([])
const [generalCases,setGeneralCases] = useState(0);
const [feverCases,setFeverCases] = useState(0);
const [referralCases,setReferralCases] = useState(0);
const [admittedCases,setAdmittedCases] = useState(0);
const [topschoolsfever,setTopschoolsfever] = useState([]);
const [topschoolsgeneral,setTopschoolsgeneral] = useState([]);
const [fromDate,setFromDate] = useState('');
const [toDate,setToDate] = useState('');

const fetchZoneWiseData = async () => {
    try {

      const payload = {}
        payload.ZoneId = ZoneId;

        _fetch('zonewisedatasick',payload,false,token).then(res => {
            if(res.status === 'success'){
              setZonewiseData(res.data);
              toast.success('Zone Wise Data fetched successfully')
            } else {
                console.error('Error fetching zonewise data')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}


const fetchSickStats = async () => {
    try {

        const payload = {}
        payload.ZoneId = ZoneId;

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


const fetchTopSchoolsFever = async () => {
    try {

        _fetch('topfeverschools',null,false,token).then(res => {
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

        _fetch('topgeneralschools',null,false,token).then(res => {
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


const DailySickReport = async () => {
    try {

      const payload = {}
        payload.ZoneId = ZoneId;

        _fetch('zonewisedatasick',payload,false,token).then(res => {
            if(res.status === 'success'){
              DailySickEntryReport(res.data);
              toast.success('Report generated successfully')
            } else {
                console.error('Error fetching zonewise data')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}


const fetchBetweenSickReport = async () => {
    try {

      const payload= {fromDate,toDate,ZoneId}

        _fetch('zonalreportsick',payload,false,token).then(res => {
            if(res.status === 'success'){
             BetweenSickReport(res.data);
              toast.success('Report generated successfully')
            } else {
                console.error('Error fetching zonewise data')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}





const DailySickEntryReport = async(data) => {
  const workbook = new ExcelJS.Workbook();
  
  const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
}

const customHeaders = [
  {header: 'Date' , key: 'Date'},
  {header: 'Zone',   key: 'ZoneId'},
  {header: 'Zone Name' , key: 'ZoneName'},
  {header: 'Total No. of General Sick', key: 'GeneralSick'},
  {header: 'Total No. of Fever Cases' , key: 'Fever'},
  {header: 'Total No. of Hospital Referral Cases', key: 'ReferralCases'},
  {header: 'Total No. of Admitted Cases', key: 'AdmittedCases'}
]


const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);
  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Daily Sick Report ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16}
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:G1`);
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
    createSheet("Daily Sick Report",customHeaders,data);
  } else {
    toast.error(`No Entries for today's date`);
  }
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer],{
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob,`SickEntryReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}


const BetweenSickReport = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

const customHeaders = [
  {header: 'Date' , key: 'Date'},
  {header: 'Zone',   key: 'ZoneId'},
  {header: 'Zone Name' , key: 'ZoneName'},
  {header: 'Total No. of General Sick', key: 'GeneralSick'},
  {header: 'Total No. of Fever Cases' , key: 'Fever'},
  {header: 'Total No. of Hospital Referral Cases', key: 'ReferralCases'},
  {header: 'Total No. of Admitted Cases', key: 'AdmittedCases'}
]



const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);

  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Filtered Sick Entries Report - ${fromDate} and ${toDate}`]);
  titleRow.font = {bold: 'true', size: 16};
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:G1`);
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
  createSheet("Sick Entries",customHeaders,data);
} else {
  toast.error(`No Entries for these dates`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`ConsolidatedSickEntriesReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}

let dailyTrendChartInstance = null;

const fetchDailyTrends = async(data) => {
  try{

    const payload = {};
    payload.ZoneId = ZoneId;

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




useEffect(() => {
    fetchZoneWiseData();
    fetchSickStats();
    fetchTopSchoolsFever();
    fetchTopSchoolsGeneral();
    fetchDailyTrends();
},[])





  return (
    <>
    <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Daily Sick Students Dashboard</h6>

      <div className="row g-3 mb-3 pt-3">

        <div className="col-sm-12">
            <div className="row g-3 mb-3">
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

    <div className="row g-3 mb-3">

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
                <h5 className="chart-title">Top 10 Schools by General Cases</h5>
                <div className="top-schools-list">
                  {topschoolsgeneral.map((item,index) => (
                    <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.PartnerName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalGeneralCases}</div>
                    </div>
                  ))}
                </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Fever Cases</h5>
                <div className="top-schools-list">
                 {topschoolsfever.map((item,index) => (
                     <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.PartnerName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalFeverCases}</div>
                    </div>

                 ))}
                </div>
            </div>
        </div>

        <div className="col-sm-12">
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
        </div>

            </div>
        </div>
       

       
      </div>
    </>
  )
}

export default SickEntryDashboard