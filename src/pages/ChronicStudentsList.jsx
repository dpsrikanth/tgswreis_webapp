import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'

const ChronicStudentsList = ({ ZoneId, DistrictId }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

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
      <h5 className="fw-bold mb-3" style={{ color: '#cc1178' }}>
        Students with Chronic Conditions
      </h5>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
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
    </>
  )
}

export default ChronicStudentsList
