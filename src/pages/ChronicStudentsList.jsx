import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useFetcher, useNavigate } from 'react-router-dom'
import { exportToExcel } from '../libs/exportToExcel'
import { useDebounce } from '../libs/useDebounce'


const ChronicStudentsList = ({ ZoneId, DistrictId }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput,setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput,300);
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


  const filteredStudents = students.filter((s) => {
    const text = `${s.FName} ${s.LName} ${s.SchoolCode} ${s.SchoolName}`.toLowerCase();
    return text.includes(debouncedSearch.toLowerCase());
  })

  const excelColumns = [
  { header: 'Student Name', key: 'StudentName', width: 25 },
  { header: 'Gender', key: 'GenderName', width: 12 },
  { header: 'School', key: 'SchoolName', width: 30 },
  { header: 'District', key: 'DistrictName', width: 20 },
  { header: 'Zone', key: 'ZoneName', width: 20 },
  { header: 'Chronic Condition', key: 'ChronicDisease', width: 30 },
  { header: 'Treatment Given', key: 'ChronicTreatment', width: 30 },
  { header: 'HS Name', key: 'HealthSupervisorName', width: 22 },
  { header: 'HS Contact', key: 'HealthSupervisorMobile', width: 20 },
  { header: 'Last Updated', key: 'LastUpdated', width: 18 }
]

const excelData = filteredStudents.map(item => ({
  ...item,
  StudentName: `${item.FName} ${item.LName || ''}`.trim(),
  ChronicTreatment: item.ChronicTreatment || '-',
  LastUpdated: item.LastSyncedAt
    ? new Date(item.LastSyncedAt).toLocaleDateString('en-IN')
    : '-'
}))

const contextRows = []

if (DistrictId && DistrictId !== 0 && filteredStudents.length > 0) {
  contextRows.push(`District : ${filteredStudents[0].DistrictName}`)
} else if (ZoneId && ZoneId !== 0 && students.length > 0) {
  contextRows.push(`Zone : ${filteredStudents[0].ZoneName}`)
}

const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Chronic Students',
    fileName: 'Chronic_Students_List',
    title: 'Students with Chronic Conditions',
    context: contextRows
  })
}



  return (
    <>
    <div className='white-box shadow-sm'>
      <div className="row align-items-center mb-3 gy-3">
        <div className='col-sm-6'>
       <h5 className="fw-bold" style={{ color: '#cc1178' }}>
        Students with Chronic Conditions
      </h5>
        </div>
        <div className='col-sm-6 text-end'>
            <button
    className="btn btn-success btn-sm me-2"
    onClick={handleExport}
    disabled={loading || students.length === 0}
  >
    Export Excel
  </button>
           <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sickdashboard')}>
            Back
          </button>
        </div>
        <div className='col-sm-12'>
          <input type='text' placeholder='Search By Student Name, School Code and School Name' className='form-control' value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
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
              <th>Treatment Given</th>
              <th>HS Name</th>
              <th>HS Contact</th>
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
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              filteredStudents.map((item, index) => (
                <tr key={index}>
                  <td>{item.FName} {item.LName}</td>
                  <td>{item.GenderName}</td>
                  <td>{item.SchoolName}</td>
                  <td>{item.DistrictName}</td>
                  <td>{item.ZoneName}</td>
                  <td className="fw-bold text-danger">
                    {item.ChronicDisease}
                  </td>
                  <td>{item.ChronicTreatment || '-'}</td>
                  <td>{item.HealthSupervisorName}</td>
                  <td>{item.HealthSupervisorMobile}</td>
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
