import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'
import { exportToExcel } from '../libs/exportToExcel'


const HealthSupervisorsList = ({ ZoneId, DistrictId }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const fetchSupervisors = async () => {
    try {
      setLoading(true)

 let payload ={};
       if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

      const res = await _fetch(
        'healthsupervisorslist',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setSupervisors(res.data)
      }
    } catch (error) {
      console.error('Error fetching health supervisors', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSupervisors()
  }, [ZoneId, DistrictId])

  const excelColumns = [
  { header: 'S.No', key: 'SNo', width: 8 },
  { header: 'Zone', key: 'ZoneName', width: 18 },
  { header: 'District', key: 'DistrictName', width: 18 },
  { header: 'School Code', key: 'SchoolCode', width: 15 },
  { header: 'School Name', key: 'SchoolName', width: 30 },
  { header: 'Principal Contact', key: 'PrincipalContact', width: 22 },
  { header: 'Supervisor Name', key: 'HealthSupervisorName', width: 25 },
  { header: 'HS Mobile Number', key: 'HealthSupervisorMobile', width: 20 }
]

const excelData = supervisors.map((item, index) => ({
  ...item,
  SNo: index + 1
}))


const contextRows = []

if (DistrictId && DistrictId !== 0 && supervisors.length > 0) {
  contextRows.push(`District : ${supervisors[0].DistrictName}`)
} else if (ZoneId && ZoneId !== 0 && supervisors.length > 0) {
  contextRows.push(`Zone : ${supervisors[0].ZoneName}`)
}


const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Health Supervisors',
    fileName: 'Health_Supervisors_List',
    title: 'Health Supervisors List',
    context: contextRows
  })
}


  return (
    <>
    <div className='white-box shadow-sm'>
      <div className="row align-items-center mb-3">
        <div className='col-sm-6'>
        <h5 className="fw-bold" style={{ color: '#cc1178' }}>
        Health Supervisors List
      </h5>
        </div>
        <div className="col-sm-6 text-end">
           <button
    className="btn btn-success btn-sm me-2"
    onClick={handleExport}
    disabled={loading || supervisors.length === 0}
  >
    Export Excel
  </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sickdashboard')}>
            Back
          </button>
        </div>
      </div>
      

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
               <th>Zone</th>
                 <th>District</th>
              <th>School Code</th>
              <th>School</th>
               <th>Principal Contact Number</th>
              <th>Supervisor Name</th>
              <th>HS Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : supervisors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No supervisors found
                </td>
              </tr>
            ) : (
              supervisors.map((item, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                   <td>{item.ZoneName}</td>
                    <td>{item.DistrictName}</td>
                  <td>{item.SchoolCode}</td>
                  <td>{item.SchoolName}</td>
                   <td>{item.PrincipalContact}</td>
                 
                 
                 
                  <td className="fw-bold">
                    {item.HealthSupervisorName}
                  </td>
                  <td>
                    <a href={`tel:${item.HealthSupervisorMobile}`}>
                      {item.HealthSupervisorMobile}
                    </a>
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

export default HealthSupervisorsList
