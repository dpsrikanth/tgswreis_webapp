import React,{useState} from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect,useRef } from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import DrilldownReport from '../components/DrilldownReport';
import OperatorHealthView from '../components/OperatorHealthView';
import { useQuery } from '@tanstack/react-query';

const SickEntryDashboard = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
const UserType = useSelector((state) => state.userappdetails.profileData.UserType)


const [sickDate,setSickDate] = useState('')
const chartRef = useRef(null);
const chartInstanceRef = useRef(null);



const navigate = useNavigate();


const getSickStats = async({queryKey}) => {
  const [,{ ZoneId, DistrictId, token }] = queryKey
  let payload = {};

   if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch('sickstats', payload, false, token);

  if (res.status !== 'success') {
    throw new Error('Failed to fetch sick stats');
  }

  return {
    general: res.data[0].General,
    fever: res.data[0].Fever,
    referral: res.data[0].ReferralCases,
    admitted: res.data[0].AdmittedCases
  };
  
}



const getTopFeverSchools = async ({queryKey}) => {
  const [,{ZoneId,DistrictId,token}] = queryKey;

  let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch(
    'topfeverschools',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch top fever schools');
  }

  return res.data || [];
}


const getTopFoodBorneSchools = async ({ queryKey }) => {
  const [, { ZoneId, DistrictId, token }] = queryKey;

  let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch(
    'topfoorneschools',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch top food-borne schools');
  }

  return res.data || [];
};












// let dailyTrendChartInstance = null;

// const fetchDailyTrends = async(data) => {
//   try{

//     let payload = {}
//         if (DistrictId && DistrictId !== 0) {
//       payload.DistrictId = DistrictId;
//     } else if (ZoneId && ZoneId !== 0) {
//       payload.ZoneId = ZoneId;
//     }

//     _fetch('sickdailytrends',payload,false,token).then(res => {
//       if(res.status ==='success'){
//         const labels = res.data.map(item => item.DayName.slice(0,3));
//         const cases = res.data.map(item => item.TotalGeneralSick);

//         if(dailyTrendChartInstance){
//       dailyTrendChartInstance.destroy();
//     }


//      if(document.getElementById('dailyTrendsChart')){
//       const ctx2 = document.getElementById('dailyTrendsChart')
//                               .getContext('2d');

//       dailyTrendChartInstance = new Chart(ctx2,{
//          type: 'line',
//                 data: {
//                     labels: labels,
//                     datasets: [{
//                         label: 'General Cases',
//                         data: cases,
//                         borderColor: '#667eea',
//                         backgroundColor: 'rgba(102, 126, 234, 0.1)',
//                         tension: 0.4,
//                         fill: true
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         legend: { display: false }
//                     },
//                     scales: {
//                         y: {
//                             beginAtZero: true,
//                             grid: { display: false }
//                         },
//                         x: {
//                             grid: { display: false }
//                         }
//                     }
//                 }
//       })                        
//     }

//       }
//     })
     
    

   

//   } catch(error){
//     console.error('Error fetching daily trends');
//     toast.error('Error fetching Daily Trends')
//   }
// }


const getDailySickTrends = async ({ queryKey }) => {
  const [, { ZoneId, DistrictId, token }] = queryKey;

  let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch(
    'sickdailytrends',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch daily sick trends');
  }

  return res.data || [];
};



const getUtmostEmergencyCount = async ({queryKey}) => {
const [, { ZoneId, DistrictId, token }] = queryKey;

  let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

   const res = await _fetch(
    'sickutmostemergency',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch utmost emergency count');
  }

  return res.count || 0;
}



const getChronicStudentsCount = async ({queryKey}) => {
const [, { ZoneId, DistrictId, token }] = queryKey;

  let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch(
    'chronicstudentscount',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch chronic students count');
  }

  return res.data[0].TotalChronicStudents || 0

}


