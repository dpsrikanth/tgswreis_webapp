import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'

const StudentsRecoveredList = ({defaultDate}) => {
    const token = useSelector((state) => state.userappdetails.TOKEN)
      const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
      const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
    
      const [entryDate, setEntryDate] = useState(defaultDate || '')
      const [students, setStudents] = useState([])
      const [loading, setLoading] = useState(false)
      const navigate = useNavigate();
    
      const fetchStudents = async () => {
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
            'studentsrecovered',
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
          console.error('Error fetching schools not entered sick', error)
          setStudents([])
        } finally {
          setLoading(false)
        }
      }
    
      useEffect(() => {
        if (entryDate) {
          fetchStudents()
        }
      }, [entryDate])
    
  return (
    <>
     <div className='white-box shadow-sm'>
      {/* Header */}
      <div className="row align-items-center mb-3">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Recovered Students List
          </h5>
        </div>
        <div className="col-sm-6 text-end">
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
          <button className="btn btn-primary" onClick={fetchStudents}>
            Fetch
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Student Name</th>
              <th>School Code</th>
              <th>School Name</th>
              <th>Zone</th>
              <th>District</th>
             
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.SchoolID}>
                  <td>{s.FName}</td>
                  <td>{s.SchoolCode}</td>
                  <td>{s.SchoolName}</td>
                  <td>{s.ZoneName}</td>
                  <td>{s.DistrictName}</td>
                
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

export default StudentsRecoveredList