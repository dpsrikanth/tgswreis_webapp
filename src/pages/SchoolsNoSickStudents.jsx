import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'
import { exportToExcel } from '../libs/exportToExcel'


const SchoolsNoSickStudents = ({defaultDate}) => {
     const token = useSelector((state) => state.userappdetails.TOKEN)
      const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
      const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
    
      const [entryDate, setEntryDate] = useState(defaultDate || '')
      const [schools, setSchools] = useState([])
      const [loading, setLoading] = useState(false)
      const navigate = useNavigate();
    
      const fetchSchools = async () => {
        if (!entryDate) return
    
        try {
          setLoading(true)
           let payload ={};
           if (DistrictId && DistrictId !== 0) {
          payload.DistrictId = DistrictId;
          payload.SickDate = entryDate
        } else if (ZoneId && ZoneId !== 0) {
          payload.ZoneId = ZoneId;
          payload.SickDate = entryDate
        }else {
            payload.SickDate = entryDate
        }
    
          const res = await _fetch(
            'nosickstudentstoday',
            payload,
            false,
            token
          )
    
          if (res.status === 'success') {
            setSchools(res.data)
          } else {
            setSchools([])
          }
        } catch (error) {
          console.error('Error fetching schools not entered sick', error)
          setSchools([])
        } finally {
          setLoading(false)
        }
      }
    
      useEffect(() => {
        if (entryDate) {
          fetchSchools()
        }
      }, [entryDate])


      const excelColumns = [
        { header: 'Zone', key: 'ZoneName', width: 20 },
  { header: 'District', key: 'DistrictName', width: 20 },
  { header: 'School Code', key: 'SchoolCode', width: 18 },
  { header: 'School Name', key: 'SchoolName', width: 35 },
    { header: 'Principal Contact', key: 'ContactMobile', width: 20 },
  { header: 'HS Name', key: 'HealthSupervisorName', width: 20 },
  { header: 'HS Contact', key: 'HealthSupervisorMobile', width: 20 },
]

const contextRows = []

if (DistrictId && DistrictId !== 0 && schools.length > 0) {
  contextRows.push(`District : ${schools[0].DistrictName}`)
} else if (ZoneId && ZoneId !== 0 && schools.length > 0) {
  contextRows.push(`Zone : ${schools[0].ZoneName}`)
}

if (entryDate) {
  contextRows.push(`Date : ${entryDate}`)
}


const handleExport = () => {
  exportToExcel({
    data: schools,
    columns: excelColumns,
    sheetName: 'No Sick Students',
    fileName: 'Schools_No_Sick_Students',
    title: 'Schools With No Sick Students',
    context: contextRows
  })
}

    
  return (
    <>
     <div className='white-box shadow-sm'>
      {/* Header */}
      <div className="row align-items-center mb-3">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Schools With No Sick Students
          </h5>
        </div>
        <div className="col-sm-6 text-end">
           <button
    className="btn btn-success btn-sm me-2"
    onClick={handleExport}
    disabled={loading || schools.length === 0}
  >
    Export Excel
  </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="row mb-3">
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
          <button className="btn btn-primary" onClick={fetchSchools}>
            Fetch
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
                <th>Zone</th>
              <th>District</th>
              <th>School Code</th>
              <th>School Name</th>
              <th>Principal Contact</th>
              <th>HS Name</th>
              <th>HS Contact</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No schools found
                </td>
              </tr>
            ) : (
              schools.map((s,index) => (
                <tr key={s.SchoolID}>
                  <td>{index+1}</td>
                  <td>{s.ZoneName}</td>
                  <td>{s.DistrictName}</td>
                  <td>{s.SchoolCode}</td>
                  <td>{s.SchoolName}</td>
                  <td>{s.ContactMobile}</td>
                  <td>{s.HealthSupervisorName}</td>
                  <td>{s.HealthSupervisorMobile}</td>
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

export default SchoolsNoSickStudents