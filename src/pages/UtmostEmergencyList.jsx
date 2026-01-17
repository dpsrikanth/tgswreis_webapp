import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const UtmostEmergencyList = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId)
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUtmostEmergency = async () => {
    try {
      setLoading(true)
        let payload ={};
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
      )

      if (res.status === 'success') {
        setStudents(res.data)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching utmost emergency students', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUtmostEmergency()
  }, [])


  const excelColumns = [
  { header: 'Student Name', key: 'StudentName', width: 25 },
  { header: 'Gender', key: 'GenderName', width: 12 },
  { header: 'School', key: 'SchoolName', width: 35 },
  { header: 'School Code', key: 'SchoolCode', width: 15 },
  { header: 'Zone', key: 'ZoneName', width: 18 },
  { header: 'District', key: 'DistrictName', width: 18 },
  { header: 'Health Date', key: 'HealthDate', width: 18 },
  { header: 'Temperature', key: 'ClinicalTemperature', width: 15 },
  { header: 'Clinical Details', key: 'ClinicalDetails', width: 35 },
  { header: 'Action Taken', key: 'ClinicalActionTaken', width: 35 }
]

const excelData = students.map(item => ({
  ...item,
  StudentName: `${item.FName} ${item.LName || ''}`.trim(),
  HealthDate: item.HealthIssueDate
    ? new Date(item.HealthIssueDate).toLocaleDateString('en-IN')
    : '-',
  ClinicalTemperature: item.ClinicalTemperature ?? '-',
  ClinicalDetails: item.ClinicalDetails ?? '-',
  ClinicalActionTaken: item.ClinicalActionTaken ?? '-'
}))

const contextRows = []

if (DistrictId && DistrictId !== 0 && students.length > 0) {
  contextRows.push(`District : ${students[0].DistrictName}`)
} else if (ZoneId && ZoneId !== 0 && students.length > 0) {
  contextRows.push(`Zone : ${students[0].ZoneName}`)
}

const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Utmost Emergency',
    fileName: 'Utmost_Emergency_Students',
    title: 'Utmost Emergency Students',
    context: contextRows
  })
}


  return (
    <>
      
      <div className='white-box shadow-sm'>
       {/* Header */}
        <div className="row align-items-center mb-3">
        <div className="col-sm-6">
          <h5 className="fw-bold text-danger">
            🔴 Utmost Emergency Students
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
    className="btn btn-success btn-sm me-2"
    onClick={handleExport}
    disabled={loading || students.length === 0}
  >
    Export Excel
  </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

       {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-danger">
            <tr>
              <th>Student Name</th>
              <th>Gender</th>
              <th>School</th>
              <th>Zone</th>
              <th>District</th>
              <th>Health Date</th>
              <th>Temperature</th>
              <th>Clinical Details</th>
              <th>Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No utmost emergency cases found
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.UserId}>
                  <td>{s.FName} {s.LName}</td>
                  <td>{s.GenderName}</td>
                  <td>
                    {s.SchoolName}
                    <div className="text-muted small">
                      {s.SchoolCode}
                    </div>
                  </td>
                  <td>{s.ZoneName}</td>
                  <td>{s.DistrictName}</td>
                  <td>
                    {s.HealthIssueDate
                      ? new Date(s.HealthIssueDate).toLocaleDateString('en-IN')
                      : '-'}
                  </td>
                  <td className="fw-bold text-danger">
                    {s.ClinicalTemperature ?? '-'}
                  </td>
                  <td>{s.ClinicalDetails ?? '-'}</td>
                  <td>{s.ClinicalActionTaken ?? '-'}</td>
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

export default UtmostEmergencyList
