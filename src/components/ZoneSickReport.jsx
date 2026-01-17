import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const ZoneSickReport = ({ onZoneClick }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)

  const [zonewiseData, setZonewiseData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchZoneWiseData = async () => {
    try {
      setLoading(true)
      const payload = { ZoneId }

      const res = await _fetch('sickzonesummary', payload, false, token)

      if (res.status === 'success') {
        setZonewiseData(res.data)
      } else {
        console.error('Error fetching zonewise data')
      }
    } catch (error) {
      console.error('Error fetching zone wise data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchZoneWiseData()
  }, [])

  const excelColumns = [
  { header: 'Zone Name', key: 'ZoneName', width: 25 },
  { header: 'General Sick', key: 'GeneralSick', width: 15 },
  { header: 'Sent Home', key: 'SentHome', width: 15 },
  { header: 'Referred', key: 'ReferredToHospital', width: 15 },
  { header: 'Admitted', key: 'AdmittedToHospital', width: 15 },
  { header: 'Fever', key: 'FeverCases', width: 15 },
  { header: 'Food Borne', key: 'FoodBorneCases', width: 18 },
  { header: 'Emergency', key: 'EmergencyCases', width: 15 },
  { header: 'Utmost Emergency', key: 'AtmostEmergencyCases', width: 20 }
]

const excelData = zonewiseData.map(item => ({
  ZoneName: item.ZoneName,
  GeneralSick: item.GeneralSick,
  SentHome: item.SentHome,
  ReferredToHospital: item.ReferredToHospital,
  AdmittedToHospital: item.AdmittedToHospital,
  FeverCases: item.FeverCases,
  FoodBorneCases: item.FoodBorneCases,
  EmergencyCases: item.EmergencyCases,
  AtmostEmergencyCases: item.AtmostEmergencyCases
}))

const contextRows = [
  'Report Type : Zonal Wise Sick Report'
]

const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Zonal Summary',
    fileName: 'Zonal_Wise_Sick_Report',
    title: 'Zonal Wise Sick Report',
    context: contextRows
  })
}


  return (
    <>
      <div className="row align-items-center mb-2">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Zonal Wise Sick Report
          </h5>
        </div>
        <div className="col-sm-6 text-end">
    <button
      className="btn btn-success btn-sm"
      onClick={handleExport}
      disabled={zonewiseData.length === 0}
    >
      Export Excel
    </button>
  </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Zone Name</th>
              <th>General Sick</th>
              <th>Sent Home</th>
              <th>Referred</th>
              <th>Admitted</th>
              <th>Fever</th>
              <th>Food Borne</th>
              <th>Emergency</th>
              <th>Atmost Emergency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : zonewiseData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              zonewiseData.map((item) => (
                <tr key={item.ZoneId}>
                  <td>{item.ZoneName}</td>
                  <td>{item.GeneralSick}</td>
                  <td>{item.SentHome}</td>
                  <td>{item.ReferredToHospital}</td>
                  <td>{item.AdmittedToHospital}</td>
                  <td>{item.FeverCases}</td>
                  <td>{item.FoodBorneCases}</td>
                  <td>{item.EmergencyCases}</td>
                  <td>{item.AtmostEmergencyCases}</td> 
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        onZoneClick(item.ZoneId, item.ZoneName)
                      }
                    >
                      View Districts
                    </button>
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

export default ZoneSickReport