const getHealthSupervisorsCount = async ({queryKey}) => {
const [,{ZoneId,DistrictId,token}] = queryKey;

let payload = {};

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

   const res = await _fetch(
    'healthsupervisorscount',
    payload,
    false,
    token
  );

  if (res.status !== 'success') {
    throw new Error('Failed to fetch health supervisors count');
  }

  return res.data[0].TotalHealthSupervisors || 0

}


const getDailySickStatusCounts = async ({queryKey}) => {
  const [, { ZoneId, DistrictId, token }] = queryKey;

   const today = new Date().toISOString().split('T')[0];

  let payload = { SickDate: today };

  if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

   const res = await _fetch(
    'sickdailystatuscounts',
    payload,
    false,
    token
  );

   if (res.status !== 'success') {
    throw new Error('Failed to fetch daily sick status counts');
  }

   return {
    notEntered: res.data.notEntered || 0,
    noSickConfirmed: res.data.noSickConfirmed || 0
  };
}



const getRecoveredStudentsCount = async ({queryKey})  => {
  const [,{ZoneId,DistrictId,token}] = queryKey;

  const today = new Date().toISOString().split('T')[0];

   let payload = { SickDate: today };

    if (DistrictId && DistrictId !== 0) {
    payload.DistrictId = DistrictId;
  } else if (ZoneId && ZoneId !== 0) {
    payload.ZoneId = ZoneId;
  }

  const res = await _fetch(
    'studentsrecovered',
    payload,
    false,
    token
  );

   if (res.status !== 'success') {
    throw new Error('Failed to fetch recovered students');
  }

  return res.data.length || 0;
} ;





const {
  data: sickStats,
  dataUpdatedAt,
  isLoading: sickStatsLoading,
  isFetching: sickStatsFetching
} = useQuery({
  queryKey: [
    'sickStats',
    { ZoneId, DistrictId, token }
  ],
  queryFn: getSickStats,
  enabled: !!token, // prevents race condition
});


const {
  data: recoveredCount = 0,
  isLoading: recoveredLoading,
  isFetching: recoveredFetching
} = useQuery({
  queryKey: ['recoveredStudents',{ZoneId,DistrictId,token}],
  queryFn: getRecoveredStudentsCount,
  enabled: !!token
})

const {
  data: dailyStatusCounts,
  isLoading: statusLoading,
  isFetching: statusFetching
} = useQuery({
  queryKey: ['dailySickStatusCounts',{ZoneId,DistrictId,token}],
  queryFn: getDailySickStatusCounts,
  enabled: !!token
})

const {
  data: utmostEmergencyCount = 0,
  isLoading: emergencyLoading,
  isFetching: emergencyFetching
} = useQuery({
  queryKey: [
    'utmostEmergency',{ZoneId,DistrictId,token}],
  queryFn: getUtmostEmergencyCount,
  enabled: !!token,
})

const {
  data: healthSupervisorsCount = 0,
  isLoading: supervisorsLoading,
  isFetching: supervisorsFetching,
  }  = useQuery({
    queryKey: [
      'healthSupervisorsCount',
      { ZoneId, DistrictId, token }
    ],
    queryFn: getHealthSupervisorsCount,
    enabled: !!token
  })

  const {
    data: chronicStudentsCount = 0,
    isLoading: chronicLoading,
    isFetching: chronicFetching
  } = useQuery({
    queryKey: [
      'chronicStudentsCount',
      { ZoneId, DistrictId, token }
    ],
    queryFn: getChronicStudentsCount,
    enabled: !!token
  })


  const {
    data: topFeverSchools = [],
    isLoading: feverLoading,
    isFetching: feverFetching
  } = useQuery({
    queryKey: [
      'topFeverSchools',
      { ZoneId, DistrictId, token }
    ],
    queryFn: getTopFeverSchools,
    enabled: !!token
  })

  const {
    data: topFoodBorneSchools = [],
    isLoading: foodLoading,
    isFetching: foodFetching,
  } = useQuery({
    queryKey: [
      'topFoodBorneSchools',
      {ZoneId, DistrictId, token}
    ],
    queryFn: getTopFoodBorneSchools,
    enabled: !!token
  })


  const {
  data: dailyTrends = [],
  isLoading: trendsLoading
} = useQuery({
  queryKey: [
    'dailySickTrends',
    { ZoneId, DistrictId, token }
  ],
  queryFn: getDailySickTrends,
  enabled: !!token
});

