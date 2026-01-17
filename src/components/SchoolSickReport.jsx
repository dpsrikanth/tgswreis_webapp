import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const SchoolSickReport = ({
 
  DistrictId,
  onSchoolClick,
  onBack
}) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [schoolData, setSchoolData] = useState([])
  const [loading, setLoading] = useState(false)


  const CATEGORY_MAP = {
  GeneralSick: 'GENERAL_SICK',
  SentHome: 'SENT_HOME',
  ReferredToHospital: 'REFERRED',
  AdmittedToHospital: 'ADMITTED',
  FeverCases: 'FEVER',
  FoodBorneCases: 'FOODBORNE',
  EmergencyCases: 'EMERGENCY',
  AtmostEmergencyCases: 'ATMOST'
}


  const fetchSchoolData = async () => {
    try {
      setLoading(true)

      const payload = {
       
        DistrictId
      }

      const res = await _fetch(
        'sickschoolsummary',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setSchoolData(res.data)
      } else {
        console.error('Error fetching school data')
      }
    } catch (error) {
      console.error('Error fetching school sick data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchoolData()
  }, [DistrictId])


  const excelColumns = [
  { header: 'School Name', key: 'SchoolName', width: 35 },
  { header: 'School Code', key: 'SchoolCode', width: 15 },
  { header: 'General Sick', key: 'GeneralSick', width: 15 },
  { header: 'Sent Home', key: 'SentHome', width: 15 },
  { header: 'Referred', key: 'ReferredToHospital', width: 15 },
  { header: 'Admitted', key: 'AdmittedToHospital', width: 15 },
  { header: 'Fever', key: 'FeverCases', width: 15 },
  { header: 'Food Borne', key: 'FoodBorneCases', width: 18 },
  { header: 'Emergency', key: 'EmergencyCases', width: 15 },
  { header: 'Utmost Emergency', key: 'AtmostEmergencyCases', width: 20 },
  { header: 'HS Name', key: 'HealthSupervisorName', width: 25 },
  { header: 'HS Contact', key: 'HealthSupervisorMobile', width: 20 }
]

const excelData = schoolData.map(item => ({
  SchoolName: item.SchoolName,
  SchoolCode: item.SchoolCode,
  GeneralSick: item.GeneralSick,
  SentHome: item.SentHome,
  ReferredToHospital: item.ReferredToHospital,
  AdmittedToHospital: item.AdmittedToHospital,
  FeverCases: item.FeverCases,
  FoodBorneCases: item.FoodBorneCases,
  EmergencyCases: item.EmergencyCases,
  AtmostEmergencyCases: item.AtmostEmergencyCases,
  HealthSupervisorName: item.HealthSupervisorName,
  HealthSupervisorMobile: item.HealthSupervisorMobile
}))


const contextRows = [
  'Report Type : School Wise Sick Report'
]


const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'School Summary',
    fileName: 'School_Wise_Sick_Report',
    title: 'School Wise Sick Report',
    context: contextRows
  })
}


  return (
    <>
      <div className="row align-items-center mb-2">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            School Wise Sick Report
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
      className="btn btn-success btn-sm me-2"
      onClick={handleExport}
      disabled={schoolData.length === 0}
    >
      Export Excel
    </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
           ← Back to Districts
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>School Name</th>
              <th>School Code</th>
              <th>General Sick</th>
              <th>Sent Home</th>
              <th>Referred</th>
              <th>Admitted</th>
              <th>Fever</th>
              <th>Food Borne</th>
              <th>Emergency</th>
              <th>Atmost Emergency</th>
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
            ) : schoolData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              schoolData.map((item) => (
                <tr key={item.SchoolID}>
                  <td>{item.SchoolName}</td>
                  <td>{item.SchoolCode}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.GeneralSick)} style={item.GeneralSick > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.GeneralSick}</td>
                   <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.SentHome)} style={item.SentHome > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.SentHome}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.ReferredToHospital)} style={item.ReferredToHospital > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.ReferredToHospital}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.AdmittedToHospital)} style={item.AdmittedToHospital > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.AdmittedToHospital}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.FeverCases)} style={item.FeverCases > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.FeverCases}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.FoodBorneCases)} style={item.FoodBorneCases > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.FoodBorneCases}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.EmergencyCases)} style={item.EmergencyCases > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.EmergencyCases}</td>
                  <td onClick={() => onSchoolClick(item.SchoolID,item.SchoolName,item.SchoolCode,CATEGORY_MAP.AtmostEmergencyCases)} style={item.AtmostEmergencyCases > 0 ? {cursor:'pointer',color:'#0000FF',fontWeight: 'bold'} : {}}>{item.AtmostEmergencyCases}</td>
                  <td>{item.HealthSupervisorName}</td>
                  <td>{item.HealthSupervisorMobile}</td>
                  {/* <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        onSchoolClick(
                          item.SchoolID,
                          item.SchoolName,
                          item.SchoolCode
                        )
                      }
                    >
                      View Categories
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SchoolSickReport
