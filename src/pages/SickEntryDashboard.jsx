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
// const [zonewiseData,setZonewiseData] = useState([])
const [generalCases,setGeneralCases] = useState(0);
const [feverCases,setFeverCases] = useState(0);
const [referralCases,setReferralCases] = useState(0);
const [admittedCases,setAdmittedCases] = useState(0);
const [topschoolsfever,setTopschoolsfever] = useState([]);
const [topschoolsgeneral,setTopschoolsgeneral] = useState([]);
// const [fromDate,setFromDate] = useState('');
// const [toDate,setToDate] = useState('');




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

       const payload = {ZoneId}

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
          const payload = {ZoneId}
        _fetch('topgeneralschools',payload,false,token).then(res => {
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
    
    fetchSickStats();
    fetchTopSchoolsFever();
    fetchTopSchoolsGeneral();
    fetchDailyTrends();
},[])





  return (
    <>
    <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/samsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Daily Sick Students Dashboard</h6>

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
                <h5 className="chart-title">Top 10 Schools by General Cases</h5>
                <div className="top-schools-list">
                  {Array.isArray(topschoolsgeneral) && topschoolsgeneral.length > 0 ? ( topschoolsgeneral.map((item,index) => (
                    <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.PartnerName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalGeneralCases}</div>
                    </div>
                  ))) : (<tr>No Sick Entries Entered</tr>) }
                   
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
                            <div className="school-name">{item.PartnerName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalFeverCases}</div>
                    </div>

                 ))
                ) : (<tr>No Sick Entries Entered</tr>) }
                
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

        <div className='col-sm-12'>
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