const lastUpdated = dataUpdatedAt
  ? dayjs(dataUpdatedAt).format('hh:mm A')
  : '-';

const nextUpdate = dataUpdatedAt
  ? dayjs(dataUpdatedAt).add(15, 'minute').format('hh:mm A')
  : '-';



useEffect(() => {
  if (trendsLoading) return;
  if (!dailyTrends || dailyTrends.length === 0) return;
  if (!chartRef.current) return;

  const labels = dailyTrends.map(item =>
    item.DayName.slice(0, 3)
  );

  const cases = dailyTrends.map(item =>
    item.TotalGeneralSick
  );

  // destroy old chart
  if (chartInstanceRef.current) {
    chartInstanceRef.current.destroy();
  }

  const ctx = chartRef.current.getContext('2d');

  chartInstanceRef.current = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'General Cases',
          data: cases,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102,126,234,0.15)',
          tension: 0.4,
          fill: true
        }
      ]
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
  });

  return () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
  };
}, [dailyTrends, trendsLoading]);



  return (
    <>
    <div className='d-flex justify-content-between'>
<h6 className="fw-bold"><a onClick={() => {navigate('/samsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>TGSWREIS Health Command Centre Dashboard</h6>
<div>
<a className='btn btn-primary me-2' href='images/HOSPITAL ADMINISTRATION.xlsx' download>Hospital Administration</a>
 <a className='btn btn-primary me-2' href='images/TVVP ALL SUPERINTENDENTS PHONE NUMBER.xlsx' download>TVVP All Superintendents</a>
  <a className='btn btn-primary' href='https://docs.google.com/spreadsheets/d/1WhKnfiNwaOj6HArB98hLSEr6PIJtnBTy1k8kWeKNOFM/edit?gid=0#gid=0' target='_blank'>DMHOs CCs DPOs and DDMs</a>
</div>
    </div>
    

      <div className="row g-3 mb-3">

        <div className="row g-3">
          <div className='col-sm-12'>
            <div className="dashboard-sync-info">
  <span>🕒 Last updated: {lastUpdated}</span>
  <span className="mx-2">|</span>
  <span>🔄 Updates every 15 mins</span>
  <span className="mx-2">|</span>
  <span>⏭ Next update: {nextUpdate}</span>

  {sickStatsFetching && <span className="ms-2">🔄 Syncing...</span>}
</div>

          </div>
         

  {/* 🔴 Utmost Emergency */}
  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${emergencyLoading ? '-' : utmostEmergencyCount > 0 ? 'bg-danger text-white blink' : ''}`}
      style={{ cursor: emergencyLoading ? '-' : utmostEmergencyCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (emergencyLoading ? '-' : utmostEmergencyCount > 0) {
          navigate('/sick/utmost-emergency') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{emergencyLoading ? '-' : utmostEmergencyCount}</h3>
      <h6 className="fw-bold">Utmost Emergency</h6>
      <small>Immediate Attention Required</small>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${chronicLoading ? '-' : chronicStudentsCount > 0 ? 'bg-primary text-white blink' : ''}`}
      style={{ cursor: chronicLoading ? '-' : chronicStudentsCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (chronicLoading ? '-' : chronicStudentsCount > 0) {
          navigate('/sick/chronicstudentslist') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{chronicLoading ? '-' :chronicStudentsCount}</h3>
      <h6 className="fw-bold">Chronic Students</h6>
      <small>List of Students with Chronic Diseases</small>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className={`white-box shadow-sm text-center 
        ${supervisorsLoading ? '-' : healthSupervisorsCount > 0 ? 'bg-secondary text-white blink' : ''}`}
      style={{ cursor: supervisorsLoading ? '-' : healthSupervisorsCount > 0 ? 'pointer' : 'default' }}
      onClick={() => {
        if (supervisorsLoading ? '-' : healthSupervisorsCount > 0) {
          navigate('/sick/healthsupervisorslist') // or drilldown page
        }
      }}
    >
      <h3 className="fw-bold">{supervisorsLoading ? '-' : healthSupervisorsCount}</h3>
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
      <h3 className="fw-bold">{statusLoading ? '-' : dailyStatusCounts?.notEntered ?? 0}</h3>
      <h6 className="fw-bold">Schools Not Entered</h6>
      <small>Today</small>
    </div>
  </div>

   <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sickentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{statusLoading ? '-' : dailyStatusCounts?.hasSickEntries ?? 0}</h3>
      <h6 className="fw-bold">Schools Entered</h6>
      <small>Today</small>
    </div>
  </div>

   <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-success text-white"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sick/nosickstudents') // optional list page
      }}
    >
      <h3 className="fw-bold">{statusLoading ? '—' : dailyStatusCounts?.noSickConfirmed ?? 0}</h3>
      <h6 className="fw-bold">No Sick Students Schools</h6>
      <small>Today</small>
    </div>
  </div>

   <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-info"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sick/recovered') // optional list page
      }}
    >
      <h3 className="fw-bold">{recoveredLoading ? '-' : recoveredCount}</h3>
      <h6 className="fw-bold">Students Recovered</h6>
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
              <h3 className="fw-bold maroon">{sickStatsLoading ? '-' : sickStats?.general ?? 0}</h3>
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
             
              <h3 className="fw-bold" style={{color:'#FFA500'}}>{sickStatsLoading ? '-' : sickStats?.fever ?? 0}</h3>
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
            className="white-box d-flex justify-content-between shadow-sm" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/sick/referred')
            }}>
            <div>
              <h3 className="fw-bold text-success">{sickStatsLoading ? '-' : sickStats?.referral ?? 0}</h3>
                <h6 className="fw-bold">Referral Cases</h6>
            </div>
            <div className="text-end">
              <i className="bi bi-bandaid-fill text-success" style={{fontSize:'28px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="white-box d-flex justify-content-between shadow-sm"
            style={{ cursor: 'pointer' }}
            onClick={() => {
        navigate('/sick/admitted') 
      }}>
            <div>
              <h3 className="fw-bold text-danger">{sickStatsLoading ? '-' : sickStats?.admitted ?? 0}</h3>
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
                        <canvas ref={chartRef}></canvas>
                    </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Food Borne Cases</h5>
                <div className="top-schools-list">
                  {foodLoading ? (
  <div>Loading...</div>
) : topFoodBorneSchools.length > 0 ? ( topFoodBorneSchools.map((item,index) => (
                    <div className="school-item" key={index}>
                        <div>
                            <div className="school-name">{item.SchoolName}</div>
                            {/* <div className="school-district">RangaReddy</div> */}
                        </div>
                        <div className="complaint-count">{item.TotalFoorneCasesToday}</div>
                    </div>
                  ))) : (<div>No Food Borne Sick Entries Entered</div>) }
                </div>
            </div>
        </div>

        <div className="col-sm-4">
            <div className="white-box shadow-sm h-100">
                <h5 className="chart-title">Top 10 Schools by Fever Cases</h5>
                <div className="top-schools-list">
                {feverLoading ? (
  <div>Loading...</div>
): topFeverSchools.length > 0 ? (

                   topFeverSchools.map((item,index) => (
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

       


        <div className='col-sm-12 mt-3'>
          <div className='white-box shadow-sm pt-2'>
            <div className='row'>
              <div className='col-sm-12'>
                  {UserType === 'HealthAdmin' ? (
      <OperatorHealthView />
    ) : (
      <DrilldownReport />
    )}
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