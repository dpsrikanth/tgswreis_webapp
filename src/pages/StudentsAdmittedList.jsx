import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'
import { exportToExcel } from '../libs/exportToExcel'
import { useDebounce } from '../libs/useDebounce'



const StudentsAdmittedList = () => {
 const token = useSelector((state) => state.userappdetails.TOKEN)
      const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
      const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
    
      const [entryDate, setEntryDate] = useState('')
      const [students, setStudents] = useState([])
      const [loading, setLoading] = useState(false)
      const [searchInput,setSearchInput] = useState('');
      const debouncedSearch = useDebounce(searchInput,300);
      const navigate = useNavigate();
    
      const fetchStudents = async () => {
      
    
        try {
          setLoading(true)
           let payload ={};
            if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }
    
          const res = await _fetch(
            'studentsadmitted',
            payload,
            false,
            token
          )
    
          if (res.status === 'success') {
            setStudents(res.data)
          } else {
            setStudents([])
          }
        } catch (error) {
          console.error('Error fetching admitted students list', error)
          setStudents([])
        } finally {
          setLoading(false)
        }
      }
    
      useEffect(() => {
       fetchStudents();
      },[])


      const filteredStudents = students.filter((s) => {
        const text = `${s.FName} ${s.SchoolCode} ${s.SchoolName}`.toLowerCase();
        return text.includes(debouncedSearch.toLowerCase());
      })

      const excelColumns = [
  { header: 'Zone', key: 'ZoneName', width: 18 },
  { header: 'District', key: 'DistrictName', width: 18 },
  { header: 'School Code', key: 'SchoolCode', width: 15 },
  { header: 'School Name', key: 'SchoolName', width: 30 },
  { header: 'HS Name', key: 'HealthSupervisorName', width: 22 },
  { header: 'HS Contact', key: 'HealthSupervisorMobile', width: 18 },
  { header: 'Student Name', key: 'FName', width: 22 },
  { header: 'Name of Hospital', key: 'HospitalAdmittedName', width: 30 },
  { header: 'Date of Admission', key: 'HospitalAdmittedDate', width: 18 },
  { header: 'Diagnosis', key: 'HospitalAdmittedDiagnosis', width: 30 },
  { header: 'Doctor Remarks', key: 'HospitalAdmittedRemarks', width: 30 },
  { header: 'General Remarks', key: 'AdmittedHospitalRemarks', width: 30 },
  { header: 'Date of Discharge', key: 'DischargeDate', width: 18 },
  { header: 'School Rejoined Date', key: 'SchoolRejoinDate', width: 20 }
]


const contextRows = []

if (DistrictId && DistrictId !== 0 && filteredStudents.length > 0) {
  contextRows.push(`District : ${filteredStudents[0].DistrictName}`)
} else if (ZoneId && ZoneId !== 0 && filteredStudents.length > 0) {
  contextRows.push(`Zone : ${filteredStudents[0].ZoneName}`)
}


const handleExport = () => {
  exportToExcel({
    data: filteredStudents,
    columns: excelColumns,
    sheetName: 'Admitted Students',
    fileName: 'Admitted_Students',
    title: 'Admitted Students Report',
    context: contextRows
  })
}



  return (
    <>
      <div className='white-box shadow-sm'>
      {/* Header */}
      <div className="row align-items-center mb-3 gy-3">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Admitted Students List
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
  className="btn btn-success btn-sm me-2"
  onClick={handleExport}
  disabled={loading || filteredStudents.length === 0}
>
  Export Excel
</button>

          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className='col-sm-12'>
          <input type='text' placeholder='Search by Student Name, or School Code or School Name' className='form-control' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
      </div>

      {/* Date Filter */}
      {/* <div className="row mb-3">
        <div className="col-sm-3">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>
        <div className="col-sm-3 d-flex align-items-end">
          <button className="btn btn-primary" onClick={fetchStudents}>
            Fetch
          </button>
        </div>
      </div> */}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Zone</th>
              <th>District</th>
              <th>School Code</th>
              <th>School Name</th>
              <th>HS Name</th>
              <th>HS Contact</th>
              <th>Student Name</th>
              <th>Name of Hospital</th>
              <th>Date of Admission</th>
              <th>Diagnosis</th>
              <th>Remarks</th>
              <th>Date of Discharge</th>
              <th>School Rejoined Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No students found
                </td>
              </tr>
            ) : (
             filteredStudents.map((s) => (
                <tr key={s.SchoolID}>
                  <td>{s.ZoneName}</td>
                  <td>{s.DistrictName}</td>
                  <td>{s.SchoolCode}</td>
                  <td>{s.SchoolName}</td>
                  <td>{s.HealthSupervisorName}</td>
                  <td>{s.HealthSupervisorMobile}</td>
                  <td>{s.FName}</td>
                  <td>{s.HospitalAdmittedName}</td>
                  <td>{s.HospitalAdmittedDate}</td>
                  <td>{s.HospitalAdmittedDiagnosis}</td>
                  <td>{s.HospitalAdmittedRemarks}</td>
                  <td>{s.DischargeDate}</td>
                  <td>{s.SchoolRejoinDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default StudentsAdmittedList