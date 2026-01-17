import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const DistrictSickReport = ({
  ZoneId,
  ZoneName,
  onDistrictClick,
  onBack
}) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [districtData, setDistrictData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDistrictData = async () => {
    try {
      setLoading(true)

      const payload = { ZoneId }
      const res = await _fetch(
        'sickdistrictsummary',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setDistrictData(res.data)
      } else {
        console.error('Error fetching district data')
      }
    } catch (error) {
      console.error('Error fetching district data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistrictData()
  }, [ZoneId])

  const excelColumns = [
  { header: 'District Name', key: 'DistrictName', width: 25 },
  { header: 'General Sick', key: 'GeneralSick', width: 15 },
  { header: 'Sent Home', key: 'SentHome', width: 15 },
  { header: 'Referred', key: 'ReferredToHospital', width: 15 },
  { header: 'Admitted', key: 'AdmittedToHospital', width: 15 },
  { header: 'Fever', key: 'FeverCases', width: 15 },
  { header: 'Food Borne', key: 'FoodBorneCases', width: 18 },
  { header: 'Emergency', key: 'EmergencyCases', width: 15 },
  { header: 'Utmost Emergency', key: 'AtmostEmergencyCases', width: 20 }
]

const excelData = districtData.map(item => ({
  DistrictName: item.DistrictName,
  GeneralSick: item.GeneralSick,
  SentHome: item.SentHome,
  ReferredToHospital: item.ReferredToHospital,
  AdmittedToHospital: item.AdmittedToHospital,
  FeverCases: item.FeverCases,
  FoodBorneCases: item.FoodBorneCases,
  EmergencyCases: item.EmergencyCases,
  AtmostEmergencyCases: item.AtmostEmergencyCases
}))

const contextRows = []

if (ZoneName) {
  contextRows.push(`Zone : ${ZoneName}`)
}

contextRows.push('Report Type : District Wise Sick Report')

const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'District Summary',
    fileName: 'District_Wise_Sick_Report',
    title: `District Wise Sick Report – ${ZoneName}`,
    context: contextRows
  })
}


  return (
    <>
      <div className="row align-items-center mb-2">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            District Wise Sick Report – {ZoneName}
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
      className="btn btn-success btn-sm me-2"
      onClick={handleExport}
      disabled={districtData.length === 0}
    >
      Export Excel
    </button>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
           ← Back to Zones
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>District Name</th>
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
            ) : districtData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              districtData.map((item) => (
                <tr key={item.DistrictId}>
                  <td>{item.DistrictName}</td>
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
                        onDistrictClick(
                          item.DistrictId,
                          item.DistrictName
                        )
                      }
                    >
                      View Schools
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

export default DistrictSickReport
