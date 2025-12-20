import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import { ToastContainer } from 'react-toastify';
import { exportToExcel } from '../libs/exportToExcel';
import { useNavigate } from 'react-router-dom';


const StudentReports = () => {
 const token = useSelector((state) => state.userappdetails.TOKEN);
 const zones = useSelector((state) => state.userappdetails.ZONES_LIST || []);
 const districts = useSelector((state) => state.userappdetails.DISTRICT_LIST || []);
 const schools = useSelector((state) => state.userappdetails.SCHOOL_LIST || [])
 const navigate = useNavigate();
const REPORT_TYPES = [
    {label: 'Strength', value: 'STRENGTH'},
    {label: 'Gender Wise', value: 'GENDER'},
    {label: 'Caste Wise', value: 'CASTE'},
];

const LEVELS = [
     {label: 'State', value: 'STATE'},
     { label: 'Zone', value: 'ZONE' },
     { label: 'District', value: 'DISTRICT' },
     { label: 'School', value: 'SCHOOL' }
]

const [filters,setFilters] = useState({
    reportType: 'STRENGTH',
    level: 'STATE',
    zoneId: null,
    districtId: null,
    schoolId: null
});

const filteredSchools = React.useMemo(() => {
  if (!Array.isArray(schools)) return [];

  if (filters.districtId) {
    return schools.filter(
      s => String(s.DistrictId) === String(filters.districtId)
    );
  }

  if (filters.zoneId) {
    return schools.filter(
      s => String(s.ZoneId) === String(filters.zoneId)
    );
  }

  return schools;
}, [schools, filters.zoneId, filters.districtId]);

const filteredDistricts = React.useMemo(() => {
  if (!filters.zoneId) return districts;
    if (!Array.isArray(schools) || schools.length === 0) {
    return [];
  }
console.log('filters.zoneId:', filters.zoneId);
console.log('schools sample:', schools.slice(0, 5));

  const districtIds = new Set(
    schools
      .filter(s => String(s.ZoneId) === String(filters.zoneId))
      .map(s => s.DistrictId)
  );

  console.log('districtIds:',districtIds)

  return districts.filter(d => districtIds.has(d.DistrictId));

}, [filters.zoneId, schools, districts]);






const [rows,setRows] = useState([]);

const handleChange = (e) => {
  const { name, value } = e.target;

  setFilters(prev => {
    const updated = { ...prev, [name]: value || null };

    if (name === 'zoneId') {
      updated.districtId = null;
      updated.schoolId = null;
    }

    if (name === 'districtId') {
      updated.schoolId = null;
    }

    return updated;
  });
};



const fetchStudentReports = async () => {
    try{

        const payload = {
            reportType: filters.reportType,
            level: filters.level,
            zoneId: filters.zoneId || null,
            districtId:  filters.districtId || null,
            schoolId: filters.schoolId || null
        }

        _fetch('studentreport',payload,false,token).then(res => {
            if(res.status === 'success'){
                setRows(res.data);
            }else {
                toast.error(res.message);
            }
        })

    } catch(error){
        console.error('Error fetching Student Reports',error);
    }
}


const pivotCasteData = (data, levelKey) => {
  if (!Array.isArray(data) || data.length === 0) return { columns: [], rows: [] };

  // 1. Unique castes
  const castes = [...new Set(data.map(d => d.Caste))];

  // 2. Group by level (STATE / ZONE / DISTRICT / SCHOOL)
  const grouped = {};

  data.forEach(item => {
    const key = item[levelKey] ?? 'STATE';

    if (!grouped[key]) {
      grouped[key] = { Label: key, Total: 0 };
      castes.forEach(c => (grouped[key][c] = 0));
    }

    grouped[key][item.Caste] += item.StudentCount;
    grouped[key].Total += item.StudentCount;
  });

  return {
    columns: castes,
    rows: Object.values(grouped)
  };
};


const casteLevelKeyMap = {
  STATE: null,
  ZONE: 'ZoneName',
  DISTRICT: 'DistrictName',
  SCHOOL: 'PartnerName'
};

const castePivot = filters.reportType === 'CASTE'
  ? pivotCasteData(rows, casteLevelKeyMap[filters.level])
  : null;

const renderHeaders = () => {
    if(filters.reportType === 'STRENGTH'){
        if(filters.level === 'SCHOOL'){
            return (
                <>
                <th>School</th>
                <th>Total</th>
                <th>Boys</th>
                <th>Girls</th>
                </>
            );
        }
        return (
            <>
            <th>{filters.level}</th>
            <th>Total Students</th>
            </>
        )
    }

    if(filters.reportType === 'GENDER'){
        return(
            <>
            <th>{filters.level}</th>
            <th>Male</th>
            <th>Female</th>
            </>
        );
    }

    if(filters.reportType === 'CASTE'){
        return (
           <>
      <th>{filters.level}</th>
      {castePivot?.columns.map(caste => (
        <th key={caste}>{caste}</th>
      ))}
      <th>Total</th>
    </>
        )
    }
}


const renderRow = (row,index) => {
    if(filters.reportType === 'STRENGTH'){
        if(filters.level === 'SCHOOL'){
            return (
                <tr key={index}>
                    <td>{row.SchoolName}</td>
                    <td>{row.TotalStudents}</td>
                    <td>{row.Boys}</td>
                    <td>{row.Girls}</td>
                </tr>
            );
        }
         return (
        <tr key={index}>
         <td>{row.ZoneName || row.DistrictName || 'STATE'}</td>
         <td>{row.TotalStudents}</td>
        </tr>
    )
    }

   

      if (filters.reportType === 'GENDER') {
    return (
      <tr key={index}>
        <td>{row.ZoneName || row.DistrictName || row.PartnerName || 'STATE'}</td>
        <td>{row.MaleCount}</td>
        <td>{row.FemaleCount}</td>
      </tr>
    );
  }

  if (filters.reportType === 'CASTE') {
    return (
       <tr key={index}>
      <td>{row.Label}</td>
      {castePivot.columns.map(caste => (
        <td key={caste}>{row[caste] || 0}</td>
      ))}
      <td>{row.Total}</td>
    </tr>
    );
  }
}



//reports

const LEVEL_LABEL_KEY = {
  STATE: 'Label',        // we’ll create this manually
  ZONE: 'ZoneName',
  DISTRICT: 'DistrictName',
  SCHOOL: 'SchoolName'
};

const normalizedRows =
  filters.level === 'STATE'
    ? rows.map(r => ({ ...r, Label: 'STATE' }))
    : rows;



const strengthColumns = [
  {
    header: filters.level,
    key: LEVEL_LABEL_KEY[filters.level]
  },
  { header: 'Total Students', key: 'TotalStudents' }
];


const schoolStrengthColumns = [
  { header: 'School', key: 'SchoolName' },
  { header: 'Total', key: 'TotalStudents' },
  { header: 'Boys', key: 'Boys' },
  { header: 'Girls', key: 'Girls' }
];


const exportStrengthExcel = () => {
    const exportRows =
    filters.level === 'STATE'
      ? rows.map(r => ({ ...r, Label: 'STATE' }))
      : rows;
  exportToExcel({
    sheetName: 'Strength Report',
    fileName: `Strength_${filters.level}.xlsx`,
    columns: filters.level === 'SCHOOL'
      ? schoolStrengthColumns
      : strengthColumns,
    rows:exportRows
  });
};

const genderColumns = [
  {
    header: filters.level,
    key: LEVEL_LABEL_KEY[filters.level]
  },
  { header: 'Male', key: 'MaleCount' },
  { header: 'Female', key: 'FemaleCount' }
];


const schoolGenderColumns = [
  { header: 'School', key: 'PartnerName' },
  { header: 'Boys', key: 'MaleCount' },
  { header: 'Girls', key: 'FemaleCount' }
];

const exportGenderExcel = () => {
    const exportRows =
    filters.level === 'STATE'
      ? rows.map(r => ({ ...r, Label: 'STATE' }))
      : rows;
  exportToExcel({
    sheetName: 'Gender Report',
    fileName: `Gender_${filters.level}.xlsx`,
    columns: filters.level === 'SCHOOL'
      ? schoolGenderColumns
      : genderColumns,
    rows:exportRows
  });
};


const casteColumns = 
filters.reportType === 'CASTE' && castePivot
    ? [
        { header: filters.level, key: 'Label' },
        ...castePivot.columns.map(caste => ({
          header: caste,
          key: caste
        })),
        { header: 'Total', key: 'Total' }
      ]
    : [];



const exportCasteExcel = () => {
  exportToExcel({
    sheetName: 'Caste Report',
    fileName: `Caste_${filters.level}.xlsx`,
    columns: casteColumns,
    rows: castePivot.rows
  });
};




  return (
    <>
    <h6 className="fw-bold mb-3"><a onClick={() => navigate('/samsdashboard')}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle',cursor:'pointer'}}></i></a>Student Reports</h6>
    <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='row gy-3'>
                    <div className='col-sm-3'>
                        <label className='form-label'>Report Type</label>
                        <select className='form-select' name="reportType" value={filters.reportType} onChange={handleChange}>
                           <option value=''>Select</option>
                           {REPORT_TYPES.map((item,index) => (
                            <option key={index}  value={item.value}>{item.label}</option>
                           ))}
                        </select>
                    </div>
                    {/* <div className='col-sm-3'>
                        <label className='form-label'>Institution Type</label>
                        <select className='form-select'>
                            <option value="">All</option>
                        
                        </select>
                    </div> */}
                     <div className='col-sm-3'>
                        <label className='form-label'>Level</label>
                        <select className='form-select' name='level' value={filters.level} onChange={handleChange}>
                            <option value="">Select</option>
                            {LEVELS.map((item,index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>

                    {filters.level !== 'STATE' && (
  <div className="col-sm-3">
    <label className='form-label'>Zone</label>
    <select
      name="zoneId"
      value={filters.zoneId || ''}
      onChange={handleChange}
      className="form-select"
    >
      <option value="">All Zones</option>
      {zones.map(z => (
        <option key={z.ZoneId} value={z.ZoneId}>
          {z.ZoneName}
        </option>
      ))}
    </select>
  </div>
)}

{(filters.level === 'DISTRICT' || filters.level === 'SCHOOL') && (
  <div className="col-sm-3">
    <label className='form-label'>District</label>
    <select
      name="districtId"
      value={filters.districtId || ''}
      onChange={handleChange}
      disabled={!filters.zoneId || filteredDistricts.length === 0}
      className="form-select"
    >
      <option value="">All Districts</option>
      {filteredDistricts.map(d => (
        <option key={d.DistrictId} value={d.DistrictId}>
          {d.DistrictName}
        </option>
      ))}
    </select>
  </div>
)}

{filters.level === 'SCHOOL' && (
  <div className="col-sm-4">
    <label className='form-label'>School</label>
    <select
      name="schoolId"
      value={filters.schoolId || ''}
      onChange={handleChange}
      disabled={!filters.zoneId}
      className="form-select"
    >
      <option value="">All Schools</option>
      {filteredSchools.map(s => (
        <option key={s.SchoolID} value={s.SchoolID}>
          {s.PartnerName}
        </option>
      ))}
    </select>
  </div>
)}


                     
                    <div className='col-sm-12 text-center'>
                        <button className='btn btn-primary' onClick={() => fetchStudentReports()}>Generate</button>
                        <button
  className="btn btn-success ms-2"
  disabled={rows.length === 0}
  onClick={() => {
    if (filters.reportType === 'STRENGTH') exportStrengthExcel();
    if (filters.reportType === 'GENDER') exportGenderExcel();
    if (filters.reportType === 'CASTE') exportCasteExcel();
  }}
>
  Export to Excel
</button>

                    </div>

                    <div className='col-sm-12'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                  {renderHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                               {/* {rows.length === 0 && (
      <tr>
        <td colSpan="5" className="text-center">No Data</td>
      </tr>
    )} */}

    {filters.reportType === 'CASTE' && castePivot?.rows.length === 0 && (
    <tr>
      <td colSpan="10" className="text-center">No Data</td>
    </tr>
  )}

  {filters.reportType === 'CASTE'
    ? castePivot.rows.map((row, index) => renderRow(row, index))
    : rows.map((row, index) => renderRow(row, index))
  }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default StudentReports