import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'

const ChronicStudentsList = ({ ZoneId, DistrictId }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const fetchChronicStudents = async () => {
    try {
      setLoading(true)

      let payload ={};
       if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

      const res = await _fetch(
        'chronicstudentslist',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setStudents(res.data)
      }
    } catch (error) {
      console.error('Error fetching chronic students', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChronicStudents()
  }, [ZoneId, DistrictId])

  return (
    <>
    <div className='white-box shadow-sm'>
      <div className="row align-items-center mb-3">
        <div className='col-sm-6'>
       <h5 className="fw-bold" style={{ color: '#cc1178' }}>
        Students with Chronic Conditions
      </h5>
        </div>
        <div className='col-sm-6 text-end'>
           <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sickdashboard')}>
            Back
          </button>
        </div>
      </div>
   

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Student Name</th>
              <th>Gender</th>
              <th>School</th>
              <th>District</th>
              <th>Zone</th>
              <th>Chronic Condition</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              students.map((item, index) => (
                <tr key={index}>
                  <td>{item.FName} {item.LName}</td>
                  <td>{item.GenderName}</td>
                  <td>{item.SchoolName}</td>
                  <td>{item.DistrictName}</td>
                  <td>{item.ZoneName}</td>
                  <td className="fw-bold text-danger">
                    {item.ChronicDisease}
                  </td>
                  <td>
                    {item.LastSyncedAt
                      ? new Date(item.LastSyncedAt).toLocaleDateString('en-IN')
                      : '-'}
                  </td>
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

export default ChronicStudentsList